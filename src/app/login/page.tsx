import { redirect } from "next/navigation";
import React from "react";
import LoginSignUpPageLayout from "./_components/LoginSignUpPageLayout";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { statusToURL } from "@/types/UserModelTypes";

export default async function LoginPage(
  props: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOptions);
  if (session && session.user.userStatus)
    return redirect(statusToURL[session.user.userStatus]);

  return (
    <LoginSignUpPageLayout fromRedirect={searchParams.redirect ?? "false"} />
  );
}
