"use server";

import { checkSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import {
  GenerateUsersRequestData,
  ModifyAdminRolesRequestData,
} from "@/types/RequestDataTypes";
import { UserType } from "@/types/UserModelTypes";
import { genSalt, hash } from "bcrypt";
import berkeleyData from "@/data/berkeleydata";
import { LoremIpsum } from "lorem-ipsum";
import { sample } from "@/lib/utils";
import { Course } from "@/types/CourseModelTypes";

export async function changeRole(
  dataString: string,
  inAdminMode: boolean = false,
) {
  const data: ModifyAdminRolesRequestData = JSON.parse(dataString);

  const sessionCheck = await checkSession(undefined, true || inAdminMode);

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

  const { email, role } = data;

  try {
    await dbConnect();

    const otherUser: UserType | null = await User.findOne({
      email,
    }).lean();

    if (!otherUser)
      return JSON.stringify({
        status: 404,
        responseData: { error: "User not found" },
      });

    const newOtherUser: UserType | null = await User.findByIdAndUpdate(
      otherUser._id,
      {
        $set: { userRole: role },
      },
      { new: true },
    ).lean();

    return JSON.stringify({
      status: 200,
      responseData: { user: newOtherUser },
    });
  } catch (e) {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in changing user role." },
    });
  }
}

async function getRandomUser() {
  const response = await fetch("https://randomuser.me/api/");
  const apiUser = (await response.json()).results[0];

  const salt = await genSalt(10);
  const hashedPassword = await hash("abcdefgh123!", salt);

  let pronouns;
  if (apiUser.gender == "male") {
    pronouns = ["he/him", "they/them", "Other"][Math.floor(Math.random() * 3)];
  } else {
    pronouns = ["she/her", "they/them", "Other"][Math.floor(Math.random() * 3)];
  }

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });

  const newUserJson = {
    email: apiUser.email,
    password: hashedPassword,
    profileImage: apiUser.picture.medium,
    major: sample(berkeleyData.majors, 1)[0].major,
    gradYear: (Math.random() * (2101 - 2000) + 2000).toString(),
    firstName: apiUser.name.first,
    lastName: apiUser.name.last,
    userBio: lorem.generateWords(150),
    pronouns,
    fbURL: "https://www.facebook.com/ConvergentatBerk/",
    igURL: "https://www.instagram.com/thewanderingwidower/",
    courseList: sample(berkeleyData.courseList as Course[], 10),
    userStudyPreferences: { weekTimes: sample(berkeleyData.studyTimes, 60) },
    friendsList: [],
    incomingRequestsList: [],
    outgoingRequestsList: [],
    userStatus: "explore",
    userRole: "user",
  };

  await dbConnect();

  return await new User(newUserJson).save();
}

export async function generateRandomUsers(
  dataString: string,
  inAdminMode: boolean = false,
) {
  const { numUsers }: GenerateUsersRequestData = JSON.parse(dataString);

  const sessionCheck = await checkSession(undefined, true || inAdminMode);

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

  try {
    for (let i = 0; i < numUsers; i++) await getRandomUser();
  } catch (e) {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in generating users." },
    });
  }

  return JSON.stringify({
    status: 200,
    responseData: { message: "Users successfully generated." },
  });
}
