"use client";

import { resolveProfileImageLink } from "@/lib/utils";
import Image from "next/image";
import { Heading, Stack, Text } from "@chakra-ui/react";

interface ProfileReadViewProps {
  profileImage: string;
  firstName: string;
  lastName: string;
  major: string;
  gradYear: string;
  userBio: string;
  pronouns: string;
}

export default function ProfileReadView({
  profileImage,
  firstName,
  lastName,
  major,
  gradYear,
  userBio,
  pronouns,
}: ProfileReadViewProps) {
  const name = firstName + " " + lastName;
  const nameSize = Math.min(
    20,
    Math.min(
      (firstName.length - 32) / -2.0 + 20,
      (lastName.length - 35) / -2.0 + 20,
    ),
  );

  const displayName =
    name.length < 25 ? (
      <div className="flex flex-row">
        <Heading size="md">{name}</Heading>
        <Text className="pl-2 font-bold" variant="underText">
          {pronouns}
        </Text>
      </div>
    ) : (
      <div>
        <div className="flex flex-row">
          <Heading fontSize={nameSize + "px"}>{firstName}</Heading>
          <Text className="pl-2 font-bold" variant="underText">
            {pronouns}
          </Text>
        </div>
        <Heading fontSize={nameSize + "px"}>{lastName}</Heading>
      </div>
    );

  return (
    <Stack spacing={5}>
      <div className="flex flex-row gap-2 m-auto">
        <div className="relative min-w-20 h-20 sm:min-w-28 sm:h-28">
          <Image
            fill
            className="rounded-full"
            draggable="false"
            src={resolveProfileImageLink(profileImage)}
            alt="Profile picture"
          />
        </div>
        <div className="my-auto">
          {displayName}
          <Text>{major + " Major"}</Text>
          <Text variant="underText">{"Graduating " + gradYear}</Text>
        </div>
      </div>
      <Text>{userBio}</Text>
    </Stack>
  );
}
