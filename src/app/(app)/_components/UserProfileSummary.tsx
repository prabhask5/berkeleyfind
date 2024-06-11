"use client";

import { useBetterMediaQuery } from "@/lib/utils";
import {
  Tabs,
  TabList,
  Tab,
  TabIndicator,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { StudyPreferences } from "@/types/UserPreferenceModelTypes";
import { Course } from "@/types/CourseModelTypes";
import StudyTimes from "./StudyTimes";
import Courses from "./Courses";

interface UserProfileSummaryProps {
  profileReadViewComponent: React.ReactNode;
  courseList: Course[];
  userStudyPreferences: StudyPreferences;
}

export default function UserProfileSummary({
  profileReadViewComponent,
  courseList,
  userStudyPreferences,
}: UserProfileSummaryProps) {
  const isTabletOrMobile = useBetterMediaQuery({
    query: "(max-width: 1024px)",
  });

  const studyTimesComponent = (
    <StudyTimes weekTimesSource={userStudyPreferences.weekTimes} />
  );

  const coursesComponent = <Courses courseListSource={courseList} />;

  const mobileLayout = () => (
    <Tabs className="h-[650px] w-full" align="center" variant="unstyled">
      <TabList>
        <Tab className="text-[#414141] font-medium sm:font-[520] md:font-[550] lg:font-[590] text-[11px] sm:text-[15px] md:text-[16px] lg:text-[18px]">
          Profile
        </Tab>
        <Tab className="text-[#414141] font-medium sm:font-[520] md:font-[550] lg:font-[590] text-[11px] sm:text-[15px] md:text-[16px] lg:text-[18px]">
          Course List
        </Tab>
        <Tab className="text-[#414141] font-medium sm:font-[520] md:font-[550] lg:font-[590] text-[11px] sm:text-[15px] md:text-[16px] lg:text-[18px]">
          Study Preferences
        </Tab>
      </TabList>
      <TabIndicator mt="-1.5px" height="3px" bg="#A73CFC" borderRadius="1px" />
      <TabPanels className="text-left">
        <TabPanel className="p-0 pt-4">{profileReadViewComponent}</TabPanel>
        <TabPanel className="p-0 pt-4">{coursesComponent}</TabPanel>
        <TabPanel className="p-0 pt-4">{studyTimesComponent}</TabPanel>
      </TabPanels>
    </Tabs>
  );

  const desktopLayout = () => (
    <div className="flex flex-row m-[5%] gap-4 h-full">
      <div className="w-2/5 my-auto">{profileReadViewComponent}</div>
      <Tabs align="center" className="w-3/5 h-[650px]" variant="unstyled">
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
          <TabPanel className="p-0 pt-4">{coursesComponent}</TabPanel>
          <TabPanel className="p-0 pt-4">{studyTimesComponent}</TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );

  return isTabletOrMobile ? mobileLayout() : desktopLayout();
}
