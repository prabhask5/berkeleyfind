import { ObjectId } from "mongodb";
import { Course } from "./CourseModelTypes";

export interface StudySessionType {
  _id: ObjectId;
  studyPartners: ObjectId[];
  coursesToStudy: Course[];
  studyTimeRange: Date[];
  libraryName: String;
  message: String;
}

export interface Library {
  name: String;
  hoursStart: String | null;
  hoursEnd: String | null;
}
