"use client";

import { Heading, Link, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function PageNotFound() {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center", marginTop: "17%" }}>
      <Heading variant="logo" size="lg" className="mb-12">
        BerkeleyFind
      </Heading>
      <Stack spacing={5}>
        <Heading size="2xl">404: Page Not Found.</Heading>
        <Text variant="underText">
          Sorry! The page you were looking for cannot be found. Please click{" "}
          <Link onClick={() => router.back()}>here</Link> go back and try again.
        </Text>
      </Stack>
    </div>
  );
}
