"use server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

/**
 * Fetches the public news feed with various filters
 * @param {Object} filters - { categoryId, parentCategorySlug, tagSlug, tagSlugs, featured, isOpinion, page, limit, ... }
 */
export async function getNewsFeed(filters = {}) {
    try {
        const queryParams = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value);
            }
        });

        const res = await fetch(`${BACKEND_URL}/public/posts?${queryParams.toString()}`, {
            next: { revalidate: 60 } // Revalidate every minute
        });

        if (!res.ok) {
            throw new Error("Failed to fetch news feed");
        }

        return await res.json();
    } catch (error) {
        console.error("Public Feed Fetch Error:", error);
        return { success: false, posts: [], totalPages: 0 };
    }
}

/**
 * Fetches a single post by its slug
 */
export async function getPostDetail(slug) {
    try {
        const res = await fetch(`${BACKEND_URL}/public/posts/${slug}`, {
            next: { revalidate: 30 }
        });

        if (!res.ok) {
            throw new Error("Post not found");
        }

        return await res.json();
    } catch (error) {
        console.error("Post Detail Fetch Error:", error);
        return { success: false, message: error.message };
    }
}
/**
 * Fetches all public categories
 */
export async function getCategories() {
    try {
        const res = await fetch(`${BACKEND_URL}/public/categories`, {
            next: { revalidate: 3600 } // Revalidate every hour
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        return await res.json();
    } catch (error) {
        console.error("Categories Fetch Error:", error);
        return { success: false, data: [] };
    }
}

/** Author profile + published posts (paginated via page & limit) */
export async function getAuthorBySlug(slug, { page = 1, limit = 12 } = {}) {
    try {
        const enc = encodeURIComponent(slug);
        const qs = new URLSearchParams();
        if (page != null) qs.set("page", String(page));
        if (limit != null) qs.set("limit", String(limit));
        const q = qs.toString();
        const res = await fetch(`${BACKEND_URL}/public/authors/${enc}${q ? `?${q}` : ""}`, {
            cache: "no-store",
        });
        if (!res.ok) {
            return { success: false, data: null };
        }
        return await res.json();
    } catch (error) {
        console.error("Author Fetch Error:", error);
        return { success: false, data: null };
    }
}
