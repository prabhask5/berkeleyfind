import { ObjectId } from "mongodb";
import { Course } from "./CourseModelTypes";
import { StudyPreferences } from "./UserPreferenceModelTypes";

export interface GETExploreRequestData {
  // first index included, last index not included
  firstIndex: number;
  lastIndex: number;
}

export interface POSTMyBasicInfoRequestData {
  email: string;
  profileImageFile: string;
  firstName: string;
  lastName: string;
  major: string;
  gradYear: string;
  userBio: string;
  pronouns: string;
  fbURL: string;
  igURL: string;
}

export interface POSTCoursesRequestData {
  courseList: Course[];
}

export interface POSTStudyPrefRequestData {
  userStudyPreferences: StudyPreferences;
}

export interface ModifyRequestsRequestData {
  otherUserId: ObjectId;
}
