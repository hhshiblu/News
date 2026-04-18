import { getAdminSubscribersAction } from "@/actions/admin-data.action";
import SubscribersClient from "./SubscribersClient";

export default async function SubscribersPage() {
  const subscribers = await getAdminSubscribersAction();
  return <SubscribersClient initialSubscribers={subscribers} />;
}
