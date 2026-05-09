import ReportersManagementClient from "@/components/dashboard/reporters/ReportersManagementClient";
import { listAdminReportersAction } from "@/actions/admin-data.action";

export default async function ReportersManagementPage({ searchParams }) {
  const sp = await searchParams;
  const raw = (sp?.status || "ALL").toString().toUpperCase();
  const allowed = ["ALL", "ACTIVE", "PENDING", "BLOCKED"];
  const statusFilter = allowed.includes(raw) ? raw : "ALL";
  const reporters = await listAdminReportersAction(statusFilter);

  return <ReportersManagementClient initialReporters={reporters} statusFilter={statusFilter} />;
}
