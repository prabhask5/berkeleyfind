import { getExploreUsers } from "@/actions/OtherUserInfoGetActions";
import { serverActionToAPI } from "@/lib/utils";

export async function GET() {
  return await serverActionToAPI(getExploreUsers);
}
