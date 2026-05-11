import PartnersClient from "./PartnersClient";
import { listPartnersAction } from "@/actions/partner.action";

export const metadata = {
  title: "Partners",
};

export default async function PartnersPage() {
  const res = await listPartnersAction();
  const initialItems = res.data || [];

  return <PartnersClient initialItems={initialItems} />;
}
