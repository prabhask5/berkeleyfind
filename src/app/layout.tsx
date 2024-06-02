import type { Metadata } from "next";
import ThemeProvider from "@/app/_components/ThemeProvider";
import { fonts } from "@/theme";
import "./globals.css";
import { cookies } from "next/headers";

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
  const cookiesList = cookies();
  const colorMode = cookiesList.get("chakra-ui-color-mode");

  return (
    <html lang="en" className={fonts.baloo_thambi_2.variable}>
      <body>
        <ThemeProvider colorMode={colorMode?.value}>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
