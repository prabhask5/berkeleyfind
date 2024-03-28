import mongoose from "mongoose";
import { CourseSchema } from "../models/Courses";
import { PreferenceSchema } from "../models/Preferences";
import { ObjectId } from "mongodb";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: false,
  },
  profileImagePublicID: {
    type: String,
    require: false,
  },
  major: {
    type: String,
    required: false,
  },
  gradYear: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  userBio: {
    type: String,
    required: false,
  },
  pronouns: {
    type: String,
    required: false,
  },
  fbURL: {
    type: String,
    required: false,
  },
  igURL: {
    type: String,
    required: false,
  },
  courseList: {
    type: [CourseSchema],
    required: false,
  },
  userStudyPreferences: {
    type: PreferenceSchema,
    required: false,
  },
  friendsList: {
    type: [ObjectId],
    required: false,
  },
  incomingRequestsList: {
    type: [ObjectId],
    required: false,
  },
  outgoingRequestsList: {
    type: [ObjectId],
    required: false,
  },
  userStatus: {
    type: String,
    enum: ["startprofile", "startcourses", "startstudypref", "explore"],
    default: "startprofile",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
