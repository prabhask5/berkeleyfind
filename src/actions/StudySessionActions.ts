"use server";

import { SessionCheckResponse, checkSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { StudySession } from "@/models/StudySession";
import {
  ModifyStudySessionRequestData,
  SendStudySessionRequestData,
} from "@/types/RequestDataTypes";
import { StudySessionType } from "@/types/StudySessionModelTypes";

export async function getMyStudySessions(
  inAdminMode: boolean = false,
): Promise<string> {
  const sessionCheck: SessionCheckResponse = await checkSession(
    ["explore"],
    inAdminMode,
  );

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

  try {
    await dbConnect();

    const myStudySessions: StudySessionType[] | null =
      (await StudySession.find({
        studyPartners: sessionCheck._id,
      }).lean()) ?? [];

    return JSON.stringify({
      status: 200,
      responseData: { myStudySessions: myStudySessions ?? [] },
    });
  } catch (e) {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in fetching requests" },
    });
  }
}

export async function sendStudySessionRequest(
  dataString: string,
  inAdminMode: boolean = false,
): Promise<string> {
  const data: SendStudySessionRequestData = JSON.parse(dataString);

  const sessionCheck: SessionCheckResponse = await checkSession(
    ["explore"],
    inAdminMode,
  );

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

  const {
    studyPartners,
    coursesToStudy,
    studyTimeRange,
    libraryName,
    message,
  } = data;

  try {
    await dbConnect();

    await new StudySession({
      studyPartners,
      coursesToStudy,
      studyTimeRange,
      libraryName,
      message,
    }).save();

    return await getMyStudySessions();
  } catch (e) {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in sending study session request" },
    });
  }
}

export async function deleteStudySession(
  dataString: string,
  inAdminMode: boolean = false,
): Promise<string> {
  const data: ModifyStudySessionRequestData = JSON.parse(dataString);

  const sessionCheck: SessionCheckResponse = await checkSession(
    ["explore"],
    inAdminMode,
  );

  if (!sessionCheck.ok)
    return JSON.stringify({
      status: 401,
      responseData: { error: "Not authorized" },
    });

  const { studySessionId } = data;

  try {
    await dbConnect();

    const response: { studySession: StudySessionType | null } =
      (await StudySession.findById(studySessionId).lean()) ?? {
        studySession: null,
      };

    const { studySession } = response;

    if (!studySession) {
      throw new Error();
    }

    studySession.studyPartners = studySession.studyPartners.filter(
      (s) => s != sessionCheck._id,
    );

    if (studySession.studyPartners.length === 0) {
      await StudySession.findByIdAndDelete(studySessionId).lean();
    } else {
      await StudySession.findByIdAndUpdate(studySessionId, {
        $set: {
          studyPartners: studySession.studyPartners,
        },
      }).lean();
    }

    return await getMyStudySessions();
  } catch (e) {
    return JSON.stringify({
      status: 500,
      responseData: { error: "Error in deleting study session" },
    });
  }
}
