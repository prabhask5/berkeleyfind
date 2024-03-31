"use client";

import { ToastId, useToast, Stack, Text, Link } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Login from "./Login";
import SignUp from "./SignUp";

interface LoginSignUpViewProps {
  fromRedirect: string;
}

export default function LoginSignUpView({
  fromRedirect,
}: LoginSignUpViewProps) {
  const [viewState, setViewState] = useState<"login" | "signup">("login");
  const toastRef = React.useRef<ToastId>();

  const toast = useToast();

  useEffect(() => {
    if (fromRedirect === "true" && !toastRef.current) {
      toastRef.current = toast({
        title: "Please log in first",
        status: "error",
        duration: 2000,
        isClosable: false,
      });
    }
  }, [fromRedirect, toast]);

  const swapViews = () => {
    if (viewState === "login") setViewState("signup");
    else setViewState("login");
  };

  return (
    <div className="flex w-screen h-screen">
      <Stack
        className="w-full sm:w-11/12 xl:w-7/12 text-center m-auto"
        spacing={[5, 5, 5, 5, 5, 5]}
      >
        {viewState == "login" ? <Login /> : <SignUp />}
        {viewState == "login" ? (
          <Text
            fontSize={["10px", "xs", "sm", "sm", "sm", "sm"]}
            variant="underText"
          >
            Don&apos;t have an account? <Link onClick={swapViews}>Sign up</Link>
          </Text>
        ) : (
          <Text
            fontSize={["10px", "xs", "sm", "sm", "sm", "sm"]}
            variant="underText"
          >
            Already have an account? <Link onClick={swapViews}>Log in</Link>
          </Text>
        )}
      </Stack>
    </div>
  );
}
