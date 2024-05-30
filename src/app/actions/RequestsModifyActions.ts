"use server";

import { SessionCheckResponse, checkSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import { ModifyRequestsRequestData } from "@/types/RequestDataTypes";
import { ObjectId } from "mongodb";
import { getAllRequests } from "./OtherUserInfoGetActions";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function acceptFriendRequest(data: ModifyRequestsRequestData) {
  const sesssionCheck: SessionCheckResponse = await checkSession();

  if (!sesssionCheck.ok)
    return Response.json({ error: "Not authorized" }, { status: 401 });

  const { otherUserId }: ModifyRequestsRequestData = data;

  try {
    await dbConnect();

    const myRequestLists: {
      incomingRequestsList: ObjectId[];
      friendsList: ObjectId[];
    } = (await User.findById(
      sesssionCheck._id,
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
        (d) => d != sesssionCheck._id,
      );
    newFriendRequestLists.friendsList = [
      ...newFriendRequestLists.friendsList,
      sesssionCheck._id as ObjectId,
    ];

    await User.findByIdAndUpdate(sesssionCheck._id, {
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

    return await getAllRequests();
  } catch (e) {
    return Response.json(
      { error: "Error in accepting friend request" },
      { status: 500 },
    );
  }
}

export async function deleteFriend(data: ModifyRequestsRequestData) {
  const session = await getServerSession(authOptions);

  if (!session || session?.user.userStatus !== "explore")
    return Response.json({ error: "Not authorized" }, { status: 401 });

  const { otherUserId }: ModifyRequestsRequestData = data;

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

    return await getAllRequests();
  } catch (e) {
    return Response.json(
      { error: "Error in deleting friend" },
      { status: 500 },
    );
  }
}

export async function deleteIncomingFriendRequest(
  data: ModifyRequestsRequestData,
) {
  const sesssionCheck: SessionCheckResponse = await checkSession();

  if (!sesssionCheck.ok)
    return Response.json({ error: "Not authorized" }, { status: 401 });

  const { otherUserId }: ModifyRequestsRequestData = data;

  try {
    await dbConnect();

    const myRequestList: { incomingRequestsList: ObjectId[] } =
      (await User.findById(sesssionCheck._id, "incomingRequestsList")) ?? {
        incomingRequestsList: [],
      };

    myRequestList.incomingRequestsList =
      myRequestList.incomingRequestsList.filter((d) => d != otherUserId);

    await User.findByIdAndUpdate(sesssionCheck._id, {
      $set: {
        incomingRequestsList: myRequestList.incomingRequestsList,
      },
    });

    return await getAllRequests();
  } catch (e) {
    return Response.json(
      { error: "Error in deleting incoming request" },
      { status: 500 },
    );
  }
}

export async function sendFriendRequest(data: ModifyRequestsRequestData) {
  const sesssionCheck: SessionCheckResponse = await checkSession();

  if (!sesssionCheck.ok)
    return Response.json({ error: "Not authorized" }, { status: 401 });

  const { otherUserId }: ModifyRequestsRequestData = data;

  try {
    await dbConnect();

    const myRequestList: {
      outgoingRequestsList: ObjectId[];
    } = (await User.findById(sesssionCheck._id, "outgoingRequestsList")) ?? {
      outgoingRequestsList: [],
    };
    const receivingUserRequestList: {
      incomingRequestsList: ObjectId[];
    } = (await User.findById(otherUserId, "incomingRequestsList")) ?? {
      incomingRequestsList: [],
    };

    myRequestList.outgoingRequestsList = [
      ...myRequestList.outgoingRequestsList,
      otherUserId,
    ];
    receivingUserRequestList.incomingRequestsList = [
      ...receivingUserRequestList.incomingRequestsList,
      sesssionCheck._id as ObjectId,
    ];

    await User.findByIdAndUpdate(sesssionCheck._id, {
      $set: {
        outgoingRequestsList: myRequestList.outgoingRequestsList,
      },
    });
    await User.findByIdAndUpdate(otherUserId, {
      $set: {
        incomingRequestsList: receivingUserRequestList.incomingRequestsList,
      },
    });

    return await getAllRequests();
  } catch (e) {
    return Response.json(
      { error: "Error in sending friend request" },
      { status: 500 },
    );
  }
}

export async function deleteOutgoingFriendRequest(
  data: ModifyRequestsRequestData,
) {
  const session = await getServerSession(authOptions);

  if (!session || session?.user.userStatus !== "explore")
    return Response.json({ error: "Not authorized" }, { status: 401 });

  const { otherUserId }: ModifyRequestsRequestData = data;

  try {
    await dbConnect();

    const myRequestList: { outgoingRequestsList: ObjectId[] } =
      (await User.findById(session.user._id, "outgoingRequestsList")) ?? {
        outgoingRequestsList: [],
      };
    const otherUserRequestList: { incomingRequestsList: ObjectId[] } =
      (await User.findById(otherUserId, "incomingRequestsList")) ?? {
        incomingRequestsList: [],
      };

    myRequestList.outgoingRequestsList =
      myRequestList.outgoingRequestsList.filter((d) => d != otherUserId);
    otherUserRequestList.incomingRequestsList =
      otherUserRequestList.incomingRequestsList.filter(
        (d) => d != session.user._id,
      );

    await User.findByIdAndUpdate(session.user._id, {
      $set: {
        outgoingRequestsList: myRequestList.outgoingRequestsList,
      },
    });
    await User.findByIdAndUpdate(otherUserId, {
      $set: {
        incomingRequestsList: otherUserRequestList.incomingRequestsList,
      },
    });

    return await getAllRequests();
  } catch (e) {
    return Response.json(
      { error: "Error in deleting incoming request" },
      { status: 500 },
    );
  }
}
