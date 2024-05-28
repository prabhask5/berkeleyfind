import { statusToURL } from "@/types/UserModelTypes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import NavBar from "../_components/Navbar";

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
    <section className="h-screen">
      <NavBar
        profilePic={session.user.image}
        email={session.user.email}
        name={session.user.name}
      />
      {children}
    </section>
  );
}
