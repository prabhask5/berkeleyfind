import type { Metadata } from "next";
import Providers from "@/app/_components/Providers";
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
    <html lang="en">
      <body className="flex w-screen h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
