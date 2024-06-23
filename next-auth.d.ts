import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: ObjectId;
      userStatus:
        | "startprofile"
        | "startcourses"
        | "startstudypref"
        | "explore";
      userRole: "admin" | "user";
      email: string;
    } & DefaultSession["user"];
  }
}
