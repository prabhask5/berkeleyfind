"use client";

import { stopLoading } from "@/lib/utils";
import {
  Button,
  ButtonGroup,
  Stack,
  Text,
  ToastId,
  useToast,
} from "@chakra-ui/react";
import ScheduleSelector from "react-schedule-selector";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { saveUserStudyPreferences } from "@/app/actions/UserInfoModifyActions";

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
        watch("weekTimes").filter((v, i) => v != defaultValues.weekTimes[i])
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

  const buttonLayout = () => {
    return isStart ? (
      <Button className="md:w-40 lg:mb-5 bg-[#A73CFC] text-white" type="submit">
        {"Save & Finish"}
      </Button>
    ) : (
      <ButtonGroup gap={2}>
        <Button
          type="submit"
          isDisabled={!anyChanges}
          className="bg-[#A73CFC] text-white"
        >
          Save
        </Button>
        <Button
          onClick={handleUndo}
          isDisabled={!anyChanges}
          colorScheme="gray"
        >
          Undo
        </Button>
      </ButtonGroup>
    );
  };

  const handleSubmitForm = async (data: IUserStudyTimesInfo) => {
    toastLoadingRef.current = toast({
      title: "Processing...",
      status: "loading",
      duration: null,
    });

    const response = await saveUserStudyPreferences({
      userStudyPreferences: {
        weekTimes: data.weekTimes,
      },
    });

    stopLoading(toast, toastLoadingRef);

    if (response.ok) {
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
          <ScheduleSelector
            numDays={7}
            minTime={6}
            maxTime={24}
            startDate={new Date("2023-03-27")}
            dateFormat="dddd"
            hourlyChunks={1}
            selection={watch("weekTimes")}
            onChange={(newSelection: Date[]) =>
              setValue("weekTimes", newSelection)
            }
            renderDateCell={(time, selected, refSetter) => {
              const dateCellStyleAddOn = selected
                ? " bg-[#A73CFC]"
                : " bg-[#E5C4FE]";

              return (
                <div
                  className={
                    "w-full h-[25px] cursor-pointer hover:bg-[#C680FD]" +
                    dateCellStyleAddOn
                  }
                  // @ts-ignore
                  ref={refSetter}
                />
              );
            }}
            renderTimeLabel={(time: Date) => {
              let processedTime = "";
              if (time.getHours() < 12) {
                processedTime = time.getHours() + " am";
              } else if (time.getHours() == 12) {
                processedTime = time.getHours() + " pm";
              } else if (time.getHours() > 12) {
                processedTime = (time.getHours() % 12) + " pm";
              }
              return (
                <Text
                  className="text-[8px] sm:text-sm xl:text-base"
                  variant="underText"
                >
                  {processedTime}
                </Text>
              );
            }}
            renderDateLabel={(date: Date) => {
              const days: string[] = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];
              return (
                <Text
                  className="text-center text-[9px] sm:text-sm lg:text-[11px] xl:text-base"
                  variant="underText"
                >
                  {days[date.getDay()]}
                </Text>
              );
            }}
          />
        </Stack>
        {buttonLayout()}
      </Stack>
    </form>
  );
}
