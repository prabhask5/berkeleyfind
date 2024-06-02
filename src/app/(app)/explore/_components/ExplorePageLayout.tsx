"use client";

import { FilterTag, RelevantSessionProps } from "@/types/MiscTypes";
import ProfileSearchFilter from "./ProfileSearchFilter";
import { handleError, useBetterMediaQuery } from "@/lib/utils";
import NavBar from "@/app/(app)/_components/Navbar";
import { useForm } from "react-hook-form";
import { ExploreUserType } from "@/types/UserModelTypes";
import { useToast, ToastId } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import UserProfileSummaryBox from "./UserProfileSummaryBox";
import { sendFriendRequest } from "@/app/actions/RequestsModifyActions";
import { ActionResponse } from "@/types/RequestDataTypes";

interface ExplorePageLayoutProps extends RelevantSessionProps {
  users: ExploreUserType[] | null;
  success: boolean;
  error: string | null;
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
}: ExplorePageLayoutProps) {
  const toast = useToast();
  const toastRef = React.useRef<ToastId>();
  const [usersState, setUsersState] = useState<ExploreUserType[]>(users ?? []);

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

  const tagFilter = (user: ExploreUserType) => {
    const tagListState = watch("tagList");

    return (
      tagListState.every((e) =>
        user.courseList.map((c) => c.courseAbrName).includes(e.courseAbrName),
      ) || tagListState.length === 0
    );
  };

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

  const profileCardLayouts = usersState
    .filter((user) => tagFilter(user))
    .map((user, index) => (
      <div key={index} className={index > 0 ? "mt-20" : ""}>
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
          sendFriendRequestCallback={() => sendFriendRequestCallback(user)}
          handleTempDeleteCallback={() => handleDeleteCallback(user)}
        />
      </div>
    ));

  const mobileLayout = () => (
    <div className="w-screen h-screen flex">
      <div className="fixed bg-white rounded-full z-10 top-[4.166667%] left-[4.166667%] lg:top-[1.25%] lg:left-[1.25%]">
        <ProfileSearchFilter
          resetField={resetField}
          setValue={setValue}
          watch={watch}
          register={register}
        />
      </div>
      <div className="fixed bg-white rounded-full z-10 top-[4.166667%] right-[4.166667%] lg:top-[1.25%] lg:right-[1.25%]">
        <NavBar profilePic={profilePic} email={email} name={name} />
      </div>
      <div className="w-11/12 my-[10%] mx-auto">{profileCardLayouts}</div>
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
        <div className="w-[80%]">
          <div className="overflow-y-auto overflow-x-hidden w-full h-full">
            {profileCardLayouts}
          </div>
        </div>
      </div>
    </div>
  );

  return isTabletOrMobile ? mobileLayout() : desktopLayout();
}
