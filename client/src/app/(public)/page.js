import { getNewsFeed, getCategories } from "@/actions/public";
import { Suspense } from "react";

import PulseHero from "@/components/sections/PulseHero";
import BreakingRow from "@/components/sections/BreakingRow";
import CategoryGridDirectory from "@/components/sections/CategoryGridDirectory";
import DualCategoryGrid from "@/components/sections/DualCategoryGrid";
import MustReadSection from "@/components/sections/MustReadSection";
import EditorialStrip from "@/components/sections/EditorialStrip";
import NewsletterSection from "@/components/sections/NewsletterSection";
import InfiniteNewsFeed from "@/components/sections/InfiniteNewsFeed";

export const metadata = {
  title: "LabourPulse — Bangladesh's Leading Labour & Economy News",
  description:
    "Comprehensive coverage of labour rights, industrial relations, and economic shifts in Bangladesh and beyond.",
};

// ─── helpers ────────────────────────────────────────────────────────────────

function getPostKey(post) {
  if (!post) return null;
  if (post.id !== undefined && post.id !== null) return String(post.id);
  if (post.slug) return String(post.slug);
  return null;
}

function take(source = [], n, seen) {
  const result = [];
  for (const p of source) {
    if (result.length >= n) break;
    const key = getPostKey(p);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(p);
  }
  return result;
}

// ─── main page ───────────────────────────────────────────────────────────────

async function HomePageContent() {
  const catRes = await getCategories();
  const allCats = catRes.data || [];

  // Fetch primary global feeds
  const [
    featuredRes, latestRes, breakingRes, opinionRes,
  ] = await Promise.all([
    getNewsFeed({ featured: true, limit: 8 }),
    getNewsFeed({ limit: 40 }),
    getNewsFeed({ limit: 6 }),
    getNewsFeed({ isOpinion: true, limit: 4 }),
  ]);

  // Fetch feeds for ALL categories
  const catFeeds = await Promise.all(
    allCats.map(async (cat) => {
      let feed = await getNewsFeed({ parentCategorySlug: cat.slug, limit: 15 });
      if (!feed?.posts?.length && cat.id && String(cat.id).length > 20) {
        feed = await getNewsFeed({ categoryId: cat.id, limit: 15 });
      }
      return feed || { posts: [] };
    })
  );

  const featuredAll = featuredRes.posts || [];
  const latestAll   = latestRes.posts   || [];
  const breakingAll = breakingRes.posts || [];
  const opinionAll  = opinionRes.posts  || [];

  const seen = new Set();
  const leftovers = [];

  // SECTION 1 — Hero
  const heroLead   = take(featuredAll, 1, seen);
  const heroSubs   = take(featuredAll, 2, seen);
  const heroSide   = take(featuredAll, 2, seen);
  const heroPosts  = [...heroLead, ...heroSubs, ...heroSide]; // 5 featured
  if (heroPosts.length < 5) heroPosts.push(...take(latestAll, 5 - heroPosts.length, seen));
  
  const heroLatest = take(latestAll, 3, seen);
  if (heroLatest.length < 3) heroLatest.push(...take(latestAll, 3 - heroLatest.length, seen));

  // SECTION 2 — Breaking strip
  const breakingPosts = take(breakingAll, 5, seen);
  if (breakingPosts.length < 5) breakingPosts.push(...take(latestAll, 5 - breakingPosts.length, seen));

  // Category Desks Data
  const allCategoryDesks = allCats.map((cat, i) => {
    const feed = catFeeds[i];
    
    // RELAXED DEDUPLICATION: Always show top 6 posts for the category, even if they appeared in Hero
    const rawPosts = feed.posts || [];
    const posts = rawPosts.slice(0, 5);
    
    // Add these exact 6 to the seen set so they don't appear in the infinite feed below
    posts.forEach(p => {
      const key = getPostKey(p);
      if (key) seen.add(key);
    });

    // Add unused posts to leftovers for the infinite feed
    rawPosts.forEach(post => {
      const key = getPostKey(post);
      if (key && !seen.has(key)) leftovers.push(post);
    });
    
    return { category: cat, posts };
  }).filter(desk => desk.posts.length >= 5); // Only keep if they have at least 5 posts

  // Get only the top 2 categories for the special layouts
  const top2Desks = allCategoryDesks.slice(0, 2);
  const desk1 = top2Desks[0] || null;
  const desk2 = top2Desks[1] || null;

  // SECTION 6 — Opinion / Must Read
  const opinionPosts = (() => {
    const op = take(opinionAll, 3, seen);
    if (op.length < 3) op.push(...take(latestAll, 3 - op.length, seen));
    return op;
  })();

  // SECTION 10 — Dark Editorial Strip
  const editorialPosts = take(latestAll, 5, seen);

  // Add all remaining latest to leftovers
  latestAll.forEach(post => {
    const key = getPostKey(post);
    if (key && !seen.has(key)) leftovers.push(post);
  });

  // Deduplicate leftovers
  const uniqueLeftovers = [];
  const leftoverSeen = new Set(seen);
  leftovers.forEach(post => {
    const key = getPostKey(post);
    if (key && !leftoverSeen.has(key)) {
      leftoverSeen.add(key);
      uniqueLeftovers.push(post);
    }
  });

  const seenIdsArray = Array.from(leftoverSeen);
  const infiniteInitial = uniqueLeftovers.slice(0, 12);
  const infiniteOffset = 40; 

  return (
    <div className="bg-white min-h-screen">

      {/* ─── SECTION 1: HERO ─────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 pt-6 pb-0">
        <PulseHero featuredPosts={heroPosts} latestPosts={heroLatest} />
      </div>

      {/* ─── SECTION 2: BREAKING STRIP ───────────────────────────── */}
      <BreakingRow posts={breakingPosts} />

      {/* ─── SECTION 3: TOP 2 CATEGORIES (Dual Grid Design) ─────────── */}
      {(desk1 || desk2) && (
        <DualCategoryGrid desk1={desk1} desk2={desk2} />
      )}

      {/* ─── SECTION 6: OPINION / MUST READ (dark) ───────────────── */}
      <MustReadSection posts={opinionPosts} />

      {/* ─── SECTION 10: DARK EDITORIAL STRIP ────────────────────── */}
      <EditorialStrip posts={editorialPosts} />

      {/* ─── SECTION 11: INFINITE SCROLL FEED ────────────────────── */}
      <InfiniteNewsFeed
        initialPosts={infiniteInitial}
        initialOffset={infiniteOffset}
        seenIdsArray={seenIdsArray}
      />

      {/* ─── SECTION 12: NEWSLETTER ───────────────────────────────── */}
      <NewsletterSection />
    </div>
  );
}

function HomePageSkeleton() {
  return (
    <div className="bg-white w-full">
      <div className="max-w-[1280px] mx-auto px-4 pt-6 pb-16 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2 h-80 bg-gray-100 rounded-sm" />
          <div className="h-80 bg-gray-100 rounded-sm" />
        </div>
        <div className="h-14 bg-gray-100 rounded-sm mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="h-64 bg-gray-100 rounded-sm" />
          <div className="h-64 bg-gray-100 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageContent />
    </Suspense>
  );
}
