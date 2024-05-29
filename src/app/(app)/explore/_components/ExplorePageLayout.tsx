"use client";

import { FilterTag, RelevantSessionProps } from "@/types/MiscTypes";
import ProfileSearchFilter from "./ProfileSearchFilter";
import { useBetterMediaQuery } from "@/lib/utils";
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
      <div className="absolute bg-white rounded-full z-10 top-5 left-5">
        <ProfileSearchFilter
          resetField={resetField}
          setValue={setValue}
          watch={watch}
          register={register}
        />
      </div>
      <div className="absolute bg-white rounded-full z-10 top-5 right-5">
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
