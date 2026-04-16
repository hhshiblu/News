import { getCategories } from "@/actions/public";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const categoriesRes = await getCategories();
  const allCategories = categoriesRes?.data || [];
  const topLevel = allCategories.filter((c) => !c.parentId).map((c) => ({
    name: c.name,
    label: c.name,
    slug: c.slug,
    children: (c.children || []).map((child) => ({
      name: child.name,
      label: child.name,
      slug: child.slug,
    })),
  }));

  return (
    <NavbarClient initialCategories={topLevel} />
  );
}
