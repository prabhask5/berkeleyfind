"use client";

import StudyTimesEditForm from "@/app/(app)/()/profile/_components/StudyTimesEditForm";
import { Stack, Heading } from "@chakra-ui/react";

export default function StartStudyTimesPageLayout() {
  return (
    <div className="flex w-screen lg:h-screen">
      <Stack
        direction={["column", "column", "column", "row", "row", "row"]}
        spacing={[10, 10, 10, 10, 10, 10]}
        className="w-11/12 lg:w-[97.5%] mx-auto my-[10%] lg:my-auto h-full lg:pt-5"
      >
        <Heading
          className="text-center m-auto"
          size={["lg", "xl", "xl", "xl", "xl", "2xl"]}
        >
          Finally, add your preferred study times to find students who study
          like you.
        </Heading>
        <div className="w-full lg:m-auto lg:overflow-y-auto lg:overflow-x-hidden lg:p-2">
          <StudyTimesEditForm weekTimes={[]} isStart />
        </div>
      </Stack>
    </div>
  );
}
