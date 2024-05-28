import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CourseEditForm from "@/app/(app)/(normal-format)/profile/_components/CourseEditForm";
import { statusToURL } from "@/types/UserModelTypes";
import { Stack, Heading } from "@chakra-ui/react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function StartCourses() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login?redirect=true");
  if (session.user.userStatus && session.user.userStatus !== "startcourses")
    return redirect(statusToURL[session.user.userStatus]);

  return (
    <div className="flex w-screen lg:h-screen">
      <Stack
        direction={["column", "column", "column", "row", "row", "row"]}
        spacing={[10, 10, 10, 10, 10, 10]}
        className="w-11/12 lg:w-[97.5%] mx-auto my-[10%] lg:my-auto h-full lg:pt-5"
      >
        <Heading
          className="text-center m-auto"
          size={["lg", "xl", "xl", "xl", "xl", "2xl"]}
        >
          Next, add your current and past courses to find students who share
          your learning interests.
        </Heading>
        <div className="w-full lg:m-auto lg:h-full lg:overflow-y-auto lg:overflow-x-hidden lg:p-2">
          <CourseEditForm courseList={[]} isStart={true} />
        </div>
      </Stack>
    </div>
  );
}
