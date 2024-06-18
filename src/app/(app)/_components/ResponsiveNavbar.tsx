"use client";

import { useBetterMediaQuery } from "@/lib/reactUtils";
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
      <div className="fixed bg-[#E6E6E6] rounded-full z-10 top-[4.166667%] right-[4.166667%] lg:top-[1.25%] lg:right-[1.25%]">
        <NavBar profilePic={profilePic} email={email} name={name} />
      </div>
    ) : (
      <NavBar profilePic={profilePic} email={email} name={name} />
    );
  };

  return resolveNavBarRender();
}
