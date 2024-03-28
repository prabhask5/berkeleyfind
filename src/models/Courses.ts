import mongoose from "mongoose";

export const CourseSchema = new mongoose.Schema({
  courseAbrName: {
    type: String,
    required: true,
  },
  courseLongName: {
    type: String,
    required: true,
  },
});
