import { GET as getUserInfo } from "@/app/api/me/route";
import { UserType } from "@/types/UserModelTypes";
import ProfilePageLayout from "./_components/ProfilePageLayout";

export default async function Profile() {
  const res: Response = await getUserInfo();
  const success: boolean = res.status === 200;
  const data: any = await res.json();

  const user: UserType = success ? data.user : null;
  const error: string = !success ? data.error : null;

  return <ProfilePageLayout user={user} error={error} success={success} />;
}
