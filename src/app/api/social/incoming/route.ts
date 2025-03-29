import { deleteIncomingFriendRequest } from "@/actions/FriendRequestActions";
import { serverActionToAPI } from "@/lib/utils";

export async function DELETE(request: Request) {
  return await serverActionToAPI(
    deleteIncomingFriendRequest,
    await request.json(),
  );
}
