"use client";

import { Heading, Stack } from "@chakra-ui/react";
import { ProfileEditForm } from "@/app/(app)/()/profile/_components/ProfileEditForm";

interface StartProfilePageLayoutProps {
  email: string;
}

export default function StartProfilePageLayout({
  email,
}: StartProfilePageLayoutProps) {
  return (
    <div className="flex w-screen lg:h-screen">
      <Stack
        direction={["column", "column", "column", "row", "row", "row"]}
        spacing={[10, 10, 10, 10, 10, 10]}
        className="w-11/12 lg:w-[97.5%] mx-auto my-[10%] lg:my-auto h-full lg:pt-5"
      >
        <Heading
          className="text-center m-auto"
          size={["lg", "xl", "xl", "xl", "xl", "2xl"]}
        >
          Welcome! Start building your profile by first entering some basic
          information.
        </Heading>
        <div className="w-full lg:m-auto lg:overflow-y-auto lg:overflow-x-hidden lg:p-2">
          <ProfileEditForm
            profileImage={""}
            firstName={""}
            lastName={""}
            email={email}
            major={""}
            gradYear={""}
            userBio={""}
            pronouns={""}
            fbURL={""}
            igURL={""}
            isStart
          />
        </div>
      </Stack>
    </div>
  );
}
