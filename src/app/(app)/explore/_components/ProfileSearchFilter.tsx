"use client";

import {
  Heading,
  Icon,
  Link,
  Stack,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
  useToast,
} from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";
import { AsyncSelect } from "chakra-react-select";
import { FilterTag } from "@/types/MiscTypes";
import { asyncInputStyling } from "@/theme/input";
import { promiseOptions } from "@/lib/utils";
import { useForm } from "react-hook-form";
import berkeleyData from "@/data/berkeleydata";

interface ISessionTagInfo {
  tagList: FilterTag[];
}

export default function ProfileSearchFilter() {
  const toast = useToast();

  const { resetField, setValue, watch, register } = useForm<ISessionTagInfo>({
    mode: "all",
    defaultValues: {
      tagList: [],
    },
  });

  register("tagList");

  const filterTagColors = [
    "gray",
    "red",
    "orange",
    "yellow",
    "green",
    "teal",
    "blue",
    "cyan",
    "purple",
    "pink",
    "linkedin",
    "facebook",
    "messenger",
    "whatsapp",
    "twitter",
    "telegram",
  ];

  const handleAddTag = (courseIndex: number) => {
    const addedTag: FilterTag = {
      courseAbrName: berkeleyData.courseList[courseIndex].abr,
      color: filterTagColors[courseIndex % filterTagColors.length],
    };

    let included: boolean = watch("tagList").some(
      (c: FilterTag) => c.courseAbrName === addedTag.courseAbrName,
    );

    if (!included) {
      setValue("tagList", [...watch("tagList"), addedTag]);
    } else {
      toast({
        title: "Cannot add duplicate filters",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleDeleteTag = (courseAbrName: string) => {
    setValue(
      "tagList",
      watch("tagList").filter((t) => t.courseAbrName !== courseAbrName),
    );
  };

  return (
    <Stack spacing={4} className="h-full p-5 pb-0 border-r-2 border-[#D8D8D8]">
      <div className="flex flex-row gap-3">
        <Icon boxSize="1.5em" as={FiFilter} />
        <Heading size="md">Filters</Heading>
        <Link
          onClick={() => resetField("tagList")}
          className="font-bold mt-[1px]"
        >
          Reset
        </Link>
      </div>
      <Text variant="underText">
        Type in a class abbreviation to filter students by classes to find
        students who share your learning interests.
      </Text>
      <AsyncSelect
        // @ts-ignore
        size={["xs", "xs", "sm", "md", "md", "md"]}
        blurInputOnSelect
        useBasicStyles
        chakraStyles={asyncInputStyling}
        cacheOptions
        loadOptions={promiseOptions}
        onChange={(e) => handleAddTag(parseInt(e!.value))}
        defaultOptions
        placeholder={"Type to search for a class..."}
      />
      <Stack spacing={2} className="overflow-y-auto overflow-x-hidden px-3">
        {watch("tagList").map((d, index) => {
          return (
            <Tag
              key={index.toString()}
              borderRadius="full"
              variant="solid"
              colorScheme={d.color}
            >
              <TagLabel>{d.courseAbrName}</TagLabel>
              <TagCloseButton
                className="ml-auto"
                onClick={() => handleDeleteTag(d.courseAbrName)}
              />
            </Tag>
          );
        })}
      </Stack>
    </Stack>
  );
}
