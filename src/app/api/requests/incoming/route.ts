import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ModifyRequestsRequestData } from "@/types/RequestDataTypes";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { User } from "@/models/User";
import { GET as GetAllRequests } from "../route";

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session?.user.userStatus !== "explore")
    return Response.json({ error: "Not authorized" }, { status: 401 });

  const { otherUserId }: ModifyRequestsRequestData = await request.json();

  try {
    await dbConnect();

    const myRequestList: { incomingRequestsList: ObjectId[] } =
      (await User.findById(session.user._id, "incomingRequestsList")) ?? {
        incomingRequestsList: [],
      };
    const otherUserRequestList: { outgoingRequestsList: ObjectId[] } =
      (await User.findById(otherUserId, "outgoingRequestsList")) ?? {
        outgoingRequestsList: [],
      };

    myRequestList.incomingRequestsList =
      myRequestList.incomingRequestsList.filter((d) => d != otherUserId);
    otherUserRequestList.outgoingRequestsList =
      otherUserRequestList.outgoingRequestsList.filter(
        (d) => d != session.user._id,
      );

    await User.findByIdAndUpdate(session.user._id, {
      $set: {
        incomingRequestsList: myRequestList.incomingRequestsList,
      },
    });
    await User.findByIdAndUpdate(otherUserId, {
      $set: {
        outgoingRequestsList: otherUserRequestList.outgoingRequestsList,
      },
    });

    return await GetAllRequests();
  } catch (e) {
    return Response.json(
      { error: "Error in deleting incoming request" },
      { status: 500 },
    );
  }
}
