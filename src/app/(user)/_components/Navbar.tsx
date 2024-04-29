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
  useToast,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerCloseButton,
  Button,
  DrawerFooter,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Image from "next/image";
import Link from "next/link";
import placeholder from "@/media/avatar_placeholder.svg";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";

interface NavBarProps {
  profilePic: string | null | undefined;
  email: string | null | undefined;
  name: string | null | undefined;
}

export default function NavBar({ profilePic, email, name }: NavBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    router.prefetch("/explore");
    router.prefetch("/profile");
    router.prefetch("/requests");
    router.prefetch("/login");
  }, [router]);

  const resolveProfileImageLink = () => {
    if (profilePic) return profilePic;
    return placeholder;
  };

  const handleRedirect = (destination: string) => {
    if (pathname !== destination) {
      toast({
        title: "Please wait to be redirected...",
        status: "loading",
        duration: null,
      });
      router.push(destination);
    }
  };

  const logo = (
    <Link href="/explore" passHref>
      <Heading variant="navbarLogo" size={["md", "md", "md", "md", "md", "md"]}>
        BerkeleyFind
      </Heading>
    </Link>
  );

  const avatar = (
    <div className="relative w-16 h-16">
      <Image
        fill
        className="rounded-full"
        draggable="false"
        src={resolveProfileImageLink()}
        alt="Profile picture"
      />
    </div>
  );

  const dropdownBody = () => {
    const menuOptionsBaseStyle = "font-[510]";
    const menuOptionsCurrentPageStyleAddOn = " text-[#A73CFC]";
    const menuOptionsSelectStyleAddOn =
      " cursor-pointer hover:bg-[#F2F2F2] active:bg-[#E6E6E6]";

    return (
      <PopoverContent className="w-48">
        <PopoverArrow />
        <PopoverBody>
          <div className="font-bold">{name}</div>
          <div className="font-bold truncate">{email}</div>
        </PopoverBody>
        <Divider />
        <PopoverBody
          onClick={() => handleRedirect("/explore")}
          className={
            menuOptionsBaseStyle +
            (pathname === "/explore"
              ? menuOptionsCurrentPageStyleAddOn
              : menuOptionsSelectStyleAddOn)
          }
        >
          Explore
        </PopoverBody>
        <PopoverBody
          onClick={() => handleRedirect("/profile")}
          className={
            menuOptionsBaseStyle +
            (pathname === "/profile"
              ? menuOptionsCurrentPageStyleAddOn
              : menuOptionsSelectStyleAddOn)
          }
        >
          My Profile
        </PopoverBody>
        <PopoverBody
          onClick={() => handleRedirect("/requests")}
          className={
            menuOptionsBaseStyle +
            (pathname === "/requests"
              ? menuOptionsCurrentPageStyleAddOn
              : menuOptionsSelectStyleAddOn)
          }
        >
          My Requests
        </PopoverBody>
        <Divider />
        <PopoverBody
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={menuOptionsBaseStyle + menuOptionsSelectStyleAddOn}
        >
          Sign out
        </PopoverBody>
      </PopoverContent>
    );
  };

  const dropdown = (
    <Popover trigger="hover">
      <Box className="my-auto">
        <PopoverTrigger>
          <div className="cursor-pointer">{avatar}</div>
        </PopoverTrigger>
      </Box>
      {dropdownBody()}
    </Popover>
  );

  const menuButton = (
    <IconButton
      className="rounded-full block ml-auto mr-2 mt-2"
      variant="ghost"
      onClick={onOpen}
      icon={<HamburgerIcon className="w-6 h-6" />}
      aria-label="Menu button"
    />
  );

  const drawer = () => {
    const menuOptionsBaseStyle = "font-[510] pl-6";
    const menuOptionsCurrentPageStyleAddOn = " text-[#A73CFC]";
    const menuOptionsSelectStyleAddOn =
      " cursor-pointer hover:bg-[#F2F2F2] active:bg-[#E6E6E6]";

    return (
      <Drawer onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader className="mt-5">
            <div className="flex flex-row">
              <div className="my-auto">{logo}</div>
              <div className="ml-auto my-auto">{avatar}</div>
            </div>
          </DrawerHeader>
          <DrawerBody className="p-0 mt-8">
            <div className="pl-6">
              <div className="font-bold">{name}</div>
              <div className="font-bold truncate">{email}</div>
            </div>
            <Stack className="mt-10" spacing={[2, 2, 2, 2, 2, 2]}>
              <div
                onClick={() => handleRedirect("/explore")}
                className={
                  menuOptionsBaseStyle +
                  (pathname === "/explore"
                    ? menuOptionsCurrentPageStyleAddOn
                    : menuOptionsSelectStyleAddOn)
                }
              >
                Explore
              </div>
              <div
                onClick={() => handleRedirect("/profile")}
                className={
                  menuOptionsBaseStyle +
                  (pathname === "/profile"
                    ? menuOptionsCurrentPageStyleAddOn
                    : menuOptionsSelectStyleAddOn)
                }
              >
                My Profile
              </div>
              <div
                onClick={() => handleRedirect("/requests")}
                className={
                  menuOptionsBaseStyle +
                  (pathname === "/requests"
                    ? menuOptionsCurrentPageStyleAddOn
                    : menuOptionsSelectStyleAddOn)
                }
              >
                My Requests
              </div>
            </Stack>
            <DrawerFooter>
              <Button
                className="mr-auto mt-10"
                variant="websiteTheme"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Sign Out
              </Button>
            </DrawerFooter>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  };

  return isTabletOrMobile ? (
    <div className="w-screen">
      {menuButton}
      {drawer()}
    </div>
  ) : (
    <div className="flex flex-row h-20 px-5">
      <div className="my-auto">{logo}</div>
      <div className="ml-auto my-auto">{dropdown}</div>
    </div>
  );
}
