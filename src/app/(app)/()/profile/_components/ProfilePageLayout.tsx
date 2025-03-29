"use client";

import { UserType } from "@/types/UserModelTypes";
import {
  Stack,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  ToastId,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useEffect } from "react";
import { ProfileEditForm } from "./ProfileEditForm";
import CourseEditForm from "./CourseEditForm";
import StudyTimesEditForm from "./StudyTimesEditForm";

interface ProfilePageLayoutProps {
  user: UserType | null;
  error: string | null;
  success: boolean;
}

export default function ProfilePageLayout({
  user,
  error,
  success,
}: ProfilePageLayoutProps) {
  const toast = useToast();
  const toastRef = React.useRef<ToastId>(undefined);

  useEffect(() => {
    if (toastRef.current) return;
    if (success) {
      toastRef.current = toast({
        title: "User info successfully loaded",
        status: "success",
        duration: 2000,
        isClosable: false,
      });
    } else {
      toastRef.current = toast({
        title: error,
        status: "error",
        duration: 2000,
        isClosable: false,
      });
    }
  }, [error, success, toast]);

  return (
    <div className="flex w-screen">
      <Stack
        direction={["column", "column", "column", "row", "row", "row"]}
        spacing={[10, 10, 10, 10, 10, 10]}
        className="w-11/12 lg:w-[97.5%] mx-auto my-[10%] lg:my-auto h-full lg:py-[1.25%] lg:gap-4"
      >
        <div className="w-full">
          <ProfileEditForm
            profileImage={user?.profileImage ?? ""}
            firstName={user?.firstName ?? ""}
            lastName={user?.lastName ?? ""}
            email={user?.email ?? ""}
            major={user?.major ?? ""}
            gradYear={user?.gradYear ?? ""}
            userBio={user?.userBio ?? ""}
            pronouns={user?.pronouns ?? ""}
            fbURL={user?.fbURL ?? ""}
            igURL={user?.igURL ?? ""}
          />
        </div>
        <Tabs className="w-full" align="center" variant="unstyled">
          <TabList>
            <Tab className="text-[#414141] font-medium sm:font-[520] md:font-[550] lg:font-[590] text-sm sm:text-[15px] md:text-[16px] lg:text-[18px]">
              Course List
            </Tab>
            <Tab className="text-[#414141] font-medium sm:font-[520] md:font-[550] lg:font-[590] text-sm sm:text-[15px] md:text-[16px] lg:text-[18px]">
              Study Preferences
            </Tab>
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="3px"
            bg="#A73CFC"
            borderRadius="1px"
          />
          <TabPanels className="text-left">
            <TabPanel className="p-0 pt-4">
              <CourseEditForm courseList={user?.courseList ?? []} />
            </TabPanel>
            <TabPanel className="p-0 pt-4">
              <StudyTimesEditForm
                weekTimes={user?.userStudyPreferences.weekTimes ?? []}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </div>
  );
}
