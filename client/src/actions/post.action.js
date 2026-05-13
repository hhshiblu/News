"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getApiV1Base } from "@/lib/apiBaseUrl";
import { cookieStoreToHeader } from "@/lib/cookieHeader";

export async function updatePostStatusAction(postId, status) {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${getApiV1Base()}/admin/posts/${postId}`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': cookieStoreToHeader(cookieStore)
            },
            credentials: 'include'
        });
        
        if(res.ok) {
            revalidatePath("/dashboard/posts");
            revalidatePath("/");
            return { success: true };
        }
        return { success: false, message: "Backend refused status override." };
    } catch (error) {
        return { success: false, message: "Network error pushing status." };
    }
}

export async function deletePostAction(postId) {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${getApiV1Base()}/admin/posts/${postId}`, {
            method: 'DELETE',
            headers: { 'Cookie': cookieStoreToHeader(cookieStore) }
        });
        
        if(res.ok) {
            revalidatePath("/admin/posts");
            revalidatePath("/dashboard/posts");
            revalidatePath("/");
            return { success: true };
        }
        return { success: false, message: "Database rejected purge process." };
    } catch (error) {
        return { success: false, message: "Network error routing delete command." };
    }
}
