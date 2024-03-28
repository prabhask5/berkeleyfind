"use client";

import { Heading, Link, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function PageNotFound() {
  const router = useRouter();

  return (
    <Stack
      spacing={[1, 2, 3, 5, 5, 5]}
      className="w-9/12 sm:w-7/12 md:w-8/12 text-center m-auto"
    >
      <Heading variant="logo" size={["xs", "md", "lg", "lg", "lg", "lg"]}>
        BerkeleyFind
      </Heading>
      <Heading size={["md", "xl", "2xl", "2xl", "2xl", "2xl"]}>
        404: Page Not Found.
      </Heading>
      <Text
        fontSize={["6px", "9px", "xs", "sm", "sm", "sm"]}
        variant="underText"
      >
        Sorry! The page you were looking for cannot be found. Please click{" "}
        <Link onClick={() => router.back()}>here</Link> go back and try again.
      </Text>
    </Stack>
  );
}
