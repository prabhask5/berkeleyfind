"use server";

import { SessionCheckResponse, checkSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { ProfileMatchMyData, profileMatch } from "@/lib/matcher";
import { User } from "@/models/User";
import {
  StrangerUserType,
  StangerUserDataQuery,
  ExploreUserType,
  FriendUserDataQuery,
  FriendUserType,
} from "@/types/UserModelTypes";
import { ObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function getExploreUsers() {
  const sesssionCheck: SessionCheckResponse = await checkSession();

  if (!sesssionCheck.ok)
    return Response.json({ error: "Not authorized" }, { status: 401 });

  try {
    await dbConnect();

    const me: ProfileMatchMyData | null = await User.findById(
      sesssionCheck._id,
      "major pronouns courseList userStudyPreferences",
    );

    if (!me) return Response.json({ error: "User not found" }, { status: 404 });

    const users: StrangerUserType[] | null = await User.find(
      { _id: { $ne: sesssionCheck._id }, userStatus: "explore" },
      StangerUserDataQuery,
    );

    const sortedExploreUsers: ExploreUserType[] = (users ?? [])
      .map((user) => ({ ...user, profileMatch: profileMatch(me, user) }))
      .sort((a, b) => a.profileMatch - b.profileMatch);

    return Response.json({ users: sortedExploreUsers }, { status: 200 });
  } catch (e) {
    return Response.json({ error: "Error in fetching users" }, { status: 500 });
  }
}

export async function getAllRequests() {
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
