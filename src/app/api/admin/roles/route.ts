import { changeRole } from "@/actions/AdminActions";
import { serverActionToAPI } from "@/lib/utils";

export async function POST(request: Request) {
  return await serverActionToAPI(changeRole, await request.json());
}
