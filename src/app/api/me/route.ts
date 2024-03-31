import { User } from "@/models/User";
import type { UserType } from "@/types/UserModelTypes";
import dbConnect from "@/lib/dbConnect";
import { SessionCheckResponse, checkSession } from "@/lib/auth";

export async function GET() {
  const sesssionCheck: SessionCheckResponse = await checkSession();

  if (!sesssionCheck.ok)
    return Response.json({ error: "Not authorized" }, { status: 401 });

  try {
    await dbConnect();

    const user: UserType | null = await User.findById(sesssionCheck._id);

    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });
    return Response.json({ user }, { status: 200 });
  } catch (e) {
    return Response.json({ error: "Error in fetching user" }, { status: 500 });
  }
}
