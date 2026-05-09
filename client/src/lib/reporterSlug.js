/** URL slug for /reporter/[slug] — matches backend slugifyName */
export function reporterSlugFromName(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
