import {
  acceptFriendRequest,
  deleteFriend,
} from "@/actions/RequestsModifyActions";
import { serverActionToAPI } from "@/lib/utils";

export async function POST(request: Request) {
  return await serverActionToAPI(acceptFriendRequest, await request.json());
}

export async function DELETE(request: Request) {
  return await serverActionToAPI(deleteFriend, await request.json());
}
