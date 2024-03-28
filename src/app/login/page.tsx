"use client";

import { Link, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import SignUp from "./_components/SignUp";
import Login from "./_components/Login";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [viewState, setViewState] = useState<"login" | "signup">("login");
  const router = useRouter();

  getSession().then((session) => {
    if (session && session.user.userStatus) {
      router.push(`/${session.user.userStatus}`);
    }
  });

  const swapViews = () => {
    if (viewState === "login") setViewState("signup");
    else setViewState("login");
  };

  return (
    <div>
      <div
        style={{
          marginTop: viewState === "login" ? "12%" : "11%",
          marginLeft: "auto",
          marginRight: "auto",
          width: "60%",
          textAlign: "center",
        }}
      >
        <Stack spacing={5}>
          {viewState == "login" ? <Login /> : <SignUp />}
          {viewState == "login" ? (
            <Text variant="underText">
              Don&apos;t have an account?{" "}
              <Link onClick={swapViews}>Sign up</Link>
            </Text>
          ) : (
            <Text variant="underText">
              Already have an account? <Link onClick={swapViews}>Log in</Link>
            </Text>
          )}
        </Stack>
      </div>
    </div>
  );
}
