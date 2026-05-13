"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getApiV1Base } from "@/lib/apiBaseUrl";
import { cookieStoreToHeader } from "@/lib/cookieHeader";

export async function getDashboardStats() {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${getApiV1Base()}/admin/posts?limit=1`, {
            cache: 'no-store',
            headers: { Cookie: cookieStoreToHeader(cookieStore) },
        });
        const data = await res.json();
        return { success: true, total: data.total || 0 };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function createPost(formData) {
    // Logic for creating post via server action
    // Note: Revalidate paths after mutation
    revalidatePath("/admin/posts");
    revalidatePath("/");
}

export async function updatePostStatus(postId, status) {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${getApiV1Base()}/admin/posts/${postId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieStoreToHeader(cookieStore),
            },
            body: JSON.stringify({ status })
        });
        revalidatePath("/admin/posts");
        return await res.json();
    } catch (error) {
        return { success: false, error: error.message };
    }
}
