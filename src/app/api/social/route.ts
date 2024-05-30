import { User } from "@/models/User";
import {
  FriendUserDataQuery,
  StangerUserDataQuery,
  type FriendUserType,
  type StrangerUserType,
} from "@/types/UserModelTypes";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session?.user.userStatus !== "explore")
    return Response.json({ error: "Not authorized" }, { status: 401 });

  try {
    await dbConnect();

    const userLists: {
      friendsList: ObjectId[];
      outgoingRequestsList: ObjectId[];
      incomingRequestsList: ObjectId[];
    } = (await User.findById(
      session.user._id,
      "friendsList outgoingRequestsList incomingRequestsList",
    )) ?? {
      friendsList: [],
      outgoingRequestsList: [],
      incomingRequestsList: [],
    };

    const friendsList: FriendUserType[] =
      (await User.find(
        { _id: { $in: userLists.friendsList }, userStatus: "explore" },
        FriendUserDataQuery,
      )) ?? [];
    const outgoingRequestsList: StrangerUserType[] =
      (await User.find(
        { _id: { $in: userLists.outgoingRequestsList }, userStatus: "explore" },
        StangerUserDataQuery,
      )) ?? [];
    const incomingRequestsList: StrangerUserType[] =
      (await User.find(
        { _id: { $in: userLists.incomingRequestsList }, userStatus: "explore" },
        StangerUserDataQuery,
      )) ?? [];

    return Response.json(
      { friendsList, outgoingRequestsList, incomingRequestsList },
      { status: 200 },
    );
  } catch (e) {
    return Response.json(
      { error: "Error in fetching requests" },
      { status: 500 },
    );
  }
}
