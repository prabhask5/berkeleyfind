import { generateRandomUsers } from "@/actions/AdminActions";
import { serverActionToAPI } from "@/lib/utils";

export async function POST(request: Request) {
  return await serverActionToAPI(generateRandomUsers, await request.json());
}
