import {
  deleteOutgoingFriendRequest,
  sendFriendRequest,
} from "@/actions/FriendRequestActions";
import { serverActionToAPI } from "@/lib/utils";

export async function POST(request: Request) {
  return await serverActionToAPI(sendFriendRequest, await request.json());
}

export async function DELETE(request: Request) {
  return await serverActionToAPI(
    deleteOutgoingFriendRequest,
    await request.json(),
  );
}
