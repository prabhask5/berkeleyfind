import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { POSTStudyPrefRequestData } from "@/types/RequestDataTypes";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import { StudyPreferences } from "@/types/UserPreferenceModelTypes";
import { SessionCheckResponse, checkSession } from "@/lib/auth";

export async function GET() {
  const sesssionCheck: SessionCheckResponse = await checkSession([
    "startstudypref",
  ]);

  if (!sesssionCheck.ok)
    return Response.json({ error: "Not authorized" }, { status: 401 });

  try {
    await dbConnect();

    const userStudyPreferences: StudyPreferences | null = await User.findById(
      sesssionCheck._id,
      "userStudyPreferences"
    );

    if (!userStudyPreferences)
      return Response.json(
        { error: "User study preferences not found" },
        { status: 404 }
      );
    return Response.json({ userStudyPreferences }, { status: 200 });
  } catch (e) {
    return Response.json(
      { error: "Error in fetching user study preferences" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session?.user?.userStatus !== "startstudypref" &&
      session?.user?.userStatus !== "explore")
  )
    return Response.json({ error: "Not authorized" }, { status: 401 });

  const { userStudyPreferences }: POSTStudyPrefRequestData =
    await request.json();

  try {
    const updateData: any = { userStudyPreferences };
    if (session.user.userStatus === "startstudypref")
      updateData.userStatus = "explore";

    await dbConnect();

    await User.findByIdAndUpdate(session.user._id, {
      $set: updateData,
    });

    return Response.json({ userStudyPreferences }, { status: 200 });
  } catch (e) {
    return Response.json(
      { error: "Error in modifying user course list" },
      { status: 500 }
    );
  }
}
