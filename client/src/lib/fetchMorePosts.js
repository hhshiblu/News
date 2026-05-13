/**
 * Client-side fetch helper for the "Load More" / "See More" button.
 * Called from client components — NOT a server action.
 *
 * @param {Object}  opts
 * @param {string}  opts.endpoint        – e.g. "/public/posts"
 * @param {Object}  opts.params          – query params (categorySlug, parentCategorySlug, tagSlug …)
 * @param {number}  opts.page            – next page number to fetch
 * @param {number} [opts.limit=10]       – items per batch
 * @param {number} [opts.offset]         – skip N items before paginating
 * @returns {Promise<{posts: Array, totalPages: number, total: number}>}
 */
export async function fetchMorePosts({
  endpoint = "/public/posts",
  params = {},
  page = 1,
  limit = 10,
  offset,
}) {
  try {
    if (typeof window === "undefined") {
      return { posts: [], totalPages: 0, total: 0 };
    }
    const base = `${window.location.origin}/api/v1`;
    const url = new URL(`${base}${endpoint}`);

    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    });

    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));
    if (offset != null) url.searchParams.set("offset", String(offset));

    const res = await fetch(url.toString(), { cache: "no-store" });

    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    return await res.json();
  } catch (err) {
    console.error("fetchMorePosts error:", err);
    return { posts: [], totalPages: 0, total: 0 };
  }
}
