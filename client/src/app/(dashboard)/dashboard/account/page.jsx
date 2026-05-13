import { redirect } from "next/navigation";
import { getMe } from "@/actions/me.action";
import AccountProfileClient from "@/components/dashboard/account/AccountProfileClient";

export const metadata = { title: "My account" };

export default async function AccountPage() {
  const user = await getMe();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/dashboard/settings");
  return <AccountProfileClient initialUser={user} />;
}
