"use client";

import { handleError, stopLoading } from "@/lib/utils";
import { Stack, Text, ToastId, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { saveUserStudyPreferences } from "@/actions/UserInfoModifyActions";
import ButtonLayout from "@/app/_components/ButtonLayout";
import { ActionResponse } from "@/types/RequestDataTypes";
import StudyTimes from "@/app/(app)/_components/StudyTimes";

interface IUserStudyTimesInfo {
  weekTimes: Date[];
}

interface StudyTimesEditFormProps extends IUserStudyTimesInfo {
  isStart?: boolean;
}

export default function StudyTimesEditForm({
  weekTimes,
  isStart = false,
}: StudyTimesEditFormProps) {
  const router = useRouter();
  const toast = useToast();
  const toastLoadingRef = React.useRef<ToastId>();
  const [anyChanges, setAnyChanges] = useState<boolean>(false);
  const [defaultValues, setDefaultValues] = useState<IUserStudyTimesInfo>({
    weekTimes: weekTimes,
  });

  const { handleSubmit, setValue, watch, reset } = useForm<IUserStudyTimesInfo>(
    {
      defaultValues: {
        weekTimes: weekTimes,
      },
    },
  );

  const currFormState = watch();

  useEffect(() => {
    setAnyChanges(
      watch("weekTimes").length !== defaultValues.weekTimes.length ||
        watch("weekTimes").filter((v) => !defaultValues.weekTimes.includes(v))
          .length > 0,
    );
  }, [watch, defaultValues.weekTimes, currFormState]);

  const handleUndo = () => {
    reset();
    toast({
      title: "Successfully restored study preferences",
      status: "success",
      duration: 2000,
      isClosable: false,
    });
  };

  const handleSubmitForm = async (data: IUserStudyTimesInfo) => {
    toastLoadingRef.current = toast({
      title: "Processing...",
      status: "loading",
      duration: null,
    });

    const response: ActionResponse = JSON.parse(
      await saveUserStudyPreferences(
        JSON.stringify({
          userStudyPreferences: {
            weekTimes: data.weekTimes,
          },
        }),
      ),
    );

    stopLoading(toast, toastLoadingRef);

    if (response.status === 200) {
      toast({
        title: "Information saved",
        status: "success",
        duration: 2000,
        isClosable: false,
      });
      if (isStart) router.push("/explore");
      else {
        reset(data);
        setDefaultValues(data);
      }
    } else handleError(toast, response);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <Stack spacing={[5, 5, 5, 5, 5, 7]} className="px-2">
        <Stack spacing={[2, 3, 3, 5, 5, 5]} className="w-full">
          <Text
            className="text-center text-xs sm:text-sm lg:text-base"
            variant="underText"
          >
            Please fill in your study time preferences accurately for a more
            accurate filtering process.
          </Text>
          <StudyTimes
            weekTimesSource={watch("weekTimes")}
            onChange={(newSelection: Date[]) =>
              setValue("weekTimes", newSelection)
            }
          />
        </Stack>
        <ButtonLayout
          isStart={isStart}
          startButtonText={"Save & Finish"}
          anyChanges={anyChanges}
          handleUndoFunc={handleUndo}
        />
      </Stack>
    </form>
  );
}
