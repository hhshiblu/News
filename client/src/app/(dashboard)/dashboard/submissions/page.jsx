import SubmissionsClient from "./SubmissionsClient";
import { getAdminSubmissionsAction } from "@/actions/admin-data.action";

export default async function SubmissionsPage() {
    const submissions = await getAdminSubmissionsAction();

    return <SubmissionsClient initialSubmissions={submissions} />;
}
