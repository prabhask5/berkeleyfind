import { getUserStudyPreferences } from "@/app/actions/UserInfoGetActions";
import { saveUserStudyPreferences } from "@/app/actions/UserInfoModifyActions";
import { serverActionToAPI } from "@/lib/utils";

export async function GET() {
  return await serverActionToAPI(getUserStudyPreferences);
}

export async function POST(request: Request) {
  return await serverActionToAPI(
    saveUserStudyPreferences,
    await request.json(),
  );
}
