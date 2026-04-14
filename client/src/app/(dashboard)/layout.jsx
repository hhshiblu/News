import DashboardShell from "@/components/DashboardShell";
import { getMe } from "@/lib/server-auth";

export default async function AdminLayout({ children }) {
  const user = await getMe();

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
