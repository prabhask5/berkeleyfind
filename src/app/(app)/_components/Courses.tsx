"use client";

import { Course } from "@/types/CourseModelTypes";
import { Heading } from "@chakra-ui/react";
import { useState } from "react";
import CourseListItem from "./CourseListItem";

interface CoursesProps {
  courseListSource: Course[];
  handleDeleteCourse?: (_index: number) => void;
}

export default function Courses({
  courseListSource,
  handleDeleteCourse,
}: CoursesProps) {
  const [allClosed, setAllClosed] = useState(false);

  return (
    <div
      onScroll={() => setAllClosed(!allClosed)}
      className="flex flex-col h-[600px] w-full overflow-y-auto overflow-x-hidden border-2 border-[#D8D8D8] rounded-lg"
    >
      {courseListSource.length > 0 ? (
        courseListSource.map((c: Course, index) => (
          <div key={index}>
            <CourseListItem
              course={c}
              allClosed={allClosed}
              handleDeleteCourse={
                handleDeleteCourse && (() => handleDeleteCourse(index))
              }
            />
          </div>
        ))
      ) : (
        <Heading
          size={["md", "lg", "lg", "lg", "lg", "lg"]}
          className="m-auto text-[#f2f2f2]"
        >
          Courses will appear here.
        </Heading>
      )}
    </div>
  );
}
