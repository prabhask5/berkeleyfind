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
import { redirect } from "next/navigation";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

interface IUserSignup {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const [show, setShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);

  const toast = useToast();
  const toastLoadingRef = React.useRef<ToastId>();

  const {
    register,
    trigger,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IUserSignup>({
    mode: "all",
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

  const stopLoading = () => {
    if (toastLoadingRef.current) {
      toast.close(toastLoadingRef.current);
    }
  };

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
        title: "Error with Inputted Information",
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

    stopLoading();

    if (response?.ok) {
      toast({
        title: "Sign Up Successful",
        status: "success",
        duration: 2000,
        isClosable: false,
      });

      redirect("/temp");
    } else if (response?.error) {
      const errorJson: { error: string; code: number } = JSON.parse(
        response?.error,
      );

      if (errorJson.error === "User already exists") {
        toast({
          title: "User with This Email Already Exists",
          description: "Please use another email address.",
          status: "error",
          duration: 2000,
          isClosable: false,
        });
      } else if (errorJson.code === 500) {
        toast({
          title: "Unexpected Server Error",
          description: "Please try again.",
          status: "error",
          duration: 2000,
          isClosable: false,
        });
      }
    }
  };

  return (
    <div>
      <Heading variant="logo" size="lg" style={{ marginBottom: "50px" }}>
        BerkeleyFind
      </Heading>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Stack spacing={5}>
          <Heading size="2xl">Create your account.</Heading>
          <Text variant="underText">Enter your details to get started</Text>
          <FormControl
            style={{ width: "75%", marginLeft: "auto", marginRight: "auto" }}
            isInvalid={!!errors.email}
          >
            <Input
              {...register("email")}
              id="email"
              placeholder="youremail@example.com"
            />
            {!!errors.email !== null ? (
              <FormErrorMessage
                style={{ margin: "0px", padding: "0px" }}
              ></FormErrorMessage>
            ) : null}
          </FormControl>
          <FormControl
            style={{ width: "75%", marginLeft: "auto", marginRight: "auto" }}
            isInvalid={!!errors.password || !!errors.confirmPassword}
          >
            <InputGroup>
              <Input
                id="password"
                type={show ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
              />
              <InputRightElement width="4.5rem">
                <Button
                  style={{ borderRadius: "9999px" }}
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShow(!show)}
                >
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            {!!errors.password || !!errors.confirmPassword ? (
              <FormErrorMessage
                style={{ margin: "0px", padding: "0px" }}
              ></FormErrorMessage>
            ) : null}
          </FormControl>
          <FormControl
            style={{ width: "75%", marginLeft: "auto", marginRight: "auto" }}
            isInvalid={!!errors.confirmPassword}
          >
            <InputGroup>
              <Input
                id="confirmPassword"
                type={show ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword")}
              />
              <InputRightElement width="4.5rem">
                <Button
                  style={{ borderRadius: "9999px" }}
                  h="1.75rem"
                  size="sm"
                  onClick={() => setConfirmShow(!confirmShow)}
                >
                  {confirmShow ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            {!!errors.confirmPassword ? (
              <FormErrorMessage
                style={{ margin: "0px", padding: "0px" }}
              ></FormErrorMessage>
            ) : null}
          </FormControl>
          <Button
            type="submit"
            style={{ width: "75%", marginLeft: "auto", marginRight: "auto" }}
            variant="websiteTheme"
            onClick={checkForErrors}
          >
            Sign Up
          </Button>
        </Stack>
      </form>
    </div>
  );
}
