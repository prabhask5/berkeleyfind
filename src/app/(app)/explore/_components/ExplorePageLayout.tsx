"use client";

import { FilterTag, RelevantSessionProps } from "@/types/MiscTypes";
import ProfileSearchFilter from "./ProfileSearchFilter";
import { useBetterMediaQuery } from "@/lib/utils";
import NavBar from "../../_components/Navbar";
import { useForm } from "react-hook-form";
import { ExploreUserType } from "@/types/UserModelTypes";
import { useToast, ToastId } from "@chakra-ui/react";
import React, { useEffect } from "react";

interface ExplorePageLayoutProps extends RelevantSessionProps {
  users: ExploreUserType[] | null;
  success: boolean;
  error: string | null;
}

interface ISessionTagInfo {
  tagList: FilterTag[];
}

export default function ExplorePageLayout({
  profilePic,
  email,
  name,
  success,
  users,
  error,
}: ExplorePageLayoutProps) {
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

  const isTabletOrMobile = useBetterMediaQuery({
    query: "(max-width: 1280px)",
  });

  const { resetField, setValue, watch, register } = useForm<ISessionTagInfo>({
    mode: "all",
    defaultValues: {
      tagList: [],
    },
  });

  const profileCardLayouts = null;

  const mobileLayout = () => (
    <div className="w-screen h-screen">
      <div className="fixed bg-white rounded-full z-10 top-[4.166667%] left-[4.166667%] lg:top-[1.25%] lg:left-[1.25%]">
        <ProfileSearchFilter
          resetField={resetField}
          setValue={setValue}
          watch={watch}
          register={register}
        />
      </div>
      <div className="fixed bg-white rounded-full z-10 top-[4.166667%] right-[4.166667%] lg:top-[1.25%] lg:right-[1.25%]">
        <NavBar profilePic={profilePic} email={email} name={name} />
      </div>
      <div className="w-full h-full bg-[#E1E1E1] overflow-y-auto overflow-x-hidden">
        {profileCardLayouts}
      </div>
    </div>
  );

  const desktopLayout = () => (
    <div className="w-screen h-screen">
      <NavBar profilePic={profilePic} email={email} name={name} />
      <div className="w-full h-[calc(100%_-_80px)] flex flex-row">
        <div className="w-[20%]">
          <ProfileSearchFilter
            resetField={resetField}
            setValue={setValue}
            watch={watch}
            register={register}
          />
        </div>
        <div className="w-[80%]">
          <div className="bg-[#E1E1E1] overflow-y-auto overflow-x-hidden w-full h-full">
            {profileCardLayouts}
          </div>
        </div>
      </div>
    </div>
  );

  return isTabletOrMobile ? mobileLayout() : desktopLayout();
}
