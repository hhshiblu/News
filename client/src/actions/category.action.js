"use server";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(formData) {
    const name = formData.get("name");
    const rawFormData = {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      parentId: formData.get("parentId") || null,
      imageUrl: formData.get("imageUrl") || null,
    };
    
    try {
        const res = await fetch('http://localhost:5000/api/v1/admin/categories', {
           method: 'POST', 
           body: JSON.stringify(rawFormData), 
           headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await res.json();
        
        if (res.ok && data.success) {
            revalidatePath("/admin/categories");
            return { success: true, message: "Category created dynamically!" };
        } else {
            return { success: false, message: data.message || "Database validation failed" };
        }
    } catch (error) {
        return { success: false, message: "Network connection refused." };
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
