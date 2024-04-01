"use client";

import {
  Heading,
  Text,
  Input,
  Stack,
  Button,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  useToast,
  ToastId,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { stopLoading } from "@/lib/utils";

interface IUserSignup {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const [show, setShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);

  const router = useRouter();
  const toast = useToast();
  const toastLoadingRef = React.useRef<ToastId>();

  useEffect(() => {
    router.prefetch("/temp");
  }, [router]);

  const {
    register,
    trigger,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IUserSignup>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  register("password", {
    required: "Password is required.",
    pattern: {
      value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[^ ]+[A-Za-z\d@$!%*?&]*$/,
      message:
        "Password must contain at least one letter, one number, and one special character and should not contain spaces.",
    },
    minLength: {
      value: 10,
      message: "Password must be 10 or more characters long.",
    },
  });

  register("email", {
    required: "Email address is required.",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address format.",
    },
  });

  register("confirmPassword", {
    validate: (val: string) => {
      if (watch("password") != val) {
        return "Password and confirm password does not match.";
      }
    },
  });

  const checkForErrors = async () => {
    const emailValid = await trigger("email");
    const passwordValid = await trigger("password");
    const confirmPasswordValid = await trigger("confirmPassword");

    let numErrors = 0;
    let errorMsg;

    if (!emailValid) {
      numErrors++;
      errorMsg = errors.email?.message;
    }

    if (!passwordValid) {
      numErrors++;
      errorMsg = errors.password?.message;
    } else if (!confirmPasswordValid) {
      numErrors++;
      errorMsg = errors.confirmPassword?.message;
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

  const handleSubmitForm = async (data: IUserSignup) => {
    toastLoadingRef.current = toast({
      title: "Processing...",
      status: "loading",
      duration: null,
    });

    const response = await signIn("signup", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    stopLoading(toast, toastLoadingRef);

    if (response?.ok) {
      toast({
        title: "Sign up successful",
        status: "success",
        duration: 2000,
        isClosable: false,
      });

      router.push("/temp");
    } else if (response?.error) {
      const errorJson: { error: string; code: number } = JSON.parse(
        response?.error,
      );

      if (errorJson.error === "User already exists") {
        toast({
          title: "User with this email already exists",
          description: "Please use another email address.",
          status: "error",
          duration: 2000,
          isClosable: false,
        });
      } else if (errorJson.code === 500) {
        toast({
          title: "Unexpected server error",
          description: "Please try again.",
          status: "error",
          duration: 2000,
          isClosable: false,
        });
      }
    }
  };

  return (
    <Stack spacing={[10, 10, 20, 20, 20, 20]}>
      <Heading variant="logo" size={["md", "lg", "lg", "lg", "lg", "lg"]}>
        BerkeleyFind
      </Heading>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Stack spacing={[3, 3, 5, 5, 5, 5]}>
          <Heading size={["xl", "2xl", "2xl", "2xl", "2xl", "2xl"]}>
            Create your account.
          </Heading>
          <Text
            fontSize={["10px", "xs", "sm", "sm", "sm", "sm"]}
            variant="underText"
          >
            Enter your details to get started
          </Text>
          <FormControl isInvalid={!!errors.email}>
            <Input
              className="w-11/12 sm:w-3/4 mx-auto"
              {...register("email")}
              id="email"
              placeholder="youremail@example.com"
              size={["sm", "sm", "md", "md", "md", "md"]}
            />
            {!!errors.email !== null ? (
              <FormErrorMessage className="m-0 p-0"></FormErrorMessage>
            ) : null}
          </FormControl>
          <FormControl
            isInvalid={!!errors.password || !!errors.confirmPassword}
          >
            <InputGroup className="w-11/12 sm:w-3/4 mx-auto">
              <Input
                id="password"
                type={show ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                size={["sm", "sm", "md", "md", "md", "md"]}
              />
              <InputRightElement
                width={[
                  "3.8rem",
                  "3.8rem",
                  "4.5rem",
                  "4.5rem",
                  "4.5rem",
                  "4.5rem",
                ]}
                h="full"
              >
                <Button
                  className="rounded-full"
                  h={[
                    "1.25rem",
                    "1.25rem",
                    "1.75rem",
                    "1.75rem",
                    "1.75rem",
                    "1.75rem",
                  ]}
                  size={["xs", "xs", "sm", "sm", "sm", "sm"]}
                  onClick={() => setShow(!show)}
                >
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            {!!errors.password || !!errors.confirmPassword ? (
              <FormErrorMessage className="m-0 p-0"></FormErrorMessage>
            ) : null}
          </FormControl>
          <FormControl isInvalid={!!errors.confirmPassword}>
            <InputGroup className="w-11/12 sm:w-3/4 mx-auto">
              <Input
                id="confirmPassword"
                type={confirmShow ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                size={["sm", "sm", "md", "md", "md", "md"]}
              />
              <InputRightElement
                width={[
                  "3.8rem",
                  "3.8rem",
                  "4.5rem",
                  "4.5rem",
                  "4.5rem",
                  "4.5rem",
                ]}
                h="full"
              >
                <Button
                  className="rounded-full"
                  h={[
                    "1.25rem",
                    "1.25rem",
                    "1.75rem",
                    "1.75rem",
                    "1.75rem",
                    "1.75rem",
                  ]}
                  size={["xs", "xs", "sm", "sm", "sm", "sm"]}
                  onClick={() => setConfirmShow(!confirmShow)}
                >
                  {confirmShow ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            {!!errors.confirmPassword ? (
              <FormErrorMessage className="m-0 p-0"></FormErrorMessage>
            ) : null}
          </FormControl>
          <Button
            type="submit"
            className="w-11/12 sm:w-3/4 mx-auto"
            variant="websiteTheme"
            onClick={checkForErrors}
            size={["sm", "sm", "md", "md", "md", "md"]}
          >
            Sign Up
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
