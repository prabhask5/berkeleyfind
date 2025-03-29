import {
  deleteStudySession,
  getMyStudySessions,
  sendStudySessionRequest,
} from "@/actions/StudySessionActions";
import { serverActionToAPI } from "@/lib/utils";

export async function GET() {
  return await serverActionToAPI(getMyStudySessions);
}

export async function POST(request: Request) {
  return await serverActionToAPI(sendStudySessionRequest, await request.json());
}

export async function DELETE(request: Request) {
  return await serverActionToAPI(deleteStudySession, await request.json());
}
