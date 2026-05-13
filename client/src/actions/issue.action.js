"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getApiV1Base } from "@/lib/apiBaseUrl";
import { cookieStoreToHeader } from "@/lib/cookieHeader";

export async function createIssueAction(postId, description, severity = 'MEDIUM') {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${getApiV1Base()}/admin/issues`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': cookieStoreToHeader(cookieStore)
            },
            body: JSON.stringify({ postId, description, severity })
        });
        
        const data = await res.json();
        if (data.success) {
            revalidatePath("/admin/issues");
            revalidatePath("/admin/posts");
            revalidatePath("/dashboard/posts");
            revalidatePath("/");
        }
        return data;
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export async function resolveIssueAction(issueId) {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${getApiV1Base()}/admin/issues/${issueId}/resolve`, {
            method: 'PATCH',
            headers: { 'Cookie': cookieStoreToHeader(cookieStore) }
        });
        const data = await res.json();
        revalidatePath("/admin/issues");
        return data;
    } catch (error) {
        return { success: false, message: error.message };
    }
}
