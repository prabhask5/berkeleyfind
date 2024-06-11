"use client";

import { ExploreUserType } from "@/types/UserModelTypes";
import { useState, useEffect } from "react";
import UserProfileSummary from "@/app/(app)/_components/UserProfileSummary";
import ProfileReadView from "@/app/(app)/_components/ProfileReadView";
import {
  CircularProgress,
  Tooltip,
  CircularProgressLabel,
  Stack,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { debounce, useBetterMediaQuery } from "@/lib/utils";
import { DeleteIcon } from "@chakra-ui/icons";
import { AiFillHeart } from "react-icons/ai";

interface UserProfileSummaryBoxProps extends Omit<ExploreUserType, "_id"> {
  sendFriendRequestCallback: () => void;
  handleTempDeleteCallback: () => void;
}

export default function UserProfileSummaryBox({
  profileImage,
  firstName,
  lastName,
  major,
  gradYear,
  userBio,
  pronouns,
  courseList,
  userStudyPreferences,
  profileMatch,
  sendFriendRequestCallback,
  handleTempDeleteCallback,
}: UserProfileSummaryBoxProps) {
  const [match, setMatch] = useState(0);

  useEffect(() => {
    setMatch(Math.round(profileMatch));
  }, [profileMatch]);

  const isTabletOrMobile = useBetterMediaQuery({
    query: "(max-width: 1024px)",
  });

  const mobileLayout = () => (
    <div className="border-2 border-[#D8D8D8] rounded-3xl bg-white p-[5%] w-full">
      <div className="flex flex-col">
        <Stack className="m-auto" spacing={2} direction="row">
          <CircularProgress value={match} size="50px" color="#A73CFC">
            <Tooltip
              openDelay={300}
              label={match + "% profile match"}
              aria-label="Match tooltip"
            >
              <CircularProgressLabel className="font-[510] text-sm">
                {match + "%"}
              </CircularProgressLabel>
            </Tooltip>
          </CircularProgress>
          <Stack className="my-auto" spacing={2} direction="row">
            <Tooltip
              openDelay={300}
              label="Send friend request"
              aria-label="Friend request tooltip"
            >
              <IconButton
                onClick={debounce(sendFriendRequestCallback, 100)}
                variant="ghost"
                icon={<Icon color="#B01E28" as={AiFillHeart} w={10} h={10} />}
                aria-label={"Add friend"}
              />
            </Tooltip>
            <Tooltip
              openDelay={300}
              label="Temporarily hide profile"
              aria-label="Hide profile tooltip"
            >
              <IconButton
                onClick={debounce(handleTempDeleteCallback, 100)}
                variant="ghost"
                icon={<DeleteIcon w={8} h={8} />}
                aria-label={"Hide profile"}
              />
            </Tooltip>
          </Stack>
        </Stack>
        <div className="m-auto w-full">
          <UserProfileSummary
            profileReadViewComponent={
              <ProfileReadView
                profileImage={profileImage}
                firstName={firstName}
                lastName={lastName}
                major={major}
                gradYear={gradYear}
                userBio={userBio}
                pronouns={pronouns}
              />
            }
            courseList={courseList}
            userStudyPreferences={userStudyPreferences}
          />
        </div>
      </div>
    </div>
  );

  const desktopLayout = () => (
    <div className="border-2 border-[#D8D8D8] rounded-3xl m-5 bg-white">
      <UserProfileSummary
        profileReadViewComponent={
          <div>
            <CircularProgress
              className="mb-5"
              value={match}
              size="75px"
              color="#A73CFC"
            >
              <Tooltip
                openDelay={300}
                label={match + "% profile match"}
                aria-label="Match tooltip"
              >
                <CircularProgressLabel className="font-[510]">
                  {match + "%"}
                </CircularProgressLabel>
              </Tooltip>
            </CircularProgress>
            <ProfileReadView
              profileImage={profileImage}
              firstName={firstName}
              lastName={lastName}
              major={major}
              gradYear={gradYear}
              userBio={userBio}
              pronouns={pronouns}
            />
            <Stack className="mt-5" spacing={2} direction="row">
              <Tooltip
                openDelay={300}
                label="Send friend request"
                aria-label="Friend request tooltip"
              >
                <IconButton
                  onClick={debounce(sendFriendRequestCallback, 100)}
                  variant="ghost"
                  w={14}
                  h={14}
                  icon={<Icon color="#B01E28" as={AiFillHeart} w={14} h={14} />}
                  aria-label={"Add friend"}
                />
              </Tooltip>
              <Tooltip
                openDelay={300}
                label="Temporarily hide profile"
                aria-label="Hide profile tooltip"
              >
                <IconButton
                  onClick={debounce(handleTempDeleteCallback, 100)}
                  variant="ghost"
                  w={14}
                  h={14}
                  icon={<DeleteIcon w={12} h={12} />}
                  aria-label={"Hide profile"}
                />
              </Tooltip>
            </Stack>
          </div>
        }
        courseList={courseList}
        userStudyPreferences={userStudyPreferences}
      />
    </div>
  );

  return isTabletOrMobile ? mobileLayout() : desktopLayout();
}
