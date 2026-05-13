import { redirect } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import { getMe } from "@/actions/me.action";

export default async function AdminLayout({ children }) {
  const user = await getMe();
  if (!user) redirect("/login");

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
