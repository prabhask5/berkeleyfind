"use client";

import { debounce, resolveProfileImageLink } from "@/lib/utils";
import { FriendUserType } from "@/types/UserModelTypes";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Divider,
  Heading,
  IconButton,
  Stack,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import DetailedViewModal from "@/app/(app)/_components/DetailedViewModal";
import IconLinks from "@/app/(app)/_components/IconLinks";
import { CloseIcon } from "@chakra-ui/icons";
import ProfileReadView from "@/app/(app)/_components/ProfileReadView";
import UserProfileSummary from "@/app/(app)/_components/UserProfileSummary";

interface FriendListItemProps extends Omit<FriendUserType, "_id"> {
  index: number;
  deleteCallBack: () => void;
}

export default function FriendListItem({
  profileImage,
  firstName,
  lastName,
  major,
  gradYear,
  userBio,
  pronouns,
  courseList,
  userStudyPreferences,
  fbURL,
  igURL,
  email,
  index,
  deleteCallBack,
}: FriendListItemProps) {
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
        <div className="ml-auto my-auto flex flex-row sm:gap-1">
          <IconLinks fbURL={fbURL} igURL={igURL} email={email} />
          <Tooltip
            isDisabled={isModalOpen || isAlertOpen}
            label="Delete friend"
            aria-label="delete friend"
            openDelay={300}
          >
            <IconButton
              onClick={debounce(onAlertOpen, 100)}
              variant="ghost"
              icon={<CloseIcon boxSize={4} />}
              aria-label={"Delete friend"}
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
                  Delete Friend
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
                    Delete Friend
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </div>
      </div>
      <DetailedViewModal
        isModalOpen={isModalOpen}
        onModalClose={debounce(onModalClose, 100)}
      >
        <UserProfileSummary
          profileReadViewComponent={
            <Stack spacing={7}>
              <ProfileReadView
                profileImage={profileImage}
                firstName={firstName}
                lastName={lastName}
                major={major}
                gradYear={gradYear}
                userBio={userBio}
                pronouns={pronouns}
              />
              <Divider className="bg-[#D8D8D8]" variant="solid" />
              <IconLinks fbURL={fbURL} igURL={igURL} email={email} />
            </Stack>
          }
          courseList={courseList}
          userStudyPreferences={userStudyPreferences}
        />
      </DetailedViewModal>
    </>
  );
}
