import { FriendUserType, StrangerUserType } from "@/types/UserModelTypes";
import SocialPageLayout from "./_components/SocialPageLayout";
import { getAllRequests } from "@/app/actions/OtherUserInfoGetActions";
import { ActionResponse } from "@/types/RequestDataTypes";

export default async function Social() {
  const res: ActionResponse = JSON.parse(await getAllRequests());
  const success: boolean = res.status === 200;
  const data: any = res.responseData;

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
