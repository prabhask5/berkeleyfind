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
      <div className="absolute bg-white rounded-full z-10 top-5 right-5">
        <NavBar profilePic={profilePic} email={email} name={name} />
      </div>
    ) : (
      <NavBar profilePic={profilePic} email={email} name={name} />
    );
  };

  return resolveNavBarRender();
}
