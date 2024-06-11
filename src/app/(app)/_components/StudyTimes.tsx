"use client";

import { debounce } from "@/lib/utils";
import { Text } from "@chakra-ui/react";
import ScheduleSelector from "react-schedule-selector";

interface StudyTimesProps {
  onChange?: (_newSelection: Date[]) => void;
  weekTimesSource: Date[];
}

export default function StudyTimes({
  onChange,
  weekTimesSource,
}: StudyTimesProps) {
  return (
    <ScheduleSelector
      numDays={7}
      minTime={6}
      maxTime={24}
      startDate={new Date("2023-03-27")}
      dateFormat="dddd"
      hourlyChunks={1}
      selection={weekTimesSource}
      onChange={onChange && debounce(onChange, 100)}
      renderDateCell={(time, selected, refSetter) => {
        const dateCellStyleAddOn = selected ? " bg-[#A73CFC]" : " bg-[#E5C4FE]";
        const editableStyleAddOn = onChange
          ? " hover:bg-[#C680FD] cursor-pointer"
          : "";

        return (
          <div
            className={
              "w-full h-[25px]" + editableStyleAddOn + dateCellStyleAddOn
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
  );
}
