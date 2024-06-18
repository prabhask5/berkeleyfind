import { generateRandomUsers } from "@/app/actions/AdminActions";
import { serverActionToAPI } from "@/lib/utils";

export async function GET(request: Request) {
  return await serverActionToAPI(generateRandomUsers, await request.json());
}
