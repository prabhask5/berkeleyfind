import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { CourseSchema } from "./Courses";

const StudySessionSchema = new mongoose.Schema({
  studyPartners: {
    type: [ObjectId],
    required: true,
  },
  coursesToStudy: {
    type: [CourseSchema],
    required: true,
  },
  studyTimeRange: {
    type: [Date],
    required: true,
  },
  libraryName: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: false,
  },
});

export const StudySession =
  mongoose.models.StudySession ||
  mongoose.model("StudySession", StudySessionSchema);
