"use client";

import berkeleyData from "@/data/berkeleydata";
import { handleError, promiseOptions, stopLoading } from "@/lib/utils";
import { asyncInputStyling } from "@/theme/input";
import { Course } from "@/types/CourseModelTypes";
import { Stack, Text, useToast, ToastId, Heading } from "@chakra-ui/react";
import { AsyncSelect } from "chakra-react-select";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { DropdownOption } from "@/types/MiscTypes";
import { saveUserCourseInfo } from "@/actions/UserInfoModifyActions";
import ButtonLayout from "@/app/_components/ButtonLayout";
import { ActionResponse } from "@/types/RequestDataTypes";
import Courses from "@/app/(app)/_components/Courses";

interface CourseEditFormProps {
  courseList: Course[];
  isStart?: boolean;
}

interface IUserCourseInfo {
  courseList: Course[];
}

export default function CourseEditForm({
  courseList,
  isStart = false,
}: CourseEditFormProps) {
  const router = useRouter();
  const toast = useToast();
  const toastLoadingRef = React.useRef<ToastId>(undefined);
  const [anyChanges, setAnyChanges] = useState<boolean>(false);
  const [defaultValues, setDefaultValues] = useState<IUserCourseInfo>({
    courseList: courseList,
  });

  const { handleSubmit, setValue, watch, reset } = useForm<IUserCourseInfo>({
    mode: "all",
    defaultValues: {
      courseList: courseList,
    },
  });

  const handleAddCourse = (courseIndex: number) => {
    const addedCourse: Course = {
      courseAbrName: berkeleyData.courseList[courseIndex].courseAbrName,
      courseLongName: berkeleyData.courseList[courseIndex].courseLongName,
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

  const currFormState = watch();

  useEffect(() => {
    setAnyChanges(
      watch("courseList").length !== defaultValues.courseList.length ||
        watch("courseList").filter(
          (v, i) =>
            v.courseAbrName != defaultValues.courseList[i].courseAbrName ||
            v.courseLongName != defaultValues.courseList[i].courseLongName,
        ).length > 0,
    );
  }, [courseList, currFormState, defaultValues.courseList, watch]);

  const handleSubmitForm = async (data: IUserCourseInfo) => {
    toastLoadingRef.current = toast({
      title: "Processing...",
      status: "loading",
      duration: null,
    });

    const response: ActionResponse = JSON.parse(
      await saveUserCourseInfo(JSON.stringify(data)),
    );

    stopLoading(toast, toastLoadingRef);

    if (response.status === 200) {
      toast({
        title: "Information saved",
        status: "success",
        duration: 2000,
        isClosable: false,
      });
      if (isStart) router.push("/start/studytimes");
      else {
        reset(data);
        setDefaultValues(data);
      }
    } else handleError(toast, response);
  };

  const handleUndo = () => {
    reset();
    toast({
      title: "Successfully restored profile information",
      status: "success",
      duration: 2000,
      isClosable: false,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <Stack spacing={[5, 5, 5, 5, 5, 7]} className="px-2">
        <Stack spacing={[2, 3, 3, 5, 5, 5]} className="w-full">
          <AsyncSelect
            // @ts-ignore
            size={["xs", "xs", "sm", "md", "md", "md"]}
            blurInputOnSelect
            useBasicStyles
            chakraStyles={asyncInputStyling}
            cacheOptions
            loadOptions={promiseOptions}
            onChange={(e) =>
              handleAddCourse(parseInt((e as DropdownOption).value))
            }
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
            className="text-center text-[#A73CFC]"
          >
            My Classes
          </Heading>
          <Courses
            courseListSource={watch("courseList")}
            handleDeleteCourse={handleDeleteCourse}
          />
        </Stack>
        <ButtonLayout
          isStart={isStart}
          startButtonText={"Save & Continue"}
          anyChanges={anyChanges}
          handleUndoFunc={handleUndo}
        />
      </Stack>
    </form>
  );
}
