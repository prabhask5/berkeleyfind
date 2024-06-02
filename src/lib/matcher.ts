import { StrangerUserType, UserType } from "@/types/UserModelTypes";

export interface ProfileMatchMyData {
  major: UserType["major"];
  pronouns: UserType["pronouns"];
  courseList: UserType["courseList"];
  userStudyPreferences: UserType["userStudyPreferences"];
  friendsList: UserType["friendsList"];
  outgoingRequestsList: UserType["outgoingRequestsList"];
  incomingRequestsList: UserType["incomingRequestsList"];
}

export const profileMatch = (
  me: ProfileMatchMyData,
  other: StrangerUserType,
) => {
  const [classMatchMin, classMatchMax, scheduleMatchMin, scheduleMatchMax] = [
    15, 45, 5, 35,
  ];

  let classMatchPercent: number;

  if (me.courseList.length === 1) {
    classMatchPercent = other.courseList
      .map((c) => c.courseAbrName)
      .includes(me.courseList[0].courseAbrName)
      ? classMatchMax
      : 0;
  } else {
    const [classMatchA, classMatchB] = findAlgorithmFunction(
      classMatchMin,
      classMatchMax,
      me.courseList.length,
    );

    const classMatchX = me.courseList
      .map((c) =>
        other.courseList.map((c) => c.courseAbrName).includes(c.courseAbrName),
      )
      .filter((c) => c).length;

    classMatchPercent =
      classMatchX === 0
        ? 0
        : classMatchA + classMatchB / (1.0 * Math.pow(classMatchX, 0.1));
  }

  let scheduleMatchPercent: number;

  if (me.userStudyPreferences.weekTimes.length == 1) {
    scheduleMatchPercent = other.userStudyPreferences.weekTimes.includes(
      me.userStudyPreferences.weekTimes[0],
    )
      ? scheduleMatchMax
      : 0;
  } else {
    const [scheduleMatchA, scheduleMatchB] = findAlgorithmFunction(
      scheduleMatchMin,
      scheduleMatchMax,
      me.userStudyPreferences.weekTimes.length,
    );

    const scheduleMatchX = me.userStudyPreferences.weekTimes
      .map((t) => other.userStudyPreferences.weekTimes.includes(t))
      .filter((t) => t).length;

    scheduleMatchPercent =
      scheduleMatchX === 0
        ? 0
        : scheduleMatchA +
          scheduleMatchB / (1.0 * Math.pow(scheduleMatchX, 0.1));
  }

  const majorMatchPercent = me.major === other.major ? 12.5 : 0;
  const pronounsMatchPercent = me.pronouns === other.pronouns ? 7.5 : 0;

  if (classMatchPercent == 0) {
    return majorMatchPercent / 3.0;
  } else {
    return (
      classMatchPercent +
      majorMatchPercent +
      scheduleMatchPercent +
      pronounsMatchPercent
    );
  }
};

const findAlgorithmFunction = (alpha: number, beta: number, gamma: number) => {
  const a = alpha - (beta - alpha) / (1 / Math.pow(gamma, 0.1) - 1);
  const b = (beta - alpha) / (1 / Math.pow(gamma, 0.1) - 1);
  return [a, b];
};
