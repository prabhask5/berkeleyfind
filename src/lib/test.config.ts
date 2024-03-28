import { User } from "@/models/User";
import testData from "@/../testData";

export const InitiateManyTestData = async () => {
  try {
    await User.insertMany(testData);
    console.log("inserted many user test data!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const InitiateSingleTestData = async () => {
  try {
    await User.create(testData);
    console.log("inserted single user test data!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};
