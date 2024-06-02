import { authOptions } from "@/lib/auth";
import { statusToURL } from "@/types/UserModelTypes";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import StartStudyTimesPageLayout from "./_components/StartStudyTimesPageLayout";

export default async function StartStudyTimes() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login?redirect=true");
  if (session.user.userStatus && session.user.userStatus !== "startstudypref")
    return redirect(statusToURL[session.user.userStatus]);

  return <StartStudyTimesPageLayout />;
}
