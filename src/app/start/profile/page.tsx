import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { statusToURL } from "@/types/UserModelTypes";
import StartProfilePageLayout from "./_components/StartProfilePageLayout";

export default async function StartProfile() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login?redirect=true");
  if (session.user.userStatus && session.user.userStatus !== "startprofile")
    return redirect(statusToURL[session.user.userStatus]);

  return <StartProfilePageLayout email={session.user.email} />;
}
