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
  IconButton,
  useDisclosure,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
} from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";
import { AsyncSelect } from "chakra-react-select";
import { DropdownOption, FilterTag } from "@/types/MiscTypes";
import { asyncInputStyling } from "@/theme/input";
import { promiseOptions } from "@/lib/utils";
import berkeleyData from "@/data/berkeleydata";
import { useBetterMediaQuery } from "@/lib/utils";
import { useEffect, useRef } from "react";
import {
  UseFormResetField,
  UseFormSetValue,
  UseFormWatch,
  UseFormRegister,
} from "react-hook-form";

interface ISessionTagInfo {
  tagList: FilterTag[];
}
interface ProfileSearchFilterProps {
  resetField: UseFormResetField<ISessionTagInfo>;
  setValue: UseFormSetValue<ISessionTagInfo>;
  watch: UseFormWatch<ISessionTagInfo>;
  register: UseFormRegister<ISessionTagInfo>;
}

export default function ProfileSearchFilter({
  resetField,
  setValue,
  watch,
  register,
}: ProfileSearchFilterProps) {
  const toast = useToast();
  const isTabletOrMobile = useBetterMediaQuery({
    query: "(max-width: 1280px)",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const buttomOfTagList = useRef<null | HTMLDivElement>(null);

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

  const scrollToBottom = () => {
    buttomOfTagList.current?.scrollIntoView({ behavior: "smooth" });
  };

  const tagListState: FilterTag[] = watch("tagList");
  useEffect(() => {
    scrollToBottom();
  }, [tagListState]);

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

  const filterButton = (
    <IconButton
      className="rounded-full"
      variant="ghost"
      onClick={onOpen}
      icon={<Icon className="w-6 h-6" as={FiFilter} />}
      aria-label="Menu button"
    />
  );

  const drawer = () => {
    return (
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          {fullFilterSideBar()}
        </DrawerContent>
      </Drawer>
    );
  };

  const fullFilterSideBar = () => (
    <Stack spacing={4} className="h-full p-5 pb-0 border-r-2 border-[#D8D8D8]">
      <div className="flex flex-row gap-3">
        <Icon className="w-6 h-6" as={FiFilter} />
        <Heading size="md">Filters</Heading>
        <Link
          onClick={() => resetField("tagList")}
          className="font-bold mt-[1px]"
        >
          Reset
        </Link>
      </div>
      <Text fontSize={["sm", "sm", "sm", "sm", "sm", "md"]} variant="underText">
        Type in a class abbreviation to filter students by classes to find
        students who share your learning interests.
      </Text>
      <AsyncSelect
        // @ts-ignore
        size={["xs", "xs", "xs", "sm", "sm", "sm"]}
        blurInputOnSelect
        useBasicStyles
        chakraStyles={asyncInputStyling}
        cacheOptions
        loadOptions={promiseOptions}
        onChange={(e) => handleAddTag(parseInt((e as DropdownOption).value))}
        defaultOptions
        placeholder={"Search for a class..."}
      />
      <div className="overflow-y-auto overflow-x-hidden">
        <Stack spacing={2} className="px-3 pb-3">
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
        <div ref={buttomOfTagList}></div>
      </div>
    </Stack>
  );

  return isTabletOrMobile ? (
    <>
      {filterButton}
      {drawer()}
    </>
  ) : (
    fullFilterSideBar()
  );
}
