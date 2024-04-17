"use client";

import { stopLoading } from "@/lib/utils";
import { Button, Stack, Text, ToastId, useToast } from "@chakra-ui/react";
import ScheduleSelector from "react-schedule-selector";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

interface IUserStudyTimesInfo {
  weekTimes: Date[];
}

interface StudyTimesEditFormProps extends IUserStudyTimesInfo {
  isStart: boolean;
}

export default function StudyTimesEditForm({
  weekTimes,
  isStart,
}: StudyTimesEditFormProps) {
  const router = useRouter();
  const toast = useToast();
  const toastLoadingRef = React.useRef<ToastId>();

  const { handleSubmit, setValue, watch } = useForm<IUserStudyTimesInfo>({
    defaultValues: {
      weekTimes: weekTimes,
    },
  });

  const buttonLayout = () => {
    return (
      <Button className="md:w-40 lg:mb-5" type="submit" colorScheme="messenger">
        {"Save & Finish"}
      </Button>
    );
  };

  const handleSubmitForm = async (data: IUserStudyTimesInfo) => {
    toastLoadingRef.current = toast({
      title: "Processing...",
      status: "loading",
      duration: null,
    });

    const request_obj = { userStudyPreferences: data };
    const response = await fetch(`${process.env.API_URL}/mystudypref`, {
      method: "POST",
      body: JSON.stringify(request_obj),
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
      <Stack spacing={[8, 8, 8, 8, 8, 8]}>
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
            selectedColor="#A73CFC"
            unselectedColor="#e5c4fe"
            hoveredColor="#c680fd"
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
                  className="text-xs sm:text-sm lg:text-sm xl:text-base"
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
                  className="text-center text-xs sm:text-sm lg:text-sm xl:text-base"
                  variant="underText"
                >
                  {days[date.getDay()]}
                </Text>
              );
            }}
          />
        </Stack>
        {isStart && buttonLayout()}
      </Stack>
    </form>
  );
}
