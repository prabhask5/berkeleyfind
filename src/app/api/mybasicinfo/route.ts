import { User } from "@/models/User";
import type { UserBasicInfoType } from "@/types/UserModelTypes";
import dbConnect from "@/lib/dbConnect";
import { POSTMyBasicInfoRequestData } from "@/types/RequestDataTypes";
import { v2 as cloudinary } from "cloudinary";
import { SessionCheckResponse, checkSession } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function GET() {
  const sesssionCheck: SessionCheckResponse = await checkSession([
    "explore",
    "startprofile",
  ]);

  if (!sesssionCheck.ok)
    return Response.json({ error: "Not authorized" }, { status: 401 });

  try {
    await dbConnect();

    const user: UserBasicInfoType | null = await User.findById(
      sesssionCheck._id,
      "email profileImage profileImagePublicID firstName lastName major gradYear userBio pronouns fbURL igURL userStatus",
    );

    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });
    return Response.json({ user }, { status: 200 });
  } catch (e) {
    return Response.json({ error: "Error in fetching user" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const {
    email,
    profileImageFile,
    firstName,
    lastName,
    major,
    gradYear,
    userBio,
    pronouns,
    fbURL,
    igURL,
  }: POSTMyBasicInfoRequestData = await request.json();

  try {
    const getOldUserResponse: Response = await GET();
    if (getOldUserResponse.status >= 400) {
      if (getOldUserResponse.status === 500)
        return Response.json(
          { error: "Error in fetching old user." },
          { status: 500 },
        );
      else if (getOldUserResponse.status === 404)
        return Response.json({ error: "User not found." }, { status: 404 });
      return getOldUserResponse;
    }

    const { user: oldUser }: { user: UserBasicInfoType } =
      await getOldUserResponse.json();

    const updateData: any = {};

    if (oldUser.profileImagePublicID)
      await cloudinary.uploader.destroy(oldUser.profileImagePublicID);

    if (profileImageFile) {
      const imageResponse: { secure_url: string; public_id: string } =
        await cloudinary.uploader
          .upload(profileImageFile, { folder: "berkeleyfind" })
          .catch((error) => {
            console.log(error);
            throw error;
          });

      updateData.profileImage = imageResponse.secure_url;
      updateData.profileImagePublicID = imageResponse.public_id;
    } else {
      if (oldUser.profileImage) updateData.profileImage = null;
      if (oldUser.profileImagePublicID) updateData.profileImagePublicID = null;
    }

    if (email !== oldUser.email) updateData.email = email;
    if (firstName !== oldUser.firstName) updateData.firstName = firstName;
    if (lastName !== oldUser.lastName) updateData.lastName = lastName;
    if (major !== oldUser.major) updateData.major = major;
    if (gradYear !== oldUser.gradYear) updateData.gradYear = gradYear;
    if (userBio !== oldUser.userBio) updateData.userBio = userBio;
    if (pronouns !== oldUser.pronouns) updateData.pronouns = pronouns;
    if (fbURL !== oldUser.fbURL) updateData.fbURL = fbURL;
    if (igURL !== oldUser.igURL) updateData.igURL = igURL;
    if (oldUser.userStatus === "startprofile")
      updateData.userStatus = "startcourses";

    await dbConnect();

    await User.findByIdAndUpdate(oldUser._id, {
      $set: updateData,
    });

    return Response.json(
      { profileImage: updateData.profileImage ?? oldUser.profileImage },
      { status: 200 },
    );
  } catch (e) {
    return Response.json(
      { error: "Error in modifying user basic info." },
      { status: 500 },
    );
  }
}
