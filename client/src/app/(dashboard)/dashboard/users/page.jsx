import { listAdminOnlyUsersAction } from "@/actions/admin-data.action";
import UsersClient from "./UsersClient";

export const metadata = {
  title: "Administrators",
};

export default async function UsersManagementPage() {
  const admins = await listAdminOnlyUsersAction("ALL");
  
  return <UsersClient initialAdmins={admins} />;
}
