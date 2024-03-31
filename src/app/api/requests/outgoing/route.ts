import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ModifyRequestsRequestData } from "@/types/RequestDataTypes";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import { ObjectId } from "mongodb";
import { GET as GetAllRequests } from "../route";
import { SessionCheckResponse, checkSession } from "@/lib/auth";

export async function POST(request: Request) {
  const sesssionCheck: SessionCheckResponse = await checkSession();

  if (!sesssionCheck.ok)
    return Response.json({ error: "Not authorized" }, { status: 401 });

  const { otherUserId }: ModifyRequestsRequestData = await request.json();

  try {
    await dbConnect();

    const myRequestList: {
      outgoingRequestsList: ObjectId[];
    } = (await User.findById(sesssionCheck._id, "outgoingRequestsList")) ?? {
      outgoingRequestsList: [],
    };
    const receivingUserRequestList: {
      incomingRequestsList: ObjectId[];
    } = (await User.findById(otherUserId, "incomingRequestsList")) ?? {
      incomingRequestsList: [],
    };

    myRequestList.outgoingRequestsList = [
      ...myRequestList.outgoingRequestsList,
      otherUserId,
    ];
    receivingUserRequestList.incomingRequestsList = [
      ...receivingUserRequestList.incomingRequestsList,
      sesssionCheck._id as ObjectId,
    ];

    await User.findByIdAndUpdate(sesssionCheck._id, {
      $set: {
        outgoingRequestsList: myRequestList.outgoingRequestsList,
      },
    });
    await User.findByIdAndUpdate(otherUserId, {
      $set: {
        incomingRequestsList: receivingUserRequestList.incomingRequestsList,
      },
    });

    return await GetAllRequests();
  } catch (e) {
    return Response.json(
      { error: "Error in sending friend request" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session?.user.userStatus !== "explore")
    return Response.json({ error: "Not authorized" }, { status: 401 });

  const { otherUserId }: ModifyRequestsRequestData = await request.json();

  try {
    await dbConnect();

    const myRequestList: { outgoingRequestsList: ObjectId[] } =
      (await User.findById(session.user._id, "outgoingRequestsList")) ?? {
        outgoingRequestsList: [],
      };
    const otherUserRequestList: { incomingRequestsList: ObjectId[] } =
      (await User.findById(otherUserId, "incomingRequestsList")) ?? {
        incomingRequestsList: [],
      };

    myRequestList.outgoingRequestsList =
      myRequestList.outgoingRequestsList.filter((d) => d != otherUserId);
    otherUserRequestList.incomingRequestsList =
      otherUserRequestList.incomingRequestsList.filter(
        (d) => d != session.user._id,
      );

    await User.findByIdAndUpdate(session.user._id, {
      $set: {
        outgoingRequestsList: myRequestList.outgoingRequestsList,
      },
    });
    await User.findByIdAndUpdate(otherUserId, {
      $set: {
        incomingRequestsList: otherUserRequestList.incomingRequestsList,
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
