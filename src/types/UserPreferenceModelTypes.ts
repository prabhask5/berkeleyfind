import { ObjectId } from "mongodb";

export interface StudyPreferences {
  _id: ObjectId;
  weekTimes: Date[];
}
