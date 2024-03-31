"use client";

import { useForm } from "react-hook-form";
import berkeleyData from "@/data/berkeleydata";
import {
  Avatar,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
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
  ButtonGroup,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import React, { useEffect } from "react";
import { ActionMeta, Select, SingleValue } from "chakra-react-select";
import fbIcon from "@/media/fbIcon.svg";
import igIcon from "@/media/igIcon.svg";
import Image from "next/image";

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
  fetchedSavedData?: boolean;
  passInCancel?: Function;
}

interface Option {
  value: string;
  label: string;
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

type onChangeSelectFunction =
  | ((_newValue: SingleValue<Option>, _actionMeta: ActionMeta<Option>) => void)
  | undefined;

const majorOptions: Option[] = berkeleyData.majors.map(
  (m) => ({ label: m.major, value: m.major } as Option)
);

const pronounsOptions: Option[] = berkeleyData.pronouns;

const inputStyling = {
  control: (baseStyles: any, _state: any) => ({
    ...baseStyles,
    borderRadius: "10px",
  }),
  placeholder: (baseStyles: any, _state: any) => ({
    ...baseStyles,
    color: "#9ca6b5",
    fontWeight: "510",
  }),
};

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
  passInCancel,
  fetchedSavedData,
}: ProfileEditFormProps) {
  const toast = useToast();
  const toastLoadingRef = React.useRef<ToastId>();

  useEffect(() => {
    if (fetchedSavedData != undefined) {
      toast({
        title: fetchedSavedData
          ? "Fetched profile data"
          : "Error fetching profile data",
        status: fetchedSavedData ? "success" : "error",
        duration: 2000,
        isClosable: false,
      });
    }
  }, [fetchedSavedData, toast]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    reset,
    trigger,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IUserBasicInfo>({
    mode: "all",
    shouldUnregister: true,
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

  const { onChange: onMajorChange, onBlur: onMajorBlur } = register("major", {
    required: "Major is required.",
  });

  const { onChange: onPronounsChange } = register("pronouns");

  register("gradYear", {
    required: "Grad year is required.",
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

  const stopLoading = () => {
    if (toastLoadingRef.current) {
      toast.close(toastLoadingRef.current);
    }
  };

  const resolveName = () => {
    const { firstName, lastName } = getValues();
    return firstName + " " + lastName === " " ? "" : firstName + " " + lastName;
  };

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
        title: "Error with Inputted Information",
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

    stopLoading();

    if (response.status === 200) {
      toast({
        title: "Information Saved",
        status: "success",
        duration: 2000,
        isClosable: false,
      });
    } else {
      const errorMsg = await response.json();

      toast({
        title: "Unexpected Server Error",
        description: errorMsg.error,
        status: "error",
        duration: 2000,
        isClosable: false,
      });
    }
  };

  const buttonLayout = () => {
    const submitButton = (
      <Button type="submit" onClick={checkForErrors} colorScheme="messenger">
        Save
      </Button>
    );

    const cancelButton = (
      <Button
        onClick={() => {
          reset();
          if (passInCancel) passInCancel();
        }}
        colorScheme="gray"
      >
        Cancel
      </Button>
    );

    return (
      <ButtonGroup gap={4}>
        {submitButton}
        {!isStart && cancelButton}
      </ButtonGroup>
    );
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <Stack spacing={[5, 5, 5, 5, 5, 5]}>
        <Heading size="lg">My Profile</Heading>
        <Stack spacing={[3, 3, 3, 3, 3, 3]}>
          <Stack
            direction={["row", "row", "row", "row", "row", "row"]}
            spacing={[5, 5, 5, 5, 5, 5]}
          >
            <Avatar
              className="rounded-full w-20 h-20 sm:w-32 sm:h-32 cursor-pointer"
              name={resolveName()}
              draggable="false"
              src={getValues().profileImageFile}
              onClick={onOpen}
            />
            <Stack className="w-full" spacing={4}>
              <FormControl isInvalid={!!errors?.major}>
                <FormLabel className="mb-0 text-sm">
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
                  chakraStyles={inputStyling}
                  size={["xs", "sm", "sm", "sm", "sm", "sm"]}
                  placeholder="Major"
                  onBlur={onMajorBlur}
                  onChange={onMajorChange as unknown as onChangeSelectFunction}
                  className="text-[#1c1c1c]"
                />
                {!!errors?.major ? (
                  <FormErrorMessage className="m-0 p-0"></FormErrorMessage>
                ) : null}
              </FormControl>
              <FormControl isInvalid={!!errors.gradYear}>
                <FormLabel
                  size={["sm", "sm", "sm", "sm", "sm", "sm"]}
                  className="mb-0"
                >
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
            <ModalContent maxW="1200px">
              <ModalCloseButton />
              <ModalBody>
                <Box
                  className="m-5 mt-10"
                  w="95%"
                  {...getRootProps()}
                  display="grid"
                  placeItems={"center"}
                  minW="20rem"
                  minH="15rem"
                  border="1px dashed black"
                  cursor="pointer"
                >
                  <input {...getInputProps()} />
                  <Text>
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
              <FormLabel
                size={["sm", "sm", "sm", "sm", "sm", "sm"]}
                className="mb-0"
              >
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
              <FormLabel
                size={["sm", "sm", "sm", "sm", "sm", "sm"]}
                className="mb-0"
              >
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
              <FormLabel
                size={["sm", "sm", "sm", "sm", "sm", "sm"]}
                className="mb-0"
              >
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
              <FormLabel
                size={["sm", "sm", "sm", "sm", "sm", "sm"]}
                className="mb-0"
              >
                Bio
              </FormLabel>
              <Textarea
                className="rounded-[10px] text-[#1c1c1c] font-[510]"
                {...register("userBio")}
                resize="none"
                size={["xs", "sm", "sm", "sm", "sm", "sm"]}
                placeholder={
                  "Enter a short biography, introducing yourself and highlighting your academic and nonacademic interests. Keep your bio under 50 words."
                }
              />
              {!!errors?.userBio ? (
                <FormErrorMessage className="m-0 p-0"></FormErrorMessage>
              ) : null}
            </FormControl>
          </div>
          <div>
            <FormControl>
              <FormLabel
                size={["sm", "sm", "sm", "sm", "sm", "sm"]}
                className="mb-0"
              >
                Pronouns
              </FormLabel>
              <Select
                useBasicStyles
                defaultInputValue={pronouns}
                isClearable={true}
                options={pronounsOptions}
                onChange={onPronounsChange as never as onChangeSelectFunction}
                size={["xs", "sm", "sm", "sm", "sm", "sm"]}
                placeholder={"Pronouns"}
              />
            </FormControl>
          </div>
          <Text className="text-sm" variant="underText">
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
        {buttonLayout()}
      </Stack>
    </form>
  );
}
