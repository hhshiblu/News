/** Build “lanes” of latest stories per category (for desks / author pages). */
export function buildCategoryLanes(posts, maxLanes = 4, perLane = 5) {
  const map = new Map();
  for (const p of posts) {
    const raw = p.category;
    const name =
      typeof raw === "object" && raw?.name ? raw.name : typeof raw === "string" ? raw : "General";
    if (!map.has(name)) map.set(name, []);
    const arr = map.get(name);
    if (!arr.some((x) => x.id === p.id)) arr.push(p);
  }
  return [...map.entries()]
    .map(([name, plist]) => ({
      name,
      posts: [...plist]
        .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
        .slice(0, perLane),
    }))
    .filter((l) => l.posts.length > 0)
    .sort((a, b) => b.posts.length - a.posts.length)
    .slice(0, maxLanes);
}

/** Latest stories per tag (slug-keyed). Top `maxLanes` tags by how many posts use them. */
export function buildTagLanes(posts, maxLanes = 4, perLane = 5) {
  const map = new Map();
  for (const p of posts) {
    for (const pt of p.tags || []) {
      const tag = pt.tag;
      if (!tag?.slug) continue;
      if (!map.has(tag.slug))
        map.set(tag.slug, { name: tag.name, slug: tag.slug, posts: [] });
      const bucket = map.get(tag.slug).posts;
      if (!bucket.some((x) => x.id === p.id)) bucket.push(p);
    }
  }
  return [...map.values()]
    .map((lane) => {
      const sorted = [...lane.posts].sort(
        (a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
      );
      return {
        name: lane.name,
        slug: lane.slug,
        totalCount: sorted.length,
        posts: sorted.slice(0, perLane),
      };
    })
    .filter((l) => l.posts.length > 0)
    .sort(
      (a, b) =>
        b.totalCount - a.totalCount || String(a.name).localeCompare(String(b.name))
    )
    .slice(0, maxLanes);
}
