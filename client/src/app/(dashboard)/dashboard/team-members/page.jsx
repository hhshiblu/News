import TeamMembersClient from "./TeamMembersClient";
import { listTeamMembersAction } from "@/actions/team-member.action";
import { listDepartmentsAction } from "@/actions/department.action";

export const metadata = {
  title: "Team Members",
};

export default async function TeamMembersPage() {
  const itemsRes = await listTeamMembersAction();
  const deptsRes = await listDepartmentsAction();

  const initialItems = itemsRes.data || [];
  const initialDepartments = deptsRes.data || [];

  return (
    <TeamMembersClient
      initialItems={initialItems}
      initialDepartments={initialDepartments}
    />
  );
}
