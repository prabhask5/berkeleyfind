import { statusToURL } from "@/types/UserModelTypes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import ResponsiveNavBar from "../_components/ResponsiveNavbar";

export default async function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login?redirect=true");
  if (session.user.userStatus && session.user.userStatus !== "explore")
    return redirect(statusToURL[session.user.userStatus]);

  return (
    <section className="w-screen h-screen">
      <ResponsiveNavBar
        profilePic={session.user.image}
        email={session.user.email}
        name={session.user.name}
      />
      <div className="w-full h-[calc(100%_-_80px)] overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </section>
  );
}
