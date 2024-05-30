"use server";

import { v2 as cloudinary } from "cloudinary";
import { getUserBasicInfo } from "./UserInfoGetActions";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import {
  POSTCoursesRequestData,
  POSTMyBasicInfoRequestData,
  POSTStudyPrefRequestData,
} from "@/types/RequestDataTypes";
import { UserBasicInfoType } from "@/types/UserModelTypes";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function saveUserBasicInfo(data: POSTMyBasicInfoRequestData) {
  const {
    email,
    profileImageFile,
    firstName,
    lastName,
    major,
    gradYear,
    userBio,
    pronouns,
    fbURL,
    igURL,
  }: POSTMyBasicInfoRequestData = data;

  try {
    const getOldUserResponse: Response = await getUserBasicInfo();
    if (getOldUserResponse.status >= 400) {
      if (getOldUserResponse.status === 500)
        return Response.json(
          { error: "Error in fetching old user." },
          { status: 500 },
        );
      else if (getOldUserResponse.status === 404)
        return Response.json({ error: "User not found." }, { status: 404 });
      return getOldUserResponse;
    }

    const { user: oldUser }: { user: UserBasicInfoType } =
      await getOldUserResponse.json();

    const updateData: any = {};

    if (profileImageFile && profileImageFile !== oldUser.profileImage) {
      if (oldUser.profileImagePublicID)
        await cloudinary.uploader.destroy(oldUser.profileImagePublicID);

      const imageResponse: { secure_url: string; public_id: string } =
        await cloudinary.uploader
          .upload(profileImageFile, { folder: "berkeleyfind" })
          .catch((error) => {
            console.log(error);
            throw error;
          });

      updateData.profileImage = imageResponse.secure_url;
      updateData.profileImagePublicID = imageResponse.public_id;
    } else {
      if (oldUser.profileImage) updateData.profileImage = null;
      if (oldUser.profileImagePublicID) updateData.profileImagePublicID = null;
    }

    if (email !== oldUser.email) updateData.email = email;
    if (firstName !== oldUser.firstName) updateData.firstName = firstName;
    if (lastName !== oldUser.lastName) updateData.lastName = lastName;
    if (major !== oldUser.major) updateData.major = major;
    if (gradYear !== oldUser.gradYear) updateData.gradYear = gradYear;
    if (userBio !== oldUser.userBio) updateData.userBio = userBio;
    if (pronouns !== oldUser.pronouns) updateData.pronouns = pronouns;
    if (fbURL !== oldUser.fbURL) updateData.fbURL = fbURL;
    if (igURL !== oldUser.igURL) updateData.igURL = igURL;
    if (oldUser.userStatus === "startprofile")
      updateData.userStatus = "startcourses";

    await dbConnect();

    await User.findByIdAndUpdate(oldUser._id, {
      $set: updateData,
    });

    return Response.json(
      { profileImage: updateData.profileImage ?? oldUser.profileImage },
      { status: 200 },
    );
  } catch (e) {
    return Response.json(
      { error: "Error in modifying user basic info." },
      { status: 500 },
    );
  }
}

export async function saveUserCourseInfo(data: POSTCoursesRequestData) {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session?.user?.userStatus !== "startcourses" &&
      session?.user?.userStatus !== "explore")
  )
    return Response.json({ error: "Not authorized" }, { status: 401 });

  const { courseList }: POSTCoursesRequestData = data;

  try {
    const updateData: any = { courseList };
    if (session.user.userStatus === "startcourses")
      updateData.userStatus = "startstudypref";

    await dbConnect();

    await User.findByIdAndUpdate(session.user._id, {
      $set: updateData,
    });

    return Response.json({ courseList }, { status: 200 });
  } catch (e) {
    return Response.json(
      { error: "Error in modifying user course list" },
      { status: 500 },
    );
  }
}

export async function saveUserStudyPreferences(data: POSTStudyPrefRequestData) {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session?.user?.userStatus !== "startstudypref" &&
      session?.user?.userStatus !== "explore")
  )
    return Response.json({ error: "Not authorized" }, { status: 401 });

  const { userStudyPreferences }: POSTStudyPrefRequestData = data;

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
      { status: 500 },
    );
  }
}
