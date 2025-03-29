"use server";

import { SessionCheckResponse, checkSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import { ModifyRequestsRequestData } from "@/types/RequestDataTypes";
import { ObjectId } from "mongodb";
import { getAllRequests } from "./OtherUserInfoGetActions";

export async function acceptFriendRequest(
  dataString: string,
  inAdminMode: boolean = false,
): Promise<string> {
  const data: ModifyRequestsRequestData = JSON.parse(dataString);

  const sessionCheck: SessionCheckResponse = await checkSession(
    ["explore"],
    inAdminMode,
  );

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

  const { otherUserId }: ModifyRequestsRequestData = data;

  try {
    await dbConnect();

    const myRequestLists: {
      incomingRequestsList: ObjectId[];
      friendsList: ObjectId[];
    } = (await User.findById(
      sessionCheck._id,
      "incomingRequestsList friendsList",
    ).lean()) ?? { incomingRequestsList: [], friendsList: [] };
    const newFriendRequestLists: {
      outgoingRequestsList: ObjectId[];
      friendsList: ObjectId[];
    } = (await User.findById(
      otherUserId,
      "outgoingRequestsList friendsList",
    ).lean()) ?? { outgoingRequestsList: [], friendsList: [] };

    myRequestLists.incomingRequestsList =
      myRequestLists.incomingRequestsList.filter((d) => d != otherUserId);
    myRequestLists.friendsList = [...myRequestLists.friendsList, otherUserId];
    newFriendRequestLists.outgoingRequestsList =
      newFriendRequestLists.outgoingRequestsList.filter(
        (d) => d != sessionCheck._id,
      );
    newFriendRequestLists.friendsList = [
      ...newFriendRequestLists.friendsList,
      sessionCheck._id as ObjectId,
    ];

    await User.findByIdAndUpdate(sessionCheck._id, {
      $set: {
        incomingRequestsList: myRequestLists.incomingRequestsList,
        friendsList: myRequestLists.friendsList,
      },
    }).lean();
    await User.findByIdAndUpdate(otherUserId, {
      $set: {
        outgoingRequestsList: newFriendRequestLists.outgoingRequestsList,
        friendsList: newFriendRequestLists.friendsList,
      },
    }).lean();

    return await getAllRequests();
  } catch {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in accepting friend request" },
    });
  }
}

export async function deleteFriend(
  dataString: string,
  inAdminMode: boolean = false,
): Promise<string> {
  const data: ModifyRequestsRequestData = JSON.parse(dataString);
  const sessionCheck: SessionCheckResponse = await checkSession(
    ["explore"],
    inAdminMode,
  );

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

  const { otherUserId }: ModifyRequestsRequestData = data;

  try {
    await dbConnect();

    const myRequestList: { friendsList: ObjectId[] } = (
      await User.findById(sessionCheck._id, "friendsList")
    ).lean() ?? { friendsList: [] };
    const prevFriendRequestList: { friendsList: ObjectId[] } =
      (await User.findById(otherUserId, "friendsList").lean()) ?? {
        friendsList: [],
      };

    myRequestList.friendsList = myRequestList.friendsList.filter(
      (d) => d != otherUserId,
    );
    prevFriendRequestList.friendsList =
      prevFriendRequestList.friendsList.filter((d) => d != sessionCheck._id);

    await User.findByIdAndUpdate(sessionCheck._id, {
      $set: {
        friendsList: myRequestList.friendsList,
      },
    }).lean();
    await User.findByIdAndUpdate(otherUserId, {
      $set: {
        friendsList: prevFriendRequestList.friendsList,
      },
    }).lean();

    return await getAllRequests();
  } catch {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in deleting friend" },
    });
  }
}

export async function deleteIncomingFriendRequest(
  dataString: string,
  inAdminMode: boolean = false,
): Promise<string> {
  const data: ModifyRequestsRequestData = JSON.parse(dataString);

  const sessionCheck: SessionCheckResponse = await checkSession(
    ["explore"],
    inAdminMode,
  );

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

  const { otherUserId }: ModifyRequestsRequestData = data;

  try {
    await dbConnect();

    const myRequestList: { incomingRequestsList: ObjectId[] } =
      (await User.findById(
        sessionCheck._id,
        "incomingRequestsList",
      ).lean()) ?? {
        incomingRequestsList: [],
      };

    myRequestList.incomingRequestsList =
      myRequestList.incomingRequestsList.filter((d) => d != otherUserId);

    await User.findByIdAndUpdate(sessionCheck._id, {
      $set: {
        incomingRequestsList: myRequestList.incomingRequestsList,
      },
    }).lean();

    return await getAllRequests();
  } catch {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in deleting incoming request" },
    });
  }
}

export async function sendFriendRequest(
  dataString: string,
  inAdminMode: boolean = false,
): Promise<string> {
  const data: ModifyRequestsRequestData = JSON.parse(dataString);

  const sessionCheck: SessionCheckResponse = await checkSession(
    ["explore"],
    inAdminMode,
  );

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

  const { otherUserId }: ModifyRequestsRequestData = data;

  try {
    await dbConnect();

    const myRequestList: {
      outgoingRequestsList: ObjectId[];
    } = (await User.findById(
      sessionCheck._id,
      "outgoingRequestsList",
    ).lean()) ?? {
      outgoingRequestsList: [],
    };
    const receivingUserRequestList: {
      incomingRequestsList: ObjectId[];
    } = (await User.findById(otherUserId, "incomingRequestsList").lean()) ?? {
      incomingRequestsList: [],
    };

    myRequestList.outgoingRequestsList = [
      ...myRequestList.outgoingRequestsList,
      otherUserId,
    ];
    receivingUserRequestList.incomingRequestsList = [
      ...receivingUserRequestList.incomingRequestsList,
      sessionCheck._id as ObjectId,
    ];

    await User.findByIdAndUpdate(sessionCheck._id, {
      $set: {
        outgoingRequestsList: myRequestList.outgoingRequestsList,
      },
    }).lean();
    await User.findByIdAndUpdate(otherUserId, {
      $set: {
        incomingRequestsList: receivingUserRequestList.incomingRequestsList,
      },
    }).lean();

    return await getAllRequests();
  } catch {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in sending friend request" },
    });
  }
}

export async function deleteOutgoingFriendRequest(
  dataString: string,
  inAdminMode: boolean = false,
): Promise<string> {
  const data: ModifyRequestsRequestData = JSON.parse(dataString);

  const sessionCheck: SessionCheckResponse = await checkSession(
    ["explore"],
    inAdminMode,
  );

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

  const { otherUserId }: ModifyRequestsRequestData = data;

  try {
    await dbConnect();

    const myRequestList: { outgoingRequestsList: ObjectId[] } =
      (await User.findById(
        sessionCheck._id,
        "outgoingRequestsList",
      ).lean()) ?? {
        outgoingRequestsList: [],
      };
    const otherUserRequestList: { incomingRequestsList: ObjectId[] } =
      (await User.findById(otherUserId, "incomingRequestsList").lean()) ?? {
        incomingRequestsList: [],
      };

    myRequestList.outgoingRequestsList =
      myRequestList.outgoingRequestsList.filter((d) => d != otherUserId);
    otherUserRequestList.incomingRequestsList =
      otherUserRequestList.incomingRequestsList.filter(
        (d) => d != sessionCheck._id,
      );

    await User.findByIdAndUpdate(sessionCheck._id, {
      $set: {
        outgoingRequestsList: myRequestList.outgoingRequestsList,
      },
    }).lean();
    await User.findByIdAndUpdate(otherUserId, {
      $set: {
        incomingRequestsList: otherUserRequestList.incomingRequestsList,
      },
    }).lean();

    return await getAllRequests();
  } catch {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in deleting incoming request" },
    });
  }
}
