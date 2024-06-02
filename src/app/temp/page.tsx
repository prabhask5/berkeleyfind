"use client";

import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { statusToURL } from "@/types/UserModelTypes";
import LoadingScreen from "@/app/_components/LoadingScreen";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (!session) return router.push("/login?redirect=true");
      router.push(statusToURL[session.user.userStatus]);
    });
  }, [router]);

  return <LoadingScreen />;
}
