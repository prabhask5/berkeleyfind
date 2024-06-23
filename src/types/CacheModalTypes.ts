import { Session } from "next-auth";
import { ExploreUserType } from "./UserModelTypes";

export interface UserCacheResponse {
  sessionUserInfo: Session["user"] | null;
  exploreFeed: ExploreUserType[] | null;
}
