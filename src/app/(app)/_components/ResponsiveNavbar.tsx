"use client";

import { useBetterMediaQuery } from "@/lib/utils";
import NavBar from "./Navbar";
import { RelevantSessionProps } from "@/types/MiscTypes";

interface ResponsiveNavBarProps extends RelevantSessionProps {}

export default function ResponsiveNavBar({
  profilePic,
  email,
  name,
}: ResponsiveNavBarProps) {
  const isTabletOrMobile = useBetterMediaQuery({
    query: "(max-width: 1280px)",
  });

  const resolveNavBarRender = () => {
    return isTabletOrMobile ? (
      <div className="flex flex-row h-20 px-5 border-b-2 border-[#D8D8D8]">
        <div className="ml-auto my-auto">
          <NavBar profilePic={profilePic} email={email} name={name} />
        </div>
      </div>
    ) : (
      <NavBar profilePic={profilePic} email={email} name={name} />
    );
  };

  return resolveNavBarRender();
}
