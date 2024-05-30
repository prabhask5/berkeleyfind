"use server";

import { SessionCheckResponse, checkSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Course } from "@/types/CourseModelTypes";
import { UserBasicInfoType, UserType } from "@/types/UserModelTypes";
import { StudyPreferences } from "@/types/UserPreferenceModelTypes";

export async function getUserCompleteInfo() {
  const sesssionCheck: SessionCheckResponse = await checkSession();

  if (!sesssionCheck.ok)
    return Response.json({ error: "Not authorized" }, { status: 401 });

  try {
    await dbConnect();

    const user: UserType | null = await User.findById(sesssionCheck._id);

    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });
    return Response.json({ user }, { status: 200 });
  } catch (e) {
    return Response.json({ error: "Error in fetching user" }, { status: 500 });
  }
}

export async function getUserBasicInfo() {
  const sesssionCheck: SessionCheckResponse = await checkSession([
    "explore",
    "startprofile",
  ]);

  if (!sesssionCheck.ok)
    return Response.json({ error: "Not authorized" }, { status: 401 });

  try {
    await dbConnect();

    const user: UserBasicInfoType | null = await User.findById(
      sesssionCheck._id,
      "email profileImage profileImagePublicID firstName lastName major gradYear userBio pronouns fbURL igURL userStatus",
    );

    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });
    return Response.json({ user }, { status: 200 });
  } catch (e) {
    return Response.json({ error: "Error in fetching user" }, { status: 500 });
  }
}

export async function getUserCourseInfo() {
  const sesssionCheck: SessionCheckResponse = await checkSession([
    "startcourses",
  ]);

  if (!sesssionCheck.ok)
    return Response.json({ error: "Not authorized" }, { status: 401 });

  try {
    await dbConnect();

    const courseList: Course[] | null = await User.findById(
      sesssionCheck._id,
      "courseList",
    );

    if (!courseList)
      return Response.json({ error: "Course list not found" }, { status: 404 });
    return Response.json({ courseList }, { status: 200 });
  } catch (e) {
    return Response.json(
      { error: "Error in fetching course list" },
      { status: 500 },
    );
  }
}

export async function getUserStudyPreferences() {
  const sesssionCheck: SessionCheckResponse = await checkSession([
    "startstudypref",
  ]);

  if (!sesssionCheck.ok)
    return Response.json({ error: "Not authorized" }, { status: 401 });

  try {
    await dbConnect();

    const userStudyPreferences: StudyPreferences | null = await User.findById(
      sesssionCheck._id,
      "userStudyPreferences",
    );

    if (!userStudyPreferences)
      return Response.json(
        { error: "User study preferences not found" },
        { status: 404 },
      );
    return Response.json({ userStudyPreferences }, { status: 200 });
  } catch (e) {
    return Response.json(
      { error: "Error in fetching user study preferences" },
      { status: 500 },
    );
  }
}
