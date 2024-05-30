import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { statusToURL } from "@/types/UserModelTypes";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import StartCoursesPageLayout from "./_components/StartCoursesPageLayout";

export default async function StartCourses() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login?redirect=true");
  if (session.user.userStatus && session.user.userStatus !== "startcourses")
    return redirect(statusToURL[session.user.userStatus]);

  return <StartCoursesPageLayout />;
}
