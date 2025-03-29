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

export async function getExploreUsers(
  inAdminMode: boolean = false,
): Promise<string> {
  const sessionCheck: SessionCheckResponse = await checkSession(
    ["explore"],
    inAdminMode,
  );

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

  try {
    await dbConnect();

    const me: ProfileMatchMyData | null = await User.findById(
      sessionCheck._id,
      "major pronouns courseList userStudyPreferences friendsList outgoingRequestsList incomingRequestsList",
    ).lean();

    if (!me)
      return JSON.stringify({
        status: 404,
        responseData: { error: "User not found" },
      });

    const users: StrangerUserType[] | null = await User.find(
      {
        _id: {
          $ne: sessionCheck._id,
          $nin: [
            ...me.friendsList,
            ...me.outgoingRequestsList,
            ...me.incomingRequestsList,
          ],
        },
        userStatus: "explore",
      },
      StangerUserDataQuery,
    ).lean();

    const sortedExploreUsers: ExploreUserType[] = (users ?? [])
      .map((user) => ({ ...user, profileMatch: profileMatch(me, user) }))
      .sort((a, b) => b.profileMatch - a.profileMatch);

    return JSON.stringify({
      status: 200,
      responseData: { users: sortedExploreUsers },
    });
  } catch {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in fetching users" },
    });
  }
}

export async function getAllRequests(
  inAdminMode: boolean = false,
): Promise<string> {
  const sessionCheck: SessionCheckResponse = await checkSession(
    ["explore"],
    inAdminMode,
  );

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

  try {
    await dbConnect();

    const userLists: {
      friendsList: ObjectId[];
      outgoingRequestsList: ObjectId[];
      incomingRequestsList: ObjectId[];
    } = (await User.findById(
      sessionCheck._id,
      "friendsList outgoingRequestsList incomingRequestsList",
    ).lean()) ?? {
      friendsList: [],
      outgoingRequestsList: [],
      incomingRequestsList: [],
    };

    const friendsList: FriendUserType[] =
      (await User.find(
        { _id: { $in: userLists.friendsList }, userStatus: "explore" },
        FriendUserDataQuery,
      ).lean()) ?? [];
    const outgoingRequestsList: StrangerUserType[] =
      (await User.find(
        { _id: { $in: userLists.outgoingRequestsList }, userStatus: "explore" },
        StangerUserDataQuery,
      ).lean()) ?? [];
    const incomingRequestsList: StrangerUserType[] =
      (await User.find(
        { _id: { $in: userLists.incomingRequestsList }, userStatus: "explore" },
        StangerUserDataQuery,
      ).lean()) ?? [];

    return JSON.stringify({
      status: 200,
      responseData: { friendsList, outgoingRequestsList, incomingRequestsList },
    });
  } catch {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in fetching requests" },
    });
  }
}
