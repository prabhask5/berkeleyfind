import { authOptions } from "@/lib/auth";
import { ExploreUserType, statusToURL } from "@/types/UserModelTypes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ExplorePageLayout from "./_components/ExplorePageLayout";
import { getExploreUsers } from "@/actions/OtherUserInfoGetActions";
import { ActionResponse } from "@/types/RequestDataTypes";

export default async function Explore() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login?redirect=true");
  if (session.user.userStatus && session.user.userStatus !== "explore")
    return redirect(statusToURL[session.user.userStatus]);

  const res: ActionResponse = JSON.parse(await getExploreUsers());
  const success: boolean = res.status === 200;
  const data: any = res.responseData;

  const users: ExploreUserType[] = success ? data.users : null;
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
