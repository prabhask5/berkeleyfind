import { fetchLibraryInfo } from "@/actions/ParseLibraryInfoActions";
import { serverActionToAPI } from "@/lib/utils";

export async function GET() {
  return await serverActionToAPI(fetchLibraryInfo);
}
