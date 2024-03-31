import { Course } from "./CourseModelTypes";
import { StudyPreferences } from "./UserPreferenceModelTypes";
import { ObjectId } from "mongoose";

export const statusToURL = {
  startprofile: "/start/profile",
  startcourses: "/start/courses",
  startstudypref: "/start/studytimes",
  explore: "/explore",
};

export interface UserType {
  _id: ObjectId;
  email: string;
  password: string;
  profileImage: string;
  profileImagePublicID: string;
  major: string;
  gradYear: string;
  firstName: string;
  lastName: string;
  userBio: string;
  pronouns: string;
  fbURL: string;
  igURL: string;
  courseList: Course[];
  userStudyPreferences: StudyPreferences;
  friendsList: ObjectId[];
  incomingRequestsList: ObjectId[];
  outgoingRequestsList: ObjectId[];
  userStatus: "startprofile" | "startcourses" | "startstudypref" | "explore";
  createdAt: Date;
}

export interface UserBasicInfoType {
  _id: ObjectId;
  email: string;
  profileImage: string;
  profileImagePublicID: string;
  firstName: string;
  lastName: string;
  major: string;
  gradYear: string;
  userBio: string;
  pronouns: string;
  fbURL: string;
  igURL: string;
  userStatus: "startprofile" | "startcourses" | "startstudypref" | "explore";
}

export interface StrangerUserType {
  _id: ObjectId;
  profileImage: string;
  major: string;
  gradYear: string;
  firstName: string;
  lastName: string;
  userBio: string;
  pronouns: string;
  courseList: Course[];
  userStudyPreferences: StudyPreferences;
}

export interface FriendUserType extends StrangerUserType {
  fbURL: string;
  igURL: string;
  email: string;
}

export interface ExploreUserType extends StrangerUserType {
  profileMatch: number;
}

export const StangerUserDataQuery: string =
  "_id profileImage major gradYear firstName lastName userBio pronouns courseList userStudyPreferences";

export const FriendUserDataQuery: string =
  StangerUserDataQuery + " fbURL igURL email";
