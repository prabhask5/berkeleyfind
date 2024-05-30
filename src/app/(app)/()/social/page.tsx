import { GET as getAllRequests } from "@/app/api/social/route";
import { FriendUserType, StrangerUserType } from "@/types/UserModelTypes";
import SocialPageLayout from "./_components/SocialPageLayout";

export default async function Social() {
  const res: Response = await getAllRequests();
  const success: boolean = res.status === 200;
  const data: any = await res.json();

  const friendsList: FriendUserType[] = success ? data.friendsList : null;
  const outgoingRequestsList: StrangerUserType[] = success
    ? data.outgoingRequestsList
    : null;
  const incomingRequestsList: StrangerUserType[] = success
    ? data.incomingRequestsList
    : null;
  const error: string = !success ? data.error : null;

  return (
    <SocialPageLayout
      friendsList={friendsList}
      outgoingRequestsList={outgoingRequestsList}
      incomingRequestsList={incomingRequestsList}
      error={error}
      success={success}
    />
  );
}
