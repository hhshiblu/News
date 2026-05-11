import DepartmentsClient from "./DepartmentsClient";
import { listDepartmentsAction } from "@/actions/department.action";

export const metadata = {
  title: "Departments",
};

export default async function DepartmentsPage() {
  const res = await listDepartmentsAction();
  const initialItems = res.data || [];

  return <DepartmentsClient initialItems={initialItems} />;
}
