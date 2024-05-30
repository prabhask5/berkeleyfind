"use client";

import { FriendUserType, StrangerUserType } from "@/types/UserModelTypes";
import { useToast, ToastId } from "@chakra-ui/react";
import React, { useEffect } from "react";

interface SocialPageLayoutProps {
  friendsList: FriendUserType[] | null;
  outgoingRequestsList: StrangerUserType[] | null;
  incomingRequestsList: StrangerUserType[] | null;
  error: string | null;
  success: boolean;
}

export default function SocialPageLayout({
  friendsList,
  outgoingRequestsList,
  incomingRequestsList,
  error,
  success,
}: SocialPageLayoutProps) {
  const toast = useToast();
  const toastRef = React.useRef<ToastId>();

  useEffect(() => {
    if (toastRef.current) return;
    if (!success) {
      toastRef.current = toast({
        title: error,
        status: "error",
        duration: 2000,
        isClosable: false,
      });
    }
  }, [error, success, toast]);

  return <div></div>;
}
