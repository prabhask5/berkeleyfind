import { User as NextAuthUser } from "next-auth";
import { getServerSession } from "next-auth/next";
import { compare, genSalt, hash } from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import { UserType } from "@/types/UserModelTypes";
import { ObjectId } from "mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongoDBAdapter";
import { Adapter } from "next-auth/adapters";

export interface AuthResSuccess {
  user: NextAuthUser;
  status: number;
}

export interface AuthResError {
  error: string;
  status: number;
}

type LoginFn = (
  _email: string,
  _password: string,
) => Promise<AuthResSuccess | AuthResError>;

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 2,
  },

  callbacks: {
    async session({ session }) {
      try {
        if (!session.user?.email) return session;

        await dbConnect();
        const user: UserType | null = await User.findOne({
          email: session.user?.email,
        });

        if (!user) return session;

        session.user._id = user._id;
        if (user.firstName && user.lastName)
          session.user.name = user.firstName + " " + user.lastName;
        session.user.image = user.profileImage;
        session.user.userStatus = user.userStatus;

        return session;
      } catch (error: any) {
        return session;
      }
    },
  },

  providers: [
    CredentialsProvider({
      id: "login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials?.password)
          throw new Error(
            JSON.stringify({ error: "Missing fields", code: 400 }),
          );

        const res = await login(credentials.email, credentials.password);

        if ((res as AuthResError).error)
          throw new Error(
            JSON.stringify({
              error: (res as AuthResError).error,
              code: res.status,
            }),
          );

        return (res as AuthResSuccess).user;
      },
    }),
    CredentialsProvider({
      id: "signup",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials?.password)
          throw new Error(
            JSON.stringify({ error: "Missing fields", code: 400 }),
          );

        const res = await signup(credentials.email, credentials.password);

        if ((res as AuthResError).error)
          throw new Error(
            JSON.stringify({
              error: (res as AuthResError).error,
              code: res.status,
            }),
          );

        return (res as AuthResSuccess).user;
      },
    }),
  ],
  debug: process.env.NODE_ENV !== "production",
};

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

export interface SessionCheckResponse {
  ok: boolean;
  _id?: ObjectId;
  userStatus?: "startprofile" | "startcourses" | "startstudypref" | "explore";
}

export const checkSession = async (
  allowedStatuses: UserType["userStatus"][] = ["explore"],
): Promise<SessionCheckResponse> => {
  const session = await getServerSession(authOptions);
  if (!session || !allowedStatuses.includes(session.user.userStatus))
    return new Promise((resolve, _reject) => resolve({ ok: false }));

  return new Promise((resolve, _reject) =>
    resolve({
      ok: true,
      _id: session.user._id,
      userStatus: session.user.userStatus,
    }),
  );
};
