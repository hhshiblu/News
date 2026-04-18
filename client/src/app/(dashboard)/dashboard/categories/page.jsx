import CategoriesManagementClient from "@/components/dashboard/categories/CategoriesManagementClient";
import { listAdminCategoriesTreeAction } from "@/actions/category.action";

export default async function CategoriesPage() {
  const categories = await listAdminCategoriesTreeAction();

  return <CategoriesManagementClient initialCategories={categories} />;
}
