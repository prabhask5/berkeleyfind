import { getUserCompleteInfo } from "@/app/actions/UserInfoGetActions";
import { serverActionToAPI } from "@/lib/utils";

export async function GET() {
  return await serverActionToAPI(getUserCompleteInfo);
}
