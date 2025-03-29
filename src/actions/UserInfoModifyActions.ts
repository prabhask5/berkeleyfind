"use server";

import { v2 as cloudinary } from "cloudinary";
import { getUserBasicInfo } from "./UserInfoGetActions";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import {
  ActionResponse,
  POSTCoursesRequestData,
  POSTMyBasicInfoRequestData,
  POSTStudyPrefRequestData,
} from "@/types/RequestDataTypes";
import { UserBasicInfoType } from "@/types/UserModelTypes";
import { SessionCheckResponse, checkSession } from "@/lib/auth";
import { destroyCachedUserInfo } from "@/lib/utils";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function saveUserBasicInfo(
  dataString: string,
  inAdminMode: boolean = false,
): Promise<string> {
  const data: POSTMyBasicInfoRequestData = JSON.parse(dataString);

  const sessionCheck: SessionCheckResponse = await checkSession(
    ["explore", "startprofile"],
    inAdminMode,
  );

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

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
    const getOldUserResponse: ActionResponse = JSON.parse(
      await getUserBasicInfo(),
    );

    if (getOldUserResponse.status >= 400) {
      if (getOldUserResponse.status === 500)
        return JSON.stringify({
          status: 500,
          responseData: { error: "Error in fetching old user." },
        });
      else if (getOldUserResponse.status === 404)
        return JSON.stringify({
          status: 404,
          responseData: { error: "User not found." },
        });
      return JSON.stringify(getOldUserResponse);
    }

    const oldUser: UserBasicInfoType = getOldUserResponse.responseData.user;

    const updateData: any = {};

    if (profileImageFile && profileImageFile !== oldUser.profileImage) {
      if (oldUser.profileImagePublicID)
        await cloudinary.uploader.destroy(oldUser.profileImagePublicID);

      const imageResponse: { secure_url: string; public_id: string } =
        await cloudinary.uploader
          .upload(profileImageFile, { folder: "berkeleyfind" })
          .catch((error) => {
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
    if (sessionCheck.userStatus === "startprofile")
      updateData.userStatus = "startcourses";

    await dbConnect();

    await User.findByIdAndUpdate(sessionCheck._id, {
      $set: updateData,
    }).lean();

    destroyCachedUserInfo(sessionCheck.email as string);

    return JSON.stringify({
      status: 200,
      responseData: {
        profileImage:
          updateData.profileImage !== undefined
            ? updateData.profileImage
            : oldUser.profileImage,
      },
    });
  } catch {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in modifying user basic info." },
    });
  }
}

export async function saveUserCourseInfo(
  dataString: string,
  inAdminMode: boolean = false,
): Promise<string> {
  const data: POSTCoursesRequestData = JSON.parse(dataString);

  const sessionCheck: SessionCheckResponse = await checkSession(
    ["explore", "startcourses"],
    inAdminMode,
  );

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

  const { courseList }: POSTCoursesRequestData = data;

  try {
    const updateData: any = { courseList };
    if (sessionCheck.userStatus === "startcourses")
      updateData.userStatus = "startstudypref";

    await dbConnect();

    await User.findByIdAndUpdate(sessionCheck._id, {
      $set: updateData,
    }).lean();

    destroyCachedUserInfo(sessionCheck.email as string);

    return JSON.stringify({ status: 200, responseData: { courseList } });
  } catch {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in modifying user course list" },
    });
  }
}

export async function saveUserStudyPreferences(
  dataString: string,
  inAdminMode: boolean = false,
): Promise<string> {
  const data: POSTStudyPrefRequestData = JSON.parse(dataString);

  const sessionCheck: SessionCheckResponse = await checkSession(
    ["explore", "startstudypref"],
    inAdminMode,
  );

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

  const { userStudyPreferences }: POSTStudyPrefRequestData = data;

  try {
    const updateData: any = { userStudyPreferences };
    if (sessionCheck.userStatus === "startstudypref")
      updateData.userStatus = "explore";

    await dbConnect();

    await User.findByIdAndUpdate(sessionCheck._id, {
      $set: updateData,
    }).lean();

    destroyCachedUserInfo(sessionCheck.email as string);

    return JSON.stringify({
      status: 200,
      responseData: { userStudyPreferences },
    });
  } catch {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in modifying user course list" },
    });
  }
}
