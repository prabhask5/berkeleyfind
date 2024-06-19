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
  CloseButton,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import React, { useEffect, useState } from "react";
import { Select } from "chakra-react-select";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { asyncInputStyling } from "@/theme/input";
import { DropdownOption } from "@/types/MiscTypes";
import { handleError, resolveProfileImageLink, stopLoading } from "@/lib/utils";
import { turnStringIntoDropdownOption } from "@/lib/utils";
import { saveUserBasicInfo } from "@/actions/UserInfoModifyActions";
import ButtonLayout from "@/app/_components/ButtonLayout";
import { ActionResponse } from "@/types/RequestDataTypes";
import { FaFacebook, FaInstagram } from "react-icons/fa";

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
  isStart?: boolean;
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
  isStart = false,
}: ProfileEditFormProps) {
  const router = useRouter();
  const toast = useToast();
  const toastLoadingRef = React.useRef<ToastId>();
  const [anyChanges, setAnyChanges] = useState<boolean>(false);
  const [defaultValues, setDefaultValues] = useState<IUserBasicInfo>({
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
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    trigger,
    handleSubmit,
    setValue,
    watch,
    reset,
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

  const currFormState = watch();

  useEffect(() => {
    setAnyChanges(
      !(
        watch("email") == defaultValues.email &&
        watch("fbURL") == defaultValues.fbURL &&
        watch("firstName") == defaultValues.firstName &&
        watch("gradYear") == defaultValues.gradYear &&
        watch("igURL") == defaultValues.igURL &&
        watch("lastName") == defaultValues.lastName &&
        watch("major") == defaultValues.major &&
        watch("profileImageFile") == defaultValues.profileImageFile &&
        watch("pronouns") == defaultValues.pronouns &&
        watch("userBio") == defaultValues.userBio
      ),
    );
  }, [
    currFormState,
    defaultValues.email,
    defaultValues.fbURL,
    defaultValues.firstName,
    defaultValues.gradYear,
    defaultValues.igURL,
    defaultValues.lastName,
    defaultValues.major,
    defaultValues.profileImageFile,
    defaultValues.pronouns,
    defaultValues.userBio,
    watch,
  ]);

  const onDrop = (acceptedFiles: any) => {
    onClose();
    const reader = new FileReader();
    reader.onload = () => setValue("profileImageFile", reader.result as string);
    const fileObject = acceptedFiles[0];
    reader.readAsDataURL(fileObject);
  };

  const { getRootProps, getInputProps } = useDropzone({
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

    const response: ActionResponse = JSON.parse(
      await saveUserBasicInfo(JSON.stringify(data)),
    );

    stopLoading(toast, toastLoadingRef);

    if (response.status === 200) {
      toast({
        title: "Information saved",
        status: "success",
        duration: 2000,
        isClosable: false,
      });

      const newProfileImageLink = response.responseData.profileImage;

      if (isStart) router.push("/start/courses");
      else {
        const dataWithNewProfileImage: IUserBasicInfo = {
          ...data,
          profileImageFile: newProfileImageLink,
        };
        reset(dataWithNewProfileImage);
        setDefaultValues(dataWithNewProfileImage);
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
        <Heading size="lg">My Profile</Heading>
        <Stack spacing={[2, 3, 3, 3, 3, 5]}>
          <Stack
            direction={["row", "row", "row", "row", "row", "row"]}
            spacing={[3, 5, 5, 5, 5, 7]}
          >
            <div className="relative flex-row flex">
              <Tooltip
                label="Click to add profile picture"
                aria-label="add profile image"
                openDelay={350}
              >
                <div
                  className="rounded-full w-20 h-20 sm:w-32 sm:h-32 cursor-pointer"
                  onClick={onOpen}
                >
                  <Image
                    fill
                    className="w-20 max-h-20 sm:w-32 sm:max-h-32 rounded-full my-auto"
                    draggable="false"
                    src={resolveProfileImageLink(watch("profileImageFile"))}
                    alt="Profile picture"
                  />
                </div>
              </Tooltip>
              <div className="absolute top-[-10px] right-[-15px]">
                {watch("profileImageFile") && (
                  <CloseButton
                    onClick={() => setValue("profileImageFile", "")}
                  />
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
                  value={turnStringIntoDropdownOption(watch("major"))}
                  isClearable
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
            <ModalContent className="w-9/12 p-2">
              <ModalBody>
                <Box
                  {...getRootProps()}
                  className="flex w-full h-full p-4 items-center justify-center"
                  border="1px dashed black"
                  cursor="pointer"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-10 h-10 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="text-[#A73CFC] font-semibold">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input {...getInputProps()} />
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
                value={turnStringIntoDropdownOption(watch("pronouns"))}
                isClearable
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
            <Icon as={FaFacebook} boxSize={6} />
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
            <Icon as={FaInstagram} boxSize={6} />
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
        <ButtonLayout
          isStart={isStart}
          startButtonText={"Save & Continue"}
          anyChanges={anyChanges}
          checkForErrorsFunc={checkForErrors}
          handleUndoFunc={handleUndo}
        />
      </Stack>
    </form>
  );
}
