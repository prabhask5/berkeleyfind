import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { statusToURL } from "@/types/UserModelTypes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ExplorePageLayout from "./_components/ExplorePageLayout";

export default async function Explore() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login?redirect=true");
  if (session.user.userStatus && session.user.userStatus !== "explore")
    return redirect(statusToURL[session.user.userStatus]);

  return (
    <ExplorePageLayout
      profilePic={session.user.image}
      email={session.user.email}
      name={session.user.name}
    />
  );
}
