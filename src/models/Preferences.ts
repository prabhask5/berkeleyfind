import mongoose from "mongoose";

export const PreferenceSchema = new mongoose.Schema({
  weekTimes: {
    type: [Date],
    required: true,
  },
});
