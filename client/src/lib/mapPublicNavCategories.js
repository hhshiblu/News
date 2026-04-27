/**
 * Public nav + footer: top-level categories with child slugs from the API.
 * @param {Array} allCategories - raw list from GET /public/categories
 */
export function mapPublicNavCategories(allCategories) {
  const list = Array.isArray(allCategories) ? allCategories : [];
  const isRoot = (parentId) => parentId === null || parentId === undefined || parentId === "";
  return list
    .filter((c) => isRoot(c.parentId))
    .map((c) => ({
      name: c.name,
      label: c.name,
      slug: c.slug,
      children: (c.children || []).map((child) => ({
        name: child.name,
        label: child.name,
        slug: child.slug,
      })),
    }));
}
