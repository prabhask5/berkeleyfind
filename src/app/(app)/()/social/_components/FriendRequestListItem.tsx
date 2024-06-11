"use client";

import { debounce, resolveProfileImageLink } from "@/lib/utils";
import { StrangerUserType } from "@/types/UserModelTypes";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Heading,
  IconButton,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import UserProfileSummary from "@/app/(app)/_components/UserProfileSummary";
import DetailedViewModal from "@/app/(app)/_components/DetailedViewModal";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import ProfileReadView from "@/app/(app)/_components/ProfileReadView";

interface FriendRequestListItemProps extends Omit<StrangerUserType, "_id"> {
  index: number;
  acceptCallBack?: () => void;
  deleteCallBack: () => void;
}

export default function FriendRequestListItem({
  profileImage,
  firstName,
  lastName,
  major,
  gradYear,
  userBio,
  pronouns,
  courseList,
  userStudyPreferences,
  index,
  acceptCallBack,
  deleteCallBack,
}: FriendRequestListItemProps) {
  const colorChoices = ["#E3E3E3", "#FFFFFF"];
  const cancelRef = React.useRef(null);

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  return (
    <>
      <div
        className={`bg-[${colorChoices[index % 2]}] p-2 flex flex-row border border-[#E3E3E3] cursor-pointer rounded`}
      >
        <Tooltip
          isDisabled={isModalOpen || isAlertOpen}
          label="Click to open detailed view"
          aria-label="detailed view"
          openDelay={300}
        >
          <div
            onClick={debounce(onModalOpen, 100)}
            className="flex flex-row w-full gap-4"
          >
            <div className="relative w-12 h-12 my-auto">
              <Image
                fill
                className="rounded-full"
                draggable="false"
                src={resolveProfileImageLink(profileImage)}
                alt="Profile picture"
              />
            </div>
            <Heading noOfLines={1} className="text-xl font-semibold my-auto">
              {firstName + " " + lastName}
            </Heading>
          </div>
        </Tooltip>
        <div className="ml-auto flex flex-row sm:gap-1">
          {acceptCallBack && (
            <Tooltip
              isDisabled={isModalOpen || isAlertOpen}
              label="Accept request"
              aria-label="accept request"
              openDelay={300}
            >
              <IconButton
                className="my-auto"
                onClick={debounce(acceptCallBack, 100)}
                variant="ghost"
                icon={<CheckIcon boxSize={5} />}
                aria-label={"Accept request"}
              />
            </Tooltip>
          )}
          <Tooltip
            isDisabled={isModalOpen || isAlertOpen}
            label="Delete request"
            aria-label="delete request"
            openDelay={300}
          >
            <IconButton
              onClick={debounce(onAlertOpen, 100)}
              className="my-auto"
              variant="ghost"
              icon={<CloseIcon boxSize={4} />}
              aria-label={"Delete request"}
            />
          </Tooltip>
          <AlertDialog
            isOpen={isAlertOpen}
            leastDestructiveRef={cancelRef}
            onClose={debounce(onAlertClose, 100)}
            isCentered
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Request
                </AlertDialogHeader>
                <AlertDialogBody>
                  {" "}
                  Are you sure? You cannot undo this action afterwards.{" "}
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={debounce(onAlertClose, 100)}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={debounce(() => {
                      deleteCallBack();
                      onAlertClose();
                    }, 100)}
                    ml={3}
                  >
                    Delete Request
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </div>
      </div>
      <DetailedViewModal isModalOpen={isModalOpen} onModalClose={onModalClose}>
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
      </DetailedViewModal>
    </>
  );
}
