import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ModifyRequestsRequestData } from "@/types/RequestDataTypes";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import { ObjectId } from "mongodb";
import { GET as GetAllRequests } from "../route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session?.user.userStatus !== "explore")
    return Response.json({ error: "Not authorized" }, { status: 401 });

  const { otherUserId }: ModifyRequestsRequestData = await request.json();

  try {
    await dbConnect();

    const myRequestLists: {
      incomingRequestsList: ObjectId[];
      friendsList: ObjectId[];
    } = (await User.findById(
      session.user._id,
      "incomingRequestsList friendsList",
    )) ?? { incomingRequestsList: [], friendsList: [] };
    const newFriendRequestLists: {
      outgoingRequestsList: ObjectId[];
      friendsList: ObjectId[];
    } = (await User.findById(
      otherUserId,
      "outgoingRequestsList friendsList",
    )) ?? { outgoingRequestsList: [], friendsList: [] };

    myRequestLists.incomingRequestsList =
      myRequestLists.incomingRequestsList.filter((d) => d != otherUserId);
    myRequestLists.friendsList = [...myRequestLists.friendsList, otherUserId];
    newFriendRequestLists.outgoingRequestsList =
      newFriendRequestLists.outgoingRequestsList.filter(
        (d) => d != session.user._id,
      );
    newFriendRequestLists.friendsList = [
      ...newFriendRequestLists.friendsList,
      session.user._id,
    ];

    await User.findByIdAndUpdate(session.user._id, {
      $set: {
        incomingRequestsList: myRequestLists.incomingRequestsList,
        friendsList: myRequestLists.friendsList,
      },
    });
    await User.findByIdAndUpdate(otherUserId, {
      $set: {
        outgoingRequestsList: newFriendRequestLists.outgoingRequestsList,
        friendsList: newFriendRequestLists.friendsList,
      },
    });

    return await GetAllRequests();
  } catch (e) {
    return Response.json(
      { error: "Error in accepting friend request" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session?.user.userStatus !== "explore")
    return Response.json({ error: "Not authorized" }, { status: 401 });

  const { otherUserId }: ModifyRequestsRequestData = await request.json();

  try {
    await dbConnect();

    const myRequestList: { friendsList: ObjectId[] } = (await User.findById(
      session.user._id,
      "friendsList",
    )) ?? { friendsList: [] };
    const prevFriendRequestList: { friendsList: ObjectId[] } =
      (await User.findById(otherUserId, "friendsList")) ?? { friendsList: [] };

    myRequestList.friendsList = myRequestList.friendsList.filter(
      (d) => d != otherUserId,
    );
    prevFriendRequestList.friendsList =
      prevFriendRequestList.friendsList.filter((d) => d != session.user._id);

    await User.findByIdAndUpdate(session.user._id, {
      $set: {
        friendsList: myRequestList.friendsList,
      },
    });
    await User.findByIdAndUpdate(otherUserId, {
      $set: {
        friendsList: prevFriendRequestList.friendsList,
      },
    });

    return await GetAllRequests();
  } catch (e) {
    return Response.json(
      { error: "Error in deleting friend" },
      { status: 500 },
    );
  }
}
