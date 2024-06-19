import { UserType } from "@/types/UserModelTypes";
import ProfilePageLayout from "./_components/ProfilePageLayout";
import { getUserCompleteInfo } from "@/actions/UserInfoGetActions";
import { ActionResponse } from "@/types/RequestDataTypes";

export default async function Profile() {
  const res: ActionResponse = JSON.parse(await getUserCompleteInfo());
  const success: boolean = res.status === 200;
  const data: any = res.responseData;

  const user: UserType = success ? data.user : null;
  const error: string = !success ? data.error : null;

  return <ProfilePageLayout user={user} error={error} success={success} />;
}
