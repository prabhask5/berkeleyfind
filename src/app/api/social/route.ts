import { getAllRequests } from "@/app/actions/OtherUserInfoGetActions";
import { serverActionToAPI } from "@/lib/utils";

export async function GET() {
  return await serverActionToAPI(getAllRequests);
}
