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
import { useBetterMediaQuery } from "@/lib/utils";
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
    <div className="border-2 border-[#D8D8D8] rounded-3xl">
      <div className="w-11/12 flex flex-col mx-auto">
        <Stack className="mt-5 m-auto" spacing={2} direction="row">
          <CircularProgress value={match} size="75px" color="#A73CFC">
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
          <Tooltip
            openDelay={300}
            label="Send friend request"
            aria-label="Friend request tooltip"
          >
            <IconButton
              style={{ marginBottom: "20px", marginTop: "1px" }}
              onClick={sendFriendRequestCallback}
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
              style={{ marginBottom: "20px" }}
              onClick={handleTempDeleteCallback}
              variant="ghost"
              w={14}
              h={14}
              icon={<DeleteIcon w={12} h={12} />}
              aria-label={"Hide profile"}
            />
          </Tooltip>
        </Stack>
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
  );

  const desktopLayout = () => (
    <div className="border-2 border-[#D8D8D8] rounded-3xl m-5">
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
                  style={{ marginBottom: "20px", marginTop: "1px" }}
                  onClick={sendFriendRequestCallback}
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
                  style={{ marginBottom: "20px" }}
                  onClick={handleTempDeleteCallback}
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
