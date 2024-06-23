"use client";

import {
  Heading,
  PopoverTrigger,
  Popover,
  PopoverContent,
  PopoverBody,
  Divider,
  Box,
  PopoverArrow,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerOverlay,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { resolveProfileImageLink } from "@/lib/utils";
import { useBetterMediaQuery } from "@/lib/hooks";
import { RelevantSessionProps } from "@/types/MiscTypes";
import React from "react";

interface NavBarProps extends RelevantSessionProps {}

export default function NavBar({ profilePic, email, name }: NavBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isTabletOrMobile = useBetterMediaQuery({
    query: "(max-width: 1280px)",
  });
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const {
    isOpen: isPopoverOpen,
    onOpen: onPopoverOpen,
    onClose: onPopoverClose,
  } = useDisclosure();

  useEffect(() => {
    router.prefetch("/explore");
    router.prefetch("/profile");
    router.prefetch("/social");
    router.prefetch("/login");
  }, [router]);

  const handleRedirect = (destination: string) => {
    if (pathname !== destination) {
      onDrawerClose();
      onPopoverClose();
      router.push(destination);
    }
  };

  const logo = (
    <Link href="/explore" className="cursor-pointer" passHref>
      <Heading variant="navbarLogo" size={["md", "md", "md", "md", "md", "md"]}>
        BerkeleyFind
      </Heading>
    </Link>
  );

  const avatar = (
    <div className="relative w-16 h-16">
      <Image
        fill
        sizes="100vw"
        className="rounded-full"
        draggable="false"
        src={resolveProfileImageLink(profilePic)}
        alt="Profile picture"
      />
    </div>
  );

  const menuOptionsBaseStyle =
    "font-[510] flex items-center p-2 group cursor-pointer ";
  const menuOptionsCurrentPageStyleAddOn = " text-[#A73CFC]";
  const svgBaseStyle = "flex-shrink-0 w-5 h-5 ";
  const svgSelectStyleAddOn = " text-gray-500";
  const menuOptionsSelectStyleAddOn = " hover:bg-[#F2F2F2] active:bg-[#E6E6E6]";

  const exploreOption = (rounded: boolean) => (
    <a
      onClick={() => handleRedirect("/explore")}
      className={
        menuOptionsBaseStyle +
        (pathname === "/explore"
          ? menuOptionsCurrentPageStyleAddOn
          : menuOptionsSelectStyleAddOn) +
        (rounded ? " rounded-lg" : "")
      }
    >
      <svg
        className={
          svgBaseStyle +
          (pathname == "/explore"
            ? menuOptionsCurrentPageStyleAddOn
            : svgSelectStyleAddOn)
        }
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 18"
      >
        <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
      </svg>
      <span className="flex-1 ms-3 whitespace-nowrap">Explore</span>
    </a>
  );

  const profileOption = (rounded: boolean) => (
    <a
      onClick={() => handleRedirect("/profile")}
      className={
        menuOptionsBaseStyle +
        (pathname === "/profile"
          ? menuOptionsCurrentPageStyleAddOn
          : menuOptionsSelectStyleAddOn) +
        (rounded ? " rounded-lg" : "")
      }
    >
      <svg
        className={
          svgBaseStyle +
          (pathname == "/profile"
            ? menuOptionsCurrentPageStyleAddOn
            : svgSelectStyleAddOn)
        }
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 18 20"
      >
        <path d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z" />
      </svg>
      <span className="flex-1 ms-3 whitespace-nowrap">My Profile</span>
    </a>
  );

  const socialOption = (rounded: boolean) => (
    <a
      onClick={() => handleRedirect("/social")}
      className={
        menuOptionsBaseStyle +
        (pathname === "/social"
          ? menuOptionsCurrentPageStyleAddOn
          : menuOptionsSelectStyleAddOn) +
        (rounded ? " rounded-lg" : "")
      }
    >
      <svg
        className={
          svgBaseStyle +
          (pathname == "/social"
            ? menuOptionsCurrentPageStyleAddOn
            : svgSelectStyleAddOn)
        }
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
      </svg>
      <span className="flex-1 ms-3 whitespace-nowrap">Social</span>
    </a>
  );

  const signOutOption = (rounded: boolean) => (
    <a
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={
        menuOptionsBaseStyle +
        menuOptionsSelectStyleAddOn +
        (rounded ? " rounded-lg" : "")
      }
    >
      <svg
        className="flex-shrink-0 w-5 h-5 text-gray-500"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 16 16"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3"
        />
      </svg>
      <span className="flex-1 ms-3 whitespace-nowrap">Sign out</span>
    </a>
  );

  const dropdownBody = () => {
    return (
      <PopoverContent className="w-48">
        <PopoverArrow />
        <PopoverBody>
          <div className="font-bold">{name}</div>
          <div className="font-bold truncate">{email}</div>
        </PopoverBody>
        <Divider />
        {exploreOption(false)}
        {profileOption(false)}
        {socialOption(false)}
        <Divider />
        {signOutOption(false)}
      </PopoverContent>
    );
  };

  const dropdown = (
    <Popover isOpen={isPopoverOpen} onClose={onPopoverClose} trigger="hover">
      <PopoverTrigger>
        <Box onMouseEnter={onPopoverOpen} className="my-auto">
          <div className="cursor-pointer">{avatar}</div>
        </Box>
      </PopoverTrigger>
      {dropdownBody()}
    </Popover>
  );

  const menuButton = (
    <IconButton
      className="rounded-full"
      variant="ghost"
      onClick={onDrawerOpen}
      icon={<HamburgerIcon className="w-6 h-6" />}
      aria-label="Menu button"
    />
  );

  const closeButton = (
    <IconButton
      className="rounded-full"
      variant="ghost"
      onClick={onDrawerClose}
      icon={<CloseIcon className="w-3 h-3" />}
      aria-label="Close drawer button"
    />
  );

  const drawer = () => (
    <Drawer onClose={onDrawerClose} isOpen={isDrawerOpen} size="xs">
      <DrawerOverlay />
      <DrawerContent>
        <div className="flex flex-row my-6 px-6">
          <div className="my-auto">{logo}</div>
          <div className="ml-auto my-auto">{closeButton}</div>
        </div>
        <div className="px-6 flex flex-row my-6">
          <div className="my-auto">
            <div className="font-bold">{name}</div>
            <div className="font-bold truncate">{email}</div>
          </div>
          <div className="my-auto ml-auto">{avatar}</div>
        </div>
        <div className="px-4 my-3">
          {exploreOption(true)}
          {profileOption(true)}
          {socialOption(true)}
          {signOutOption(true)}
        </div>
      </DrawerContent>
    </Drawer>
  );

  return isTabletOrMobile ? (
    <>
      {menuButton}
      {drawer()}
    </>
  ) : (
    <div className="flex flex-row h-20 px-5 border-b-2 border-[#D8D8D8]">
      <div className="my-auto">{logo}</div>
      <div className="ml-auto my-auto">{dropdown}</div>
    </div>
  );
}
