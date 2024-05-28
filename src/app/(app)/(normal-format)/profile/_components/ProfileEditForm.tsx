/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useForm } from "react-hook-form";
import berkeleyData from "@/data/berkeleydata";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Textarea,
  ToastId,
  useDisclosure,
  useToast,
  Text,
  Heading,
  Button,
  CloseButton,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import React from "react";
import { Select } from "chakra-react-select";
import fbIcon from "@/media/fbIcon.svg";
import igIcon from "@/media/igIcon.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { asyncInputStyling } from "@/theme/input";
import { DropdownOption } from "@/types/MiscTypes";
import { stopLoading } from "@/lib/utils";
import placeholder from "@/media/avatar_placeholder.svg";

export interface ProfileEditFormProps {
  profileImage: string;
  firstName: string;
  lastName: string;
  email: string;
  major: string;
  gradYear: string;
  userBio: string;
  pronouns: string;
  fbURL: string;
  igURL: string;
  isStart: boolean;
}

interface IUserBasicInfo {
  profileImageFile: string;
  firstName: string;
  lastName: string;
  email: string;
  major: string;
  gradYear: string;
  userBio: string;
  pronouns: string;
  fbURL: string;
  igURL: string;
}

const majorOptions: DropdownOption[] = berkeleyData.majors.map(
  (m) => ({ label: m.major, value: m.major }) as DropdownOption,
);

const pronounsOptions: DropdownOption[] = berkeleyData.pronouns;

export function ProfileEditForm({
  profileImage,
  firstName,
  lastName,
  email,
  major,
  gradYear,
  userBio,
  pronouns,
  fbURL,
  igURL,
  isStart,
}: ProfileEditFormProps) {
  const router = useRouter();
  const toast = useToast();
  const toastLoadingRef = React.useRef<ToastId>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    trigger,
    handleSubmit,
    setValue,
    watch,
    resetField,
    formState: { errors },
  } = useForm<IUserBasicInfo>({
    mode: "onBlur",
    defaultValues: {
      profileImageFile: profileImage,
      firstName: firstName,
      lastName: lastName,
      email: email,
      major: major,
      gradYear: gradYear,
      userBio: userBio,
      pronouns: pronouns,
      fbURL: fbURL,
      igURL: igURL,
    },
  });

  register("firstName", {
    required: "First name is required.",
  });

  register("lastName", {
    required: "Last name is required.",
  });

  register("email", {
    required: "Email address is required.",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address format.",
    },
  });

  register("major", {
    required: "Major is required.",
  });

  register("gradYear", {
    required: "Grad year is required.",
    validate: (val: string) => {
      if (
        Number.isNaN(Number(val)) ||
        Number(val) < 2000 ||
        Number(val) > 2100
      ) {
        return "Please enter a valid graduation year.";
      }
    },
  });

  register("userBio", {
    validate: (val: string) => {
      if (val.split(" ").length > 50) {
        return "Please keep your bio under 50 words.";
      }
    },
  });

  register("fbURL", {
    pattern: {
      value:
        /^(http\:\/\/|https\:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/i,
      message: "Invalid facebook url format.",
    },
  });

  register("igURL", {
    pattern: {
      value:
        /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/i,
      message: "Invalid instagram url format.",
    },
  });

  register("profileImageFile");

  const onDrop = (acceptedFiles: any) => {
    onClose();
    const reader = new FileReader();
    reader.onload = () => setValue("profileImageFile", reader.result as string);
    const fileObject = acceptedFiles[0];
    reader.readAsDataURL(fileObject);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: { "image/*": [] },
    onDrop,
  });

  const checkForErrors = async () => {
    const firstNameValid = await trigger("firstName");
    const lastNameValid = await trigger("lastName");
    const emailValid = await trigger("email");
    const majorValid = await trigger("major");
    const gradYearValid = await trigger("gradYear");
    const userBioValid = await trigger("userBio");
    const fbURLValid = await trigger("fbURL");
    const igURLValid = await trigger("igURL");

    let numErrors = 0;
    let errorMsg;

    if (!firstNameValid) {
      numErrors++;
      errorMsg = errors.firstName?.message;
    }

    if (!lastNameValid) {
      numErrors++;
      errorMsg = errors.lastName?.message;
    }

    if (!emailValid) {
      numErrors++;
      errorMsg = errors.email?.message;
    }

    if (!majorValid) {
      numErrors++;
      errorMsg = errors.major?.message;
    }

    if (!gradYearValid) {
      numErrors++;
      errorMsg = errors.gradYear?.message;
    }

    if (!userBioValid) {
      numErrors++;
      errorMsg = errors.userBio?.message;
    }

    if (!fbURLValid) {
      numErrors++;
      errorMsg = errors.fbURL?.message;
    }

    if (!igURLValid) {
      numErrors++;
      errorMsg = errors.igURL?.message;
    }

    if (numErrors > 1) errorMsg = "Please check your information.";

    if (errorMsg != null) {
      toast({
        title: "Error with inputted information",
        description: errorMsg,
        status: "error",
        duration: 2000,
        isClosable: false,
      });
    }
  };

  const handleSubmitForm = async (data: IUserBasicInfo) => {
    toastLoadingRef.current = toast({
      title: "Processing...",
      status: "loading",
      duration: null,
    });

    const response = await fetch(`${process.env.API_URL}/mybasicinfo`, {
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
      if (isStart) router.push("/start/courses");
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
      <Button
        className="md:w-40 lg:mb-5"
        type="submit"
        onClick={checkForErrors}
        colorScheme="messenger"
      >
        {"Save & Continue"}
      </Button>
    );
  };

  const resolveProfileImageLink = () => {
    if (watch("profileImageFile")) return watch("profileImageFile");
    return placeholder;
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <Stack spacing={[5, 5, 5, 5, 5, 7]}>
        <Heading size="lg">My Profile</Heading>
        <Stack spacing={[2, 3, 3, 3, 3, 5]}>
          <Stack
            direction={["row", "row", "row", "row", "row", "row"]}
            spacing={[3, 5, 5, 5, 5, 7]}
          >
            <div className="relative flex-row flex">
              <div
                className="rounded-full w-20 h-20 sm:w-32 sm:h-32 cursor-pointer"
                onClick={onOpen}
              >
                <Image
                  fill={true}
                  className="rounded-full"
                  draggable="false"
                  src={resolveProfileImageLink()}
                  alt="Profile picture"
                />
              </div>
              <div className="absolute top-[-10px] right-[-15px]">
                {watch("profileImageFile") && (
                  <CloseButton onClick={() => resetField("profileImageFile")} />
                )}
              </div>
            </div>
            <Stack className="w-full" spacing={[1, 2, 2, 4, 4, 4]}>
              <FormControl isInvalid={!!errors?.major}>
                <FormLabel className="mb-0 text-sm sm:text-base">
                  Major{" "}
                  <Text as="span" className="text-red-700">
                    *
                  </Text>
                </FormLabel>
                <Select
                  useBasicStyles
                  defaultInputValue={major}
                  isClearable={true}
                  options={majorOptions}
                  chakraStyles={asyncInputStyling}
                  // @ts-ignore
                  size={["xs", "sm", "sm", "sm", "sm", "sm"]}
                  placeholder="Major"
                  onBlur={(_e) => trigger("major")}
                  onChange={(e) =>
                    setValue(
                      "major",
                      e === null ? "" : (e as DropdownOption).value,
                    )
                  }
                  className="text-[#1c1c1c]"
                />
                {!!errors?.major ? (
                  <FormErrorMessage className="m-0 p-0"></FormErrorMessage>
                ) : null}
              </FormControl>
              <FormControl isInvalid={!!errors.gradYear}>
                <FormLabel className="mb-0 text-sm sm:text-base">
                  Graduation Year{" "}
                  <Text as="span" className="text-red-700">
                    *
                  </Text>
                </FormLabel>
                <Input
                  {...register("gradYear")}
                  size={["xs", "sm", "sm", "sm", "sm", "sm"]}
                  placeholder="Graduation Year"
                />
                {!!errors?.gradYear ? (
                  <FormErrorMessage className="m-0 p-0"></FormErrorMessage>
                ) : null}
              </FormControl>
            </Stack>
          </Stack>
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent className="w-9/12 aspect-square p-2">
              <ModalBody>
                <Box
                  {...getRootProps()}
                  className="flex w-full h-full p-4"
                  border="1px dashed black"
                  cursor="pointer"
                >
                  <input {...getInputProps()} />
                  <Text className="text-center m-auto">
                    {isDragActive
                      ? "Release here to upload your image."
                      : "Drop an image here, or click to select a file."}
                  </Text>
                </Box>
              </ModalBody>
            </ModalContent>
          </Modal>
          <div>
            <FormControl isInvalid={!!errors.firstName}>
              <FormLabel className="mb-0 text-sm sm:text-base">
                First Name{" "}
                <Text as="span" className="text-red-700">
                  *
                </Text>
              </FormLabel>
              <Input
                {...register("firstName")}
                size={["xs", "sm", "sm", "sm", "sm", "sm"]}
                placeholder={"First Name"}
              />
              {!!errors?.firstName ? (
                <FormErrorMessage className="m-0 p-0"></FormErrorMessage>
              ) : null}
            </FormControl>
          </div>
          <div>
            <FormControl isInvalid={!!errors.lastName}>
              <FormLabel className="mb-0 text-sm sm:text-base">
                Last Name{" "}
                <Text as="span" className="text-red-700">
                  *
                </Text>
              </FormLabel>
              <Input
                {...register("lastName")}
                size={["xs", "sm", "sm", "sm", "sm", "sm"]}
                placeholder={"Last Name"}
              />
              {!!errors?.lastName ? (
                <FormErrorMessage className="m-0 p-0"></FormErrorMessage>
              ) : null}
            </FormControl>
          </div>
          <div>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel className="mb-0 text-sm sm:text-base">
                Email{" "}
                <Text as="span" className="text-red-700">
                  *
                </Text>
              </FormLabel>
              <Input
                {...register("email")}
                size={["xs", "sm", "sm", "sm", "sm", "sm"]}
                placeholder={"Email"}
              />
              {!!errors?.email ? (
                <FormErrorMessage className="m-0 p-0"></FormErrorMessage>
              ) : null}
            </FormControl>
          </div>
          <div>
            <FormControl isInvalid={!!errors.userBio}>
              <FormLabel className="mb-0 text-sm sm:text-base">Bio</FormLabel>
              <Textarea
                className="rounded-[10px] text-[#1c1c1c] font-[510]"
                {...register("userBio")}
                resize="none"
                size={["xs", "sm", "sm", "sm", "sm", "sm"]}
                placeholder={
                  "Introduce yourself! Keep your bio under 50 words."
                }
              />
              {!!errors?.userBio ? (
                <FormErrorMessage className="m-0 p-0"></FormErrorMessage>
              ) : null}
            </FormControl>
          </div>
          <div>
            <FormControl>
              <FormLabel className="mb-0 text-sm sm:text-base">
                Pronouns
              </FormLabel>
              <Select
                useBasicStyles
                chakraStyles={asyncInputStyling}
                defaultInputValue={pronouns}
                isClearable={true}
                options={pronounsOptions}
                onChange={(e) =>
                  setValue(
                    "pronouns",
                    e === null ? "" : (e as DropdownOption).value,
                  )
                }
                // @ts-ignore
                size={["xs", "sm", "sm", "sm", "sm", "sm"]}
                placeholder={"Pronouns"}
              />
            </FormControl>
          </div>
          <Text
            className="text-[10px] sm:text-sm md:text-base lg:text-[13px] xl:text-base"
            variant="underText"
          >
            Copy paste your social media profiles to link your account.
          </Text>
          <Stack
            direction={["row", "row", "row", "row", "row", "row"]}
            spacing={[2, 2, 2, 2, 2, 2]}
          >
            <Image priority src={fbIcon} alt="Facebook icon" />
            <FormControl isInvalid={!!errors.fbURL}>
              <Input
                {...register("fbURL")}
                size={["xs", "sm", "sm", "sm", "sm", "sm"]}
                placeholder={"Enter your facebook profile link"}
              />
              {!!errors?.fbURL ? (
                <FormErrorMessage className="m-0 p-0"></FormErrorMessage>
              ) : null}
            </FormControl>
          </Stack>
          <Stack
            direction={["row", "row", "row", "row", "row", "row"]}
            spacing={[2, 2, 2, 2, 2, 2]}
          >
            <Image priority src={igIcon} alt="Instagram icon" />
            <FormControl isInvalid={!!errors.igURL}>
              <Input
                {...register("igURL")}
                size={["xs", "sm", "sm", "sm", "sm", "sm"]}
                placeholder={"Enter your instagram profile link"}
              />
              {!!errors?.igURL ? (
                <FormErrorMessage className="m-0 p-0"></FormErrorMessage>
              ) : null}
            </FormControl>
          </Stack>
        </Stack>
        {isStart && buttonLayout()}
      </Stack>
    </form>
  );
}
