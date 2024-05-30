import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ExploreUserType, statusToURL } from "@/types/UserModelTypes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ExplorePageLayout from "./_components/ExplorePageLayout";
import { getExploreUsers } from "@/app/actions/OtherUserInfoGetActions";

export default async function Explore() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login?redirect=true");
  if (session.user.userStatus && session.user.userStatus !== "explore")
    return redirect(statusToURL[session.user.userStatus]);

  const res: Response = await getExploreUsers();
  const success: boolean = res.status === 200;
  const data: any = await res.json();

  const users: ExploreUserType[] = success ? data.user : null;
  const error: string = !success ? data.error : null;

  return (
    <ExplorePageLayout
      profilePic={session.user.image}
      email={session.user.email}
      name={session.user.name}
      users={users}
      success={success}
      error={error}
    />
  );
}
