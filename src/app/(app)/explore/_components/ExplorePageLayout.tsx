"use client";

import { FilterTag, RelevantSessionProps } from "@/types/MiscTypes";
import ProfileSearchFilter from "./ProfileSearchFilter";
import { handleError } from "@/lib/utils";
import { useBetterMediaQuery, useWindowDimensions } from "@/lib/hooks";
import NavBar from "@/app/(app)/_components/Navbar";
import { useForm } from "react-hook-form";
import { ExploreUserType } from "@/types/UserModelTypes";
import { useToast, ToastId } from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState, memo } from "react";
import UserProfileSummaryBox from "./UserProfileSummaryBox";
import { sendFriendRequest } from "@/actions/RequestsModifyActions";
import { ActionResponse } from "@/types/RequestDataTypes";
import {
  ListChildComponentProps,
  VariableSizeList as VirtualizedList,
  areEqual,
} from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { UserCacheResponse } from "@/types/CacheModalTypes";
import { kv } from "@vercel/kv";
import { EXPLORE_PAGE_SLICE_SIZE } from "@/lib/constants";

interface ExplorePageLayoutProps extends RelevantSessionProps {
  users: ExploreUserType[];
  success: boolean;
  error: string | null;
  nextUnfetchedIndex: number;
}

interface ISessionTagInfo {
  tagList: FilterTag[];
}

export default function ExplorePageLayout({
  profilePic,
  email,
  name,
  success,
  users,
  error,
  nextUnfetchedIndex,
}: ExplorePageLayoutProps) {
  const toast = useToast();
  const toastRef = React.useRef<ToastId>();
  const [usersState, setUsersState] = useState<ExploreUserType[]>(users);
  const [filteredUsersState, setFilteredUsersState] =
    useState<ExploreUserType[]>(users);
  const [nextIndex, setNextIndex] = useState<number>(nextUnfetchedIndex);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState<boolean>(true);
  const windowDimensions = useWindowDimensions();

  const loadMoreUsers = async () => {
    const cachedInfo = await kv.get<UserCacheResponse>(email);

    if (!cachedInfo || !cachedInfo.exploreFeed) {
      toast({
        title: "User info out of date",
        description: "Please refresh the page to get updated user info.",
        status: "error",
        duration: 2000,
        isClosable: false,
      });
    } else if (nextIndex >= cachedInfo.exploreFeed.length) {
      setIsMoreDataAvailable(false);
    } else {
      const nextUsersSlice = cachedInfo.exploreFeed.slice(
        nextIndex,
        nextIndex + EXPLORE_PAGE_SLICE_SIZE,
      );
      setUsersState((prevUsersState) => prevUsersState.concat(nextUsersSlice));
      setNextIndex((prevNextIndex) => prevNextIndex + EXPLORE_PAGE_SLICE_SIZE);
    }
  };

  useEffect(() => {
    if (toastRef.current) return;
    if (!success) {
      toastRef.current = toast({
        title: error,
        status: "error",
        duration: 2000,
        isClosable: false,
      });
    }
  }, [error, success, toast]);

  const isTabletOrMobile = useBetterMediaQuery({
    query: "(max-width: 1280px)",
  });

  const { resetField, setValue, watch, register } = useForm<ISessionTagInfo>({
    mode: "all",
    defaultValues: {
      tagList: [],
    },
  });
  const tagListState = useRef(watch("tagList"));

  const tagFilter = useCallback((user: ExploreUserType) => {
    return (
      tagListState.current.every((e) =>
        user.courseList.map((c) => c.courseAbrName).includes(e.courseAbrName),
      ) || tagListState.current.length === 0
    );
  }, []);

  useEffect(() => {
    setFilteredUsersState(usersState.filter((user) => tagFilter(user)));
  }, [tagFilter, tagListState, usersState]);

  const handleDeleteCallback = (otherUser: ExploreUserType) =>
    setUsersState(usersState.filter((user) => user._id != otherUser._id));

  const sendFriendRequestCallback = async (otherUser: ExploreUserType) => {
    const response: ActionResponse = JSON.parse(
      await sendFriendRequest(JSON.stringify({ otherUserId: otherUser._id })),
    );

    if (response.status === 200) {
      handleDeleteCallback(otherUser);

      toast({
        title: "Friend request sent",
        status: "success",
        duration: 2000,
        isClosable: false,
      });
    } else handleError(toast, response);
  };

  const mobileLayout = () => (
    <div className="w-screen flex bg-[#F2F2F2]">
      <div className="fixed bg-[#F2F2F2] rounded-full z-10 top-[4.166667%] left-[4.166667%] lg:top-[1.25%] lg:left-[1.25%]">
        <ProfileSearchFilter
          resetField={resetField}
          setValue={setValue}
          watch={watch}
          register={register}
        />
      </div>
      <div className="fixed bg-[#F2F2F2] rounded-full z-10 top-[4.166667%] right-[4.166667%] lg:top-[1.25%] lg:right-[1.25%]">
        <NavBar profilePic={profilePic} email={email} name={name} />
      </div>
      <div className="mx-auto">
        <InfiniteLoader
          isItemLoaded={(index) => index < filteredUsersState.length}
          itemCount={filteredUsersState.length + 1}
          loadMoreItems={isMoreDataAvailable ? loadMoreUsers : () => {}}
          threshold={4}
        >
          {({ onItemsRendered, ref }) => (
            <VirtualizedList
              height={windowDimensions.height}
              width={windowDimensions.width * (11 / 12)}
              itemCount={filteredUsersState.length}
              itemSize={(index) => 823 + (index == 0 ? 35 : 0)}
              ref={ref}
              onItemsRendered={onItemsRendered}
            >
              {memo(function mobileFeed({
                index,
                style,
              }: ListChildComponentProps) {
                const user = filteredUsersState[index];

                style =
                  index == 0
                    ? {
                        ...style,
                        top: `${parseFloat(style.top as string) + 35}px`,
                      }
                    : style;

                return (
                  <div
                    key={index}
                    style={style}
                    className={`w-${windowDimensions.width * (11 / 12)}px`}
                  >
                    <UserProfileSummaryBox
                      profileMatch={user.profileMatch}
                      profileImage={user.profileImage}
                      major={user.major}
                      gradYear={user.gradYear}
                      firstName={user.firstName}
                      lastName={user.lastName}
                      userBio={user.userBio}
                      pronouns={user.pronouns}
                      courseList={user.courseList}
                      userStudyPreferences={user.userStudyPreferences}
                      sendFriendRequestCallback={() =>
                        sendFriendRequestCallback(user)
                      }
                      handleTempDeleteCallback={() =>
                        handleDeleteCallback(user)
                      }
                    />
                  </div>
                );
              }, areEqual)}
            </VirtualizedList>
          )}
        </InfiniteLoader>
      </div>
    </div>
  );

  const desktopLayout = () => (
    <div className="w-screen h-screen">
      <NavBar profilePic={profilePic} email={email} name={name} />
      <div className="w-full h-[calc(100%_-_80px)] flex flex-row">
        <div className="w-[20%]">
          <ProfileSearchFilter
            resetField={resetField}
            setValue={setValue}
            watch={watch}
            register={register}
          />
        </div>
        <div className="bg-[#F2F2F2] px-8">
          <InfiniteLoader
            isItemLoaded={(index) => index < filteredUsersState.length}
            itemCount={filteredUsersState.length + 1}
            loadMoreItems={isMoreDataAvailable ? loadMoreUsers : () => {}}
            threshold={4}
          >
            {({ onItemsRendered, ref }) => (
              <VirtualizedList
                height={windowDimensions.height - 80}
                width={windowDimensions.width * 0.8 - 64}
                itemCount={filteredUsersState.length}
                itemSize={(index) => 766 + (index == 0 ? 32 : 0)}
                ref={ref}
                onItemsRendered={onItemsRendered}
              >
                {memo(function desktopFeed({
                  index,
                  style,
                }: ListChildComponentProps) {
                  const user = filteredUsersState[index];

                  style =
                    index == 0
                      ? {
                          ...style,
                          top: `${parseFloat(style.top as string) + 32}px`,
                        }
                      : style;

                  return (
                    <div key={index} style={style}>
                      <UserProfileSummaryBox
                        profileMatch={user.profileMatch}
                        profileImage={user.profileImage}
                        major={user.major}
                        gradYear={user.gradYear}
                        firstName={user.firstName}
                        lastName={user.lastName}
                        userBio={user.userBio}
                        pronouns={user.pronouns}
                        courseList={user.courseList}
                        userStudyPreferences={user.userStudyPreferences}
                        sendFriendRequestCallback={() =>
                          sendFriendRequestCallback(user)
                        }
                        handleTempDeleteCallback={() =>
                          handleDeleteCallback(user)
                        }
                      />
                    </div>
                  );
                }, areEqual)}
              </VirtualizedList>
            )}
          </InfiniteLoader>
        </div>
      </div>
    </div>
  );

  return isTabletOrMobile ? mobileLayout() : desktopLayout();
}
