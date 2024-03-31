import { redirect } from "next/navigation";
import React from "react";
import LoginSignUpView from "./_components/LoginSignUpView";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { statusToURL } from "@/types/UserModelTypes";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (session && session.user.userStatus)
    return redirect(statusToURL[session.user.userStatus]);

  return <LoginSignUpView fromRedirect={searchParams.redirect ?? "false"} />;
}
