import { ModifyRequestsRequestData } from "@/types/RequestDataTypes";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { User } from "@/models/User";
import { GET as GetAllRequests } from "../route";
import { SessionCheckResponse, checkSession } from "@/lib/auth";

export async function DELETE(request: Request) {
  const sesssionCheck: SessionCheckResponse = await checkSession();

  if (!sesssionCheck.ok)
    return Response.json({ error: "Not authorized" }, { status: 401 });

  const { otherUserId }: ModifyRequestsRequestData = await request.json();

  try {
    await dbConnect();

    const myRequestList: { incomingRequestsList: ObjectId[] } =
      (await User.findById(sesssionCheck._id, "incomingRequestsList")) ?? {
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
        (d) => d != sesssionCheck._id
      );

    await User.findByIdAndUpdate(sesssionCheck._id, {
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
      { status: 500 }
    );
  }
}
