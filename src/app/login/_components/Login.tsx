"use client";

import { stopLoading } from "@/lib/utils";
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
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface IUserLogin {
  email: string;
  password: string;
}

export default function Login() {
  const [show, setShow] = useState(false);

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
    formState: { errors },
  } = useForm<IUserLogin>({
    mode: "onBlur",
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
        title: "Error with inputted information",
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

    stopLoading(toast, toastLoadingRef);

    if (response?.ok) {
      toast({
        title: "Login successful",
        status: "success",
        duration: 2000,
        isClosable: false,
      });

      router.push("/temp");
    } else if (response?.error) {
      const errorJson: { error: string; code: number } = JSON.parse(
        response?.error,
      );

      if (errorJson.error === "User not found") {
        toast({
          title: "User not found",
          description:
            "A user with this email could not be found. Please try again.",
          status: "error",
          duration: 2000,
          isClosable: false,
        });
      } else if (errorJson.error === "Incorrect password") {
        toast({
          title: "Incorrect password",
          description:
            "This email password combination is incorrect. Please try again.",
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
      <Heading variant="logo" size={["sm", "lg", "lg", "lg", "lg", "lg"]}>
        BerkeleyFind
      </Heading>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Stack spacing={[3, 3, 5, 5, 5, 5]}>
          <Heading size="2xl">Log in.</Heading>
          <Text
            fontSize={["10px", "xs", "sm", "sm", "sm", "sm"]}
            variant="underText"
          >
            Enter your details to get signed in
          </Text>
          <FormControl isInvalid={!!errors?.email}>
            <Input
              className="w-11/12 sm:w-3/4 mx-auto"
              {...register("email")}
              id="email"
              placeholder="Email"
              size={["sm", "sm", "md", "md", "md", "md"]}
            />
            {!!errors?.email ? (
              <FormErrorMessage className="m-0 p-0"></FormErrorMessage>
            ) : null}
          </FormControl>
          <FormControl isInvalid={!!errors?.password}>
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
            {!!errors?.password ? (
              <FormErrorMessage className="m-0 p-0"></FormErrorMessage>
            ) : null}
          </FormControl>
          <Button
            className="w-11/12 sm:w-3/4 mx-auto"
            type="submit"
            variant="websiteTheme"
            onClick={checkForErrors}
            size={["sm", "sm", "md", "md", "md", "md"]}
          >
            Log In
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
