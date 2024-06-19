"use server";

import { SessionCheckResponse, checkSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Course } from "@/types/CourseModelTypes";
import { UserBasicInfoType, UserType } from "@/types/UserModelTypes";
import { StudyPreferences } from "@/types/UserPreferenceModelTypes";

export async function getUserCompleteInfo(
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

    const user: UserType | null = await User.findById(sessionCheck._id).lean();

    if (!user)
      return JSON.stringify({
        status: 404,
        responseData: { error: "User not found" },
      });

    return JSON.stringify({ status: 200, responseData: { user } });
  } catch (e) {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in fetching user" },
    });
  }
}

export async function getUserBasicInfo(
  inAdminMode: boolean = false,
): Promise<string> {
  const sessionCheck: SessionCheckResponse = await checkSession(
    ["explore", "startprofile"],
    inAdminMode,
  );

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

  try {
    await dbConnect();

    const user: UserBasicInfoType | null = await User.findById(
      sessionCheck._id,
      "email profileImage profileImagePublicID firstName lastName major gradYear userBio pronouns fbURL igURL userStatus",
    ).lean();

    if (!user)
      return JSON.stringify({
        status: 404,
        responseData: { error: "User not found" },
      });

    return JSON.stringify({ status: 200, responseData: { user } });
  } catch (e) {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in fetching user" },
    });
  }
}

export async function getUserCourseInfo(
  inAdminMode: boolean = false,
): Promise<string> {
  const sessionCheck: SessionCheckResponse = await checkSession(
    ["startcourses"],
    inAdminMode,
  );

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

  try {
    await dbConnect();

    const courseList: Course[] | null = await User.findById(
      sessionCheck._id,
      "courseList",
    ).lean();

    if (!courseList)
      return JSON.stringify({
        status: 404,
        responseData: { error: "Course list not found" },
      });

    return JSON.stringify({ status: 200, responseData: { courseList } });
  } catch (e) {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in fetching course list" },
    });
  }
}

export async function getUserStudyPreferences(
  inAdminMode: boolean = false,
): Promise<string> {
  const sessionCheck: SessionCheckResponse = await checkSession(
    ["startstudypref"],
    inAdminMode,
  );

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

  try {
    await dbConnect();

    const userStudyPreferences: StudyPreferences | null = await User.findById(
      sessionCheck._id,
      "userStudyPreferences",
    ).lean();

    if (!userStudyPreferences)
      return JSON.stringify({
        status: 404,
        responseData: { error: "User study preferences not found" },
      });

    return JSON.stringify({
      status: 200,
      responseData: { userStudyPreferences },
    });
  } catch (e) {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in fetching user study preferences" },
    });
  }
}
