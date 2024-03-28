import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { POSTCoursesRequestData } from "@/types/RequestDataTypes";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Course } from "@/types/CourseModelTypes";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session?.user?.userStatus !== "startcourses")
    return Response.json({ error: "Not authorized" }, { status: 401 });

  try {
    await dbConnect();

    const courseList: Course[] | null = await User.findById(
      session.user._id,
      "courseList",
    );

    if (!courseList)
      return Response.json({ error: "Course list not found" }, { status: 404 });
    return Response.json({ courseList }, { status: 200 });
  } catch (e) {
    return Response.json(
      { error: "Error in fetching course list" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session?.user?.userStatus !== "startcourses" &&
      session?.user?.userStatus !== "explore")
  )
    return Response.json({ error: "Not authorized" }, { status: 401 });

  const { courseList }: POSTCoursesRequestData = await request.json();

  try {
    const updateData: any = { courseList };
    if (session.user.userStatus === "startcourses")
      updateData.userStatus = "startstudypref";

    await dbConnect();

    await User.findByIdAndUpdate(session.user._id, {
      $set: updateData,
    });

    return Response.json({ courseList }, { status: 200 });
  } catch (e) {
    return Response.json(
      { error: "Error in modifying user course list" },
      { status: 500 },
    );
  }
}
