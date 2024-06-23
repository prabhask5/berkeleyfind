import { authOptions } from "@/lib/auth";
import { ExploreUserType, statusToURL } from "@/types/UserModelTypes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ExplorePageLayout from "./_components/ExplorePageLayout";
import { getExploreUsers } from "@/actions/OtherUserInfoGetActions";
import { ActionResponse } from "@/types/RequestDataTypes";
import { UserCacheResponse } from "@/types/CacheModalTypes";
import { kv } from "@vercel/kv";
import { EXPLORE_PAGE_SLICE_SIZE } from "@/lib/constants";

export default async function Explore() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login?redirect=true");
  if (session.user.userStatus && session.user.userStatus !== "explore")
    return redirect(statusToURL[session.user.userStatus]);

  let success: boolean;
  let allUsers: ExploreUserType[];
  let error: string | null;

  const cachedInfo = await kv.get<UserCacheResponse>(session.user.email);
  const res: ActionResponse = JSON.parse(await getExploreUsers());
  success = res.status === 200;
  const data: any = res.responseData;
  allUsers = success ? data.users : [];
  error = !success ? data.error : null;

  const newCachedInfo: UserCacheResponse = {
    sessionUserInfo: cachedInfo?.sessionUserInfo ?? null,
    exploreFeed: allUsers,
  };
  await kv.set(session.user.email, newCachedInfo, { ex: 3600 });

  const initialRenderedUsers = allUsers.slice(0, EXPLORE_PAGE_SLICE_SIZE);

  return (
    <ExplorePageLayout
      profilePic={session.user.image}
      email={session.user.email}
      name={session.user.name}
      users={initialRenderedUsers}
      success={success}
      error={error}
      nextUnfetchedIndex={EXPLORE_PAGE_SLICE_SIZE}
    />
  );
}
