"use server";

import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function getDashboardStats() {
    try {
        const res = await fetch(`${BACKEND_URL}/admin/posts?limit=1`, { cache: 'no-store' });
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
        const res = await fetch(`${BACKEND_URL}/admin/posts/${postId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        revalidatePath("/admin/posts");
        return await res.json();
    } catch (error) {
        return { success: false, error: error.message };
    }
}
