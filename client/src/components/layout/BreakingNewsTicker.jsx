import { getNewsFeed } from "@/actions/public";
import BreakingNewsTickerClient from "./BreakingNewsTickerClient";

export default async function BreakingNewsTicker() {
  const [breakingNews, breakingAlt] = await Promise.all([
    getNewsFeed({ tagSlug: "breaking-news", limit: 35 }),
    getNewsFeed({ tagSlug: "breaking", limit: 35 }),
  ]);

  const seen = new Set();
  const items = [];
  for (const p of [...(breakingNews.posts || []), ...(breakingAlt.posts || [])]) {
    if (!p?.id || !p?.slug || !p.title || seen.has(p.id)) continue;
    seen.add(p.id);
    items.push({ title: p.title, slug: p.slug });
  }

  return <BreakingNewsTickerClient items={items} />;
}
