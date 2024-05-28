"use client";

import { FilterTag, RelevantSessionProps } from "@/types/MiscTypes";
import ProfileSearchFilter from "./ProfileSearchFilter";
import { useMediaQuery } from "react-responsive";
import NavBar from "../../_components/Navbar";
import { useForm } from "react-hook-form";

interface ExplorePageLayoutProps extends RelevantSessionProps {}

interface ISessionTagInfo {
  tagList: FilterTag[];
}

export default function ExplorePageLayout({
  profilePic,
  email,
  name,
}: ExplorePageLayoutProps) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1280px)" });

  const { resetField, setValue, watch, register } = useForm<ISessionTagInfo>({
    mode: "all",
    defaultValues: {
      tagList: [],
    },
  });

  const profileCardLayouts = null;

  const mobileLayout = () => (
    <div className="w-screen h-screen">
      <div className="flex flex-row h-20 px-5 border-b-2 border-[#D8D8D8]">
        <div className="my-auto">
          <ProfileSearchFilter
            resetField={resetField}
            setValue={setValue}
            watch={watch}
            register={register}
          />
        </div>
        <div className="ml-auto my-auto">
          <NavBar profilePic={profilePic} email={email} name={name} />
        </div>
      </div>
      <div className="w-full h-[calc(100%_-_80px)] bg-[#E1E1E1] overflow-y-auto overflow-x-hidden">
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
