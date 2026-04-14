"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function createIssueAction(postId, description, severity = 'MEDIUM') {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${BACKEND_URL}/admin/issues`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': cookieStore.toString()
            },
            body: JSON.stringify({ postId, description, severity })
        });
        
        const data = await res.json();
        if (data.success) {
            revalidatePath("/admin/issues");
            revalidatePath("/admin/posts");
        }
        return data;
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export async function resolveIssueAction(issueId) {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${BACKEND_URL}/admin/issues/${issueId}/resolve`, {
            method: 'PATCH',
            headers: { 'Cookie': cookieStore.toString() }
        });
        const data = await res.json();
        revalidatePath("/admin/issues");
        return data;
    } catch (error) {
        return { success: false, message: error.message };
    }
}
