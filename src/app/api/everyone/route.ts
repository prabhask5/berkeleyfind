import { User } from "@/models/User";
import {
  ExploreUserType,
  StangerUserDataQuery,
  type StrangerUserType,
} from "@/types/UserModelTypes";
import dbConnect from "@/lib/dbConnect";
import { type ProfileMatchMyData, profileMatch } from "@/lib/matcher";
import { GETExploreRequestData } from "@/types/RequestDataTypes";
import { type SessionCheckResponse, checkSession } from "@/lib/auth";

export async function GET(request: Request) {
  const sesssionCheck: SessionCheckResponse = await checkSession();

  if (!sesssionCheck.ok)
    return Response.json({ error: "Not authorized" }, { status: 401 });

  const { firstIndex, lastIndex }: GETExploreRequestData = await request.json();

  try {
    await dbConnect();

    const me: ProfileMatchMyData | null = await User.findById(
      sesssionCheck._id,
      "major pronouns courseList userStudyPreferences"
    );

    if (!me) return Response.json({ error: "User not found" }, { status: 404 });

    const users: StrangerUserType[] | null = await User.find(
      { _id: { $ne: sesssionCheck._id }, userStatus: "explore" },
      StangerUserDataQuery
    );

    const sortedExploreUsers: ExploreUserType[] = (users ?? [])
      .map((user) => ({ ...user, profileMatch: profileMatch(me, user) }))
      .sort((a, b) => a.profileMatch - b.profileMatch)
      .slice(firstIndex, lastIndex);

    return Response.json({ users: sortedExploreUsers }, { status: 200 });
  } catch (e) {
    return Response.json({ error: "Error in fetching users" }, { status: 500 });
  }
}
