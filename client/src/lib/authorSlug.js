/** URL slug for /author/[slug] — matches backend slugifyName */
export function authorSlugFromName(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
