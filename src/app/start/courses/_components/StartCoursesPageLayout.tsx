"use client";

import CourseEditForm from "@/app/(app)/()/profile/_components/CourseEditForm";
import { Stack, Heading } from "@chakra-ui/react";

export default function StartCoursesPageLayout() {
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
          Next, add your current and past courses to find students who share
          your learning interests.
        </Heading>
        <div className="w-full lg:m-auto lg:overflow-y-auto lg:overflow-x-hidden lg:p-2">
          <CourseEditForm courseList={[]} isStart />
        </div>
      </Stack>
    </div>
  );
}
