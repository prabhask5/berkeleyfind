import { User } from "@/models/User";
import testData from "@/data/testData";

export const InitiateManyTestData = async () => {
  try {
    await User.insertMany(testData);
  } catch (e) {
    throw e;
  }
};

export const InitiateSingleTestData = async () => {
  try {
    await User.create(testData);
  } catch (e) {
    throw e;
  }
};
