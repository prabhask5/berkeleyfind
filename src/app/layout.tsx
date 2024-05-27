import type { Metadata } from "next";
import Providers from "@/app/_components/Providers";
import { fonts } from "@/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "BerkeleyFind",
  description:
    "A social platform to help Berkeley students create study groups and find friends in their classes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fonts.baloo_thambi_2.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
