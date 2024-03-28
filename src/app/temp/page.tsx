"use client";

import { Heading, Link, Stack, Text, HStack, Spinner } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RedirectPage() {
  const [showError, setShowError] = useState<boolean>(false);
  const router = useRouter();

  getSession().then((session) => {
    if (session && session.user.userStatus) {
      router.push(`/${session.user.userStatus}`);
    } else router.push("/login");
  });

  setTimeout(() => setShowError(true), 2500);

  return (
    <div style={{ textAlign: "center", marginTop: "17%" }}>
      <Heading variant="logo" size="lg" style={{ marginBottom: "50px" }}>
        BerkeleyFind
      </Heading>
      <Stack spacing={5}>
        <HStack style={{ margin: "auto" }} spacing={5}>
          <Heading size="2xl">Please wait to be redirected.</Heading>
          <Spinner
            size="xl"
            thickness="5px"
            speed="0.65s"
            emptyColor="gray.200"
            color="#A73CFC"
          />
        </HStack>
        {showError && (
          <Text variant="underText">
            If you are seeing this, something went wrong! Click{" "}
            <Link onClick={() => router.back()}>here</Link> to go back to the
            previous page.
          </Text>
        )}
      </Stack>
    </div>
  );
}
