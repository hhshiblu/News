"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updatePostStatusAction(postId, status) {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`http://localhost:5000/api/v1/admin/posts/${postId}`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': cookieStore.toString()
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
        const res = await fetch(`http://localhost:5000/api/v1/admin/posts/${postId}`, {
            method: 'DELETE'
        });
        
        if(res.ok) {
            revalidatePath("/admin/posts");
            return { success: true };
        }
        return { success: false, message: "Database rejected purge process." };
    } catch (error) {
        return { success: false, message: "Network error routing delete command." };
    }
}
