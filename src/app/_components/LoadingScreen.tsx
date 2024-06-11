"use client";

import { debounce } from "@/lib/utils";
import { Heading, Link, Stack, Text, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoadingScreen() {
  const [showError, setShowError] = useState<boolean>(false);

  const router = useRouter();

  setTimeout(() => setShowError(true), 7500);

  return (
    <div className="flex w-screen h-screen">
      <Stack
        spacing={[1, 3, 5, 5, 5, 5]}
        className="w-11/12 text-center m-auto"
      >
        <Heading variant="logo" size={["xs", "md", "lg", "lg", "lg", "lg"]}>
          BerkeleyFind
        </Heading>
        <Stack
          direction={["column", "column", "column", "row", "row", "row"]}
          className="m-auto"
          spacing={[1, 3, 5, 5, 5, 5]}
        >
          <Heading size={["lg", "2xl", "2xl", "2xl", "2xl", "2xl"]}>
            Please wait to be redirected.
          </Heading>
          <Spinner
            size={["md", "lg", "xl", "xl", "xl", "xl"]}
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="#A73CFC"
            className="m-auto"
          />
        </Stack>
        {showError && (
          <Text
            fontSize={["6px", "8px", "xs", "sm", "sm", "sm"]}
            variant="underText"
          >
            If you are seeing this, something went wrong! Click{" "}
            <Link onClick={debounce(() => router.back(), 100)}>here</Link> to go
            back to the previous page.
          </Text>
        )}
      </Stack>
    </div>
  );
}
