import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongoDBAdapter";
import { login, AuthResError, AuthResSuccess, signup } from "@/lib/auth";
import { Adapter } from "next-auth/adapters";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import type { UserType } from "@/types/UserModelTypes";

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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
