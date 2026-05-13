import { redirect } from "next/navigation";
import { getMe } from "@/actions/me.action";
import { getSiteConfigAction } from "@/actions/admin-data.action";
import AdminSettingsClient from "@/components/dashboard/settings/AdminSettingsClient";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await getMe();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard/account");
  const site = (await getSiteConfigAction()) || {};
  return <AdminSettingsClient initialSite={site} user={user} />;
}
