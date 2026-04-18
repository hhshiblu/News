"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace(/\/$/, "");

/** Server-only: category tree for dashboard (pass to client as props). */
export async function listAdminCategoriesTreeAction() {
  const cookieStore = await cookies();
  try {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      headers: { Cookie: cookieStore.toString() },
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
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: "POST",
      body: formData,
      headers: { Cookie: cookieStore.toString() },
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

export async function updatePostStatusAction(postId, status) {
  try {
    console.log("Updating post", postId, "to", status);
    revalidatePath("/admin/posts");
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
