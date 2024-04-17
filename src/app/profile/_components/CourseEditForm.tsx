"use client";

import berkeleyData from "@/data/berkeleydata";
import { stopLoading } from "@/lib/utils";
import { asyncInputStyling } from "@/theme/input";
import { Course } from "@/types/CourseModelTypes";
import { DropdownOption } from "@/types/MiscTypes";
import {
  Stack,
  Divider,
  Text,
  useToast,
  ToastId,
  Button,
  Heading,
} from "@chakra-ui/react";
import { AsyncSelect } from "chakra-react-select";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CourseListItem from "./CourseListItem";

interface CourseEditFormProps {
  courseList: Course[];
  isStart: boolean;
}

interface IUserCourseInfo {
  courseList: Course[];
}

export default function CourseEditForm({
  courseList,
  isStart,
}: CourseEditFormProps) {
  const router = useRouter();
  const toast = useToast();
  const toastLoadingRef = React.useRef<ToastId>();
  const [allClosed, setAllClosed] = useState(false);

  const { handleSubmit, setValue, watch } = useForm<IUserCourseInfo>({
    mode: "all",
    defaultValues: {
      courseList: courseList,
    },
  });

  const filterCourseList = (inputValue: string) => {
    const maxOptions = 50;
    let counter = 1;
    return berkeleyData.selectionCourseOptions.filter((ele) => {
      if (counter >= maxOptions) {
        return false;
      } else {
        const included: boolean = ele.label
          .toLowerCase()
          .includes(inputValue.toLowerCase());
        if (included) {
          counter++;
        }
        return included;
      }
    });
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<DropdownOption[]>((resolve) => {
      setTimeout(() => {
        resolve(filterCourseList(inputValue));
      }, 1000);
    });

  const handleAddCourse = (courseIndex: number) => {
    const addedCourse: Course = {
      courseAbrName: berkeleyData.courseList[courseIndex].abr,
      courseLongName: berkeleyData.courseList[courseIndex].name,
    };

    let included: boolean = watch("courseList").some(
      (c: Course) =>
        c.courseAbrName === addedCourse.courseAbrName &&
        c.courseLongName === addedCourse.courseLongName,
    );

    if (!included) {
      setValue("courseList", [...watch("courseList"), addedCourse]);
      toast({
        title: "Course successfully added",
        status: "success",
        duration: 2000,
        isClosable: false,
      });
    } else {
      toast({
        title: "Cannot add duplicate classes",
        status: "error",
        duration: 2000,
        isClosable: false,
      });
    }
  };

  const handleDeleteCourse = (courseDataIndex: number) => {
    setValue(
      "courseList",
      watch("courseList").filter(
        (c: Course, index) => index !== courseDataIndex,
      ),
    );
    toast({
      title: "Course successfully removed",
      status: "success",
      duration: 2000,
      isClosable: false,
    });
  };

  const handleSubmitForm = async (data: IUserCourseInfo) => {
    toastLoadingRef.current = toast({
      title: "Processing...",
      status: "loading",
      duration: null,
    });

    const response = await fetch(`${process.env.API_URL}/mycourses`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    stopLoading(toast, toastLoadingRef);

    if (response.ok) {
      toast({
        title: "Information saved",
        status: "success",
        duration: 2000,
        isClosable: false,
      });
      if (isStart) router.push("/start/studytimes");
    } else {
      const errorMsg = await response.json();

      toast({
        title: "Unexpected server error",
        description: errorMsg.error,
        status: "error",
        duration: 2000,
        isClosable: false,
      });
    }
  };

  const buttonLayout = () => {
    return (
      <Button className="md:w-40 lg:mb-5" type="submit" colorScheme="messenger">
        {"Save & Continue"}
      </Button>
    );
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <Stack spacing={[8, 8, 8, 8, 8, 8]}>
        <Stack spacing={[2, 3, 3, 5, 5, 5]} className="w-full">
          <AsyncSelect
            // @ts-ignore
            size={["xs", "xs", "sm", "md", "md", "md"]}
            blurInputOnSelect
            useBasicStyles
            chakraStyles={asyncInputStyling}
            cacheOptions
            loadOptions={promiseOptions}
            onChange={(e) => handleAddCourse(parseInt(e!.value))}
            defaultOptions
            placeholder={"Type to search for a class..."}
          />
          <Text
            className="text-center text-xs sm:text-sm lg:text-base"
            variant="underText"
          >
            Please fill in course information accurately for a more accurate
            matching process.
          </Text>
          <Heading
            size={["sm", "md", "md", "md", "md", "md"]}
            className="text-center sm:pb-5 text-[#A73CFC]"
          >
            My Classes
          </Heading>
          <div
            onScroll={() => setAllClosed(!allClosed)}
            className="flex flex-col h-[575px] w-full overflow-y-auto overflow-x-hidden"
          >
            <Divider className="bg-[#D8D8D8]" variant="solid" />
            {watch("courseList").length > 0 ? (
              watch("courseList").map((c: Course, index) => (
                <div key={index}>
                  <CourseListItem
                    course={c}
                    allClosed={allClosed}
                    handleDeleteCourse={() => handleDeleteCourse(index)}
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
          <Divider className="bg-[#D8D8D8]" variant="solid" />
        </Stack>
        {isStart && buttonLayout()}
      </Stack>
    </form>
  );
}
