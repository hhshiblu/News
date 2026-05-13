import { getPublicApiBase } from "./apiBaseUrl";

/**
 * Fetch public posts with filters
 */
export async function fetchPublicPosts(filters = {}) {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value);
    }
  });

  const API_BASE_URL = getPublicApiBase();

  try {
    const response = await fetch(`${API_BASE_URL}/posts?${queryParams.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return { success: false, posts: [], total: 0 };
  }
}

/**
 * Fetch posts for a parent category (including its subcategories)
 */
export async function fetchPostsByParentCategory(parentSlug, limit = 10) {
  return fetchPublicPosts({ parentCategorySlug: parentSlug, limit });
}

/**
 * Fetch posts for a specific subcategory
 */
export async function fetchPostsBySubcategory(childSlug, limit = 10) {
  return fetchPublicPosts({ categorySlug: childSlug, limit });
}

/**
 * Fetch a single post by slug
 */
export async function fetchPostBySlug(slug) {
  const API_BASE_URL = getPublicApiBase();
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return { success: false, data: null };
  }
}
