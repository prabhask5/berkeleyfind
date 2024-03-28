"use client";

import {
  Heading,
  Text,
  Input,
  Stack,
  Button,
  InputGroup,
  InputRightElement,
  FormControl,
  FormErrorMessage,
  useToast,
  ToastId,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface IUserLogin {
  email: string;
  password: string;
}

export default function Login() {
  const [show, setShow] = useState(false);

  const toast = useToast();
  const toastLoadingRef = React.useRef<ToastId>();

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserLogin>({
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  register("password", {
    required: "Password is required.",
  });

  register("email", {
    required: "Email address is required.",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address format.",
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

    let errorMsg;

    if (!emailValid && !passwordValid)
      errorMsg = "Please check your information.";
    else if (!emailValid) errorMsg = errors.email?.message;
    else if (!passwordValid) errorMsg = errors.password?.message;

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

  const handleSubmitForm = async (data: IUserLogin) => {
    toastLoadingRef.current = toast({
      title: "Processing...",
      status: "loading",
      duration: null,
    });

    const response = await signIn("login", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    stopLoading();

    if (response?.ok) {
      toast({
        title: "Login Successful",
        status: "success",
        duration: 2000,
        isClosable: false,
      });

      redirect("/temp");
    } else if (response?.error) {
      const errorJson: { error: string; code: number } = JSON.parse(
        response?.error,
      );

      if (errorJson.error === "User not found") {
        toast({
          title: "User Not Found",
          description:
            "A user with this email could not be found. Please try again.",
          status: "error",
          duration: 2000,
          isClosable: false,
        });
      } else if (errorJson.error === "Incorrect password") {
        toast({
          title: "Incorrect Password",
          description:
            "This email password combination is incorrect. Please try again.",
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
    <>
      <Heading variant="logo" size="lg" style={{ marginBottom: "50px" }}>
        BerkeleyFind
      </Heading>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Stack spacing={5}>
          <Heading size="2xl">Log in.</Heading>
          <Text variant="underText">Enter your details to get signed in</Text>
          <FormControl
            style={{ width: "75%", marginLeft: "auto", marginRight: "auto" }}
            isInvalid={!!errors?.email}
          >
            <Input {...register("email")} id="email" placeholder="Email" />
            {!!errors?.email ? (
              <FormErrorMessage
                style={{ margin: "0px", padding: "0px" }}
              ></FormErrorMessage>
            ) : null}
          </FormControl>
          <FormControl isInvalid={!!errors?.password}>
            <InputGroup
              style={{ width: "75%", marginLeft: "auto", marginRight: "auto" }}
            >
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
            {!!errors?.password ? (
              <FormErrorMessage
                style={{ margin: "0px", padding: "0px" }}
              ></FormErrorMessage>
            ) : null}
          </FormControl>
          <Button
            style={{ width: "75%", marginLeft: "auto", marginRight: "auto" }}
            type="submit"
            variant="websiteTheme"
            onClick={checkForErrors}
          >
            Log In
          </Button>
        </Stack>
      </form>
    </>
  );
}
