import AuthorsManagementClient from "@/components/dashboard/authors/AuthorsManagementClient";
import { listAdminAuthorsAction } from "@/actions/admin-data.action";

export default async function AuthorsManagementPage({ searchParams }) {
  const sp = await searchParams;
  const raw = (sp?.status || "ALL").toString().toUpperCase();
  const allowed = ["ALL", "ACTIVE", "PENDING", "BLOCKED"];
  const statusFilter = allowed.includes(raw) ? raw : "ALL";
  const authors = await listAdminAuthorsAction(statusFilter);

  return <AuthorsManagementClient initialAuthors={authors} statusFilter={statusFilter} />;
}
