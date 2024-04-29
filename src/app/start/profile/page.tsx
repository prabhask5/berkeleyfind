import { Heading, Stack } from "@chakra-ui/react";
import { ProfileEditForm } from "@/app/(user)/profile/_components/ProfileEditForm";
import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { statusToURL } from "@/types/UserModelTypes";

export default async function StartProfile() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login?redirect=true");
  if (session.user.userStatus && session.user.userStatus !== "startprofile")
    return redirect(statusToURL[session.user.userStatus]);

  return (
    <div className="flex w-screen lg:h-screen">
      <Stack
        direction={["column", "column", "column", "row", "row", "row"]}
        spacing={[10, 10, 10, 10, 10, 10]}
        className="w-9/12 lg:w-[97.5%] mx-auto my-[10%] lg:my-auto h-full lg:pt-5"
      >
        <Heading
          className="text-center m-auto"
          size={["lg", "xl", "xl", "xl", "xl", "2xl"]}
        >
          Welcome! Start building your profile by first entering some basic
          information.
        </Heading>
        <div className="w-full lg:m-auto lg:h-full lg:overflow-y-auto lg:overflow-x-hidden lg:p-2">
          <ProfileEditForm
            profileImage={""}
            firstName={""}
            lastName={""}
            email={session.user?.email ?? ""}
            major={""}
            gradYear={""}
            userBio={""}
            pronouns={""}
            fbURL={""}
            igURL={""}
            isStart={true}
          />
        </div>
      </Stack>
    </div>
  );
}
