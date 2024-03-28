import { User } from "@/models/User";
import type { UserType } from "@/types/UserModelTypes";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session?.user?.userStatus !== "explore")
    return Response.json({ error: "Not authorized" }, { status: 401 });

  try {
    await dbConnect();

    const user: UserType | null = await User.findById(session.user._id);

    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });
    return Response.json({ user }, { status: 200 });
  } catch (e) {
    return Response.json({ error: "Error in fetching user" }, { status: 500 });
  }
}
