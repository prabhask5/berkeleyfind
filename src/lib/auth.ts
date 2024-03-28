import { User as NextAuthUser } from "next-auth";
import { compare, genSalt, hash } from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";

export interface AuthResSuccess {
  user: NextAuthUser;
  status: number;
}

export interface AuthResError {
  error: string;
  status: number;
}

type LoginFn = (
  email: string,
  password: string,
) => Promise<AuthResSuccess | AuthResError>;

export const login: LoginFn = async (email, password) => {
  try {
    await dbConnect();
    const foundUser = await User.findOne({ email });

    if (!foundUser) return { error: "User not found", status: 404 };
    if (!(await compare(password, foundUser.password)))
      return { error: "Incorrect password", status: 401 };

    return { user: foundUser, status: 200 };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
};

export const signup: LoginFn = async (email, password) => {
  try {
    await dbConnect();
    const foundUser = await User.findOne({ email });

    if (foundUser) return { error: "User already exists", status: 409 };

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const newUser = await new User({
      email,
      password: hashedPassword,
      userStatus: "startprofile",
    }).save();

    return { user: newUser, status: 200 };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
};
