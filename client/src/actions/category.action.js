"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getApiV1Base } from "@/lib/apiBaseUrl";
import { cookieStoreToHeader } from "@/lib/cookieHeader";

/** Server-only: category tree for dashboard (pass to client as props). */
export async function listAdminCategoriesTreeAction() {
  const cookieStore = await cookies();
  try {
    const res = await fetch(`${getApiV1Base()}/admin/categories`, {
      headers: { Cookie: cookieStoreToHeader(cookieStore) },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json().catch(() => ({}));
    return data.data || [];
  } catch {
    return [];
  }
}

export async function createCategoryAction(formData) {
  const cookieStore = await cookies();
  try {
    const res = await fetch(`${getApiV1Base()}/admin/categories`, {
      method: "POST",
      body: formData,
      headers: { Cookie: cookieStoreToHeader(cookieStore) },
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      revalidatePath("/dashboard/categories", "page");
      return { success: true, message: "Category created" };
    }
    return { success: false, message: data.message || "Failed to create category" };
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
}

export async function deleteCategoryAction(categoryId) {
  const cookieStore = await cookies();
  try {
    const res = await fetch(`${getApiV1Base()}/admin/categories/${categoryId}`, {
      method: "DELETE",
      headers: { Cookie: cookieStoreToHeader(cookieStore) },
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      revalidatePath("/dashboard/categories", "page");
      revalidatePath("/", "layout");
      return { success: true, message: "Category deleted" };
    }
    return { success: false, message: data.message || "Failed to delete category" };
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
}

export async function updatePostStatusAction(postId, status) {
  try {
    console.log("Updating post", postId, "to", status);
    revalidatePath("/admin/posts");
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
