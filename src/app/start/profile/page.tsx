import { Heading, Stack } from "@chakra-ui/react";
import {
  ProfileEditForm,
  ProfileEditFormProps,
} from "@/app/profile/_components/ProfileEditForm";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { statusToURL } from "@/types/UserModelTypes";
import { headers } from "next/headers";

export default async function StartProfile() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login?redirect=true");
  if (session.user.userStatus && session.user.userStatus !== "startprofile")
    return redirect(statusToURL[session.user.userStatus]);

  const response = await fetch(`${process.env.API_URL}/mybasicinfo`, {
    method: "GET",
    headers: headers(),
  });
  const editFormData: ProfileEditFormProps = (await response.json()).user;

  return (
    <Stack
      direction={["column", "column", "column", "column", "column", "column"]}
      spacing={[10, 10, 10, 10, 10, 10]}
      className="w-9/12 mx-auto my-[12.5%]"
    >
      <Heading
        className="text-center"
        size={["lg", "lg", "lg", "lg", "lg", "lg"]}
      >
        Welcome! Start building your profile by first entering some basic
        information.
      </Heading>
      <ProfileEditForm
        profileImage={editFormData?.profileImage ?? ""}
        firstName={editFormData?.firstName ?? ""}
        lastName={editFormData?.lastName ?? ""}
        email={editFormData?.email ?? ""}
        major={editFormData?.major ?? ""}
        gradYear={editFormData?.gradYear ?? ""}
        userBio={editFormData?.userBio ?? ""}
        pronouns={editFormData?.pronouns ?? ""}
        fbURL={editFormData?.fbURL ?? ""}
        igURL={editFormData?.igURL ?? ""}
        fetchedSavedData={response.ok ?? false}
        isStart={true}
      />
    </Stack>
  );
}
