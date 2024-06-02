"use client";

import { Icon, IconButton, Tooltip } from "@chakra-ui/react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

interface IconLinksProps {
  fbURL: string;
  igURL: string;
  email: string;
}

export default function IconLinks({ fbURL, igURL, email }: IconLinksProps) {
  const fbIconLink = !fbURL ? null : (
    <Tooltip
      label="Facebook profile"
      aria-label="tooltip for socials"
      openDelay={350}
    >
      <a target="_blank" rel="noreferrer" href={fbURL}>
        <IconButton
          as="a"
          className="my-auto"
          variant="ghost"
          icon={<Icon as={FaFacebook} boxSize={6} />}
          aria-label={"Redirect to facebook url"}
        />
      </a>
    </Tooltip>
  );

  const igIconLink = !igURL ? null : (
    <Tooltip
      label="Instagram profile"
      aria-label="tooltip for socials"
      openDelay={350}
    >
      <a target="_blank" rel="noreferrer" href={igURL}>
        <IconButton
          as="a"
          className="my-auto"
          variant="ghost"
          icon={<Icon as={FaInstagram} boxSize={6} />}
          aria-label={"Redirect to instagram url"}
        />
      </a>
    </Tooltip>
  );

  const emailIconLink = !email ? null : (
    <Tooltip label="Email" aria-label="tooltip for socials" openDelay={350}>
      <a target="_blank" rel="noreferrer" href={"mailto:" + email}>
        <IconButton
          as="a"
          className="my-auto"
          variant="ghost"
          icon={<Icon as={MdOutlineEmail} boxSize={7} />}
          aria-label={"Send an email"}
        />
      </a>
    </Tooltip>
  );

  return (
    <div className="flex flex-row sm:gap-1">
      {fbIconLink}
      {igIconLink}
      {emailIconLink}
    </div>
  );
}
