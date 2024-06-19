import { getUserCourseInfo } from "@/actions/UserInfoGetActions";
import { saveUserCourseInfo } from "@/actions/UserInfoModifyActions";
import { serverActionToAPI } from "@/lib/utils";

export async function GET() {
  return await serverActionToAPI(getUserCourseInfo);
}

export async function POST(request: Request) {
  return await serverActionToAPI(saveUserCourseInfo, await request.json());
}
