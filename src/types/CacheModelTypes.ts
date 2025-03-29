import { Session } from "next-auth";
import { ExploreUserType } from "./UserModelTypes";
import { Library } from "./StudySessionModelTypes";

export interface UserCacheResponse {
  sessionUserInfo: Session["user"] | null;
  exploreFeed: ExploreUserType[] | null;
}

export interface LibraryCacheResponse {
  library: Library;
}
