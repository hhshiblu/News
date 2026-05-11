import { ChevronRight, User, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Sidebar from "@/components/layout/Sidebar";
import AdSlot from "@/components/ads/AdSlot";
import LoadMoreFeed from "@/components/news/LoadMoreFeed";
import { fetchPublicPosts } from "@/lib/api";
import { getPublicCategoryBySlugAction } from "@/actions/public-extra.action";

const INITIAL_LOAD = 30;
const FEED_SIZE = 10;

const normalizePost = (post) => ({
  ...post,
  image: post.featuredImage || "/placeholder.jpg",
  reporter: post.reporter?.name || "Staff Reporter",
  category: post.category?.name || "News",
  categorySlug: post.category?.slug,
  timestamp: post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString()
    : "Recently",
});

const getStoryKey = (story) => String(story?.id || story?.slug || "");

function pickUnique(posts, usedSet, { start = 0, count = Infinity } = {}) {
  const bucket = [];
  for (let i = start; i < posts.length; i += 1) {
    const post = posts[i];
    const key = getStoryKey(post);
    if (!key || usedSet.has(key)) continue;
    usedSet.add(key);
    bucket.push(post);
    if (bucket.length >= count) break;
  }
  return bucket;
}

function fmtDate(story) {
  const d = story?.publishedAt || story?.createdAt;
  if (!d) return story?.timestamp || "";
  try {
    const now = new Date();
    const pub = new Date(d);
    const diffMins = Math.floor((now - pub) / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return pub.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return story?.timestamp || ""; }
}

export async function generateMetadata({ params }) {
  const { categorySlug, childSlug } = await params;
  const categoryData = await getPublicCategoryBySlugAction(childSlug);
  const parentData = await getPublicCategoryBySlugAction(categorySlug);

  const label = categoryData?.data?.name || (childSlug || "").charAt(0).toUpperCase() + (childSlug || "").slice(1);
  const parentLabel = parentData?.data?.name || (categorySlug || "").charAt(0).toUpperCase() + (categorySlug || "").slice(1);

  return {
    title: `${label} — ${parentLabel} News — LabourPulse`,
    description: `Latest ${label} news and analysis from our ${parentLabel} desk.`,
  };
}

/* ── Mosaic Hero Card ── */
function MosaicCard({ story, tall = false }) {
  if (!story) return null;
  return (
    <Link
      href={`/news/${story.slug}`}
      className={`group relative block overflow-hidden rounded-xl border border-gray-200 bg-gray-100 img-zoom ${tall ? "row-span-2" : ""}`}
      style={{ minHeight: tall ? "100%" : "180px" }}
    >
      <Image
        src={story.image || "/placeholder.jpg"}
        alt={story.title}
        fill
        unoptimized
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        sizes={tall ? "(max-width:768px) 100vw, 55vw" : "(max-width:768px) 50vw, 27vw"}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <span className="absolute top-3 left-3 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-600 font-[Inter]">
        {typeof story.category === "object" ? story.category.name : story.category}
      </span>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className={`text-white font-bold font-[Playfair_Display] leading-snug line-clamp-3 mb-1 ${tall ? "text-lg md:text-xl" : "text-[13px] md:text-[14px]"}`}>
          {story.title}
        </h3>
        <p className="text-white/60 text-[10px] font-[Inter] flex items-center gap-1">
          <Clock size={9} /> {fmtDate(story)}
        </p>
      </div>
    </Link>
  );
}

/* ── Featured Strip Card ── */
function StripCard({ story }) {
  if (!story) return null;
  return (
    <Link href={`/news/${story.slug}`} className="group block min-w-0">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-2 img-zoom">
        <Image
          src={story.image || "/placeholder.jpg"}
          alt={story.title}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width:640px) 50vw, 25vw"
        />
      </div>
      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest font-[Inter] block mb-0.5">
        {typeof story.category === "object" ? story.category.name : story.category}
      </span>
      <h4 className="text-[12px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors font-[Inter]">
        {story.title}
      </h4>
    </Link>
  );
}


async function SubcategoryPageContent({ params }) {
  const { categorySlug, childSlug } = await params;

  const [categoryRes, parentRes] = await Promise.all([
    getPublicCategoryBySlugAction(childSlug),
    getPublicCategoryBySlugAction(categorySlug),
  ]);

  const categoryData = categoryRes?.data;
  const parentData = parentRes?.data;

  const postsResponse = await fetchPublicPosts({
    categorySlug: childSlug,
    page: 1,
    limit: INITIAL_LOAD,
  });
  const rawPosts = postsResponse?.posts || [];
  const totalPosts = postsResponse?.total ?? rawPosts.length;

  const displayArticles = rawPosts.map(normalizePost);
  const label = categoryData?.name || childSlug;
  const parentLabel = parentData?.name || categorySlug;

  if (!displayArticles || displayArticles.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-32 text-center h-[60vh] flex flex-col justify-center border-t border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 font-[Playfair_Display] mb-4">
          {categoryData?.name || childSlug.replace(/-/g, " ")}
        </h1>
        <p className="text-gray-500 font-[Inter] mb-8">
          No stories found in this section yet. Check back soon!
        </p>
        <div className="flex gap-4 justify-center">
          <Link href={`/${categorySlug}`} className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-primary transition-colors">
            Visit {parentData?.name || categorySlug}
          </Link>
          <Link href="/" className="px-6 py-2.5 bg-gray-100 text-gray-900 font-bold rounded-lg hover:bg-gray-200 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // ── Distribute posts uniquely across zones ──
  const usedStories = new Set();
  const mosaicMain = pickUnique(displayArticles, usedStories, { count: 1 })[0];
  const mosaicSide = pickUnique(displayArticles, usedStories, { count: 2 });
  const stripCards = pickUnique(displayArticles, usedStories, { count: 4 });
  const feedPosts = pickUnique(displayArticles, usedStories);
  const consumed = usedStories.size;

  // Siblings for navigation
  const siblings = parentData?.children || [];

  return (
    <div className="bg-white min-h-screen">
      {/* ━━━ ZONE 1: Clean White Header ━━━ */}
      <div className="border-t-[3px] border-emerald-600" />
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 py-5">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-3 font-[Inter] flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={10} className="text-gray-300" />
            <Link href={`/${categorySlug}`} className="hover:text-primary transition-colors">{parentLabel}</Link>
            <ChevronRight size={10} className="text-gray-300" />
            <span className="text-gray-900">{label}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-gray-950 font-[Playfair_Display] leading-tight">
                {label}<span className="text-emerald-600 italic">.</span>
              </h1>
              <p className="text-[13px] text-gray-500 font-[Inter] mt-1">
                Reporting on {label.toLowerCase()} from our {parentLabel.toLowerCase()} desk.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 font-[Inter] uppercase tracking-widest">
                {totalPosts} Stories
              </span>
              <button
                type="button"
                className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black tracking-widest uppercase rounded-full hover:bg-emerald-700 transition-all"
              >
                Follow
              </button>
            </div>
          </div>

          {/* Sibling subcategory nav */}
          {siblings.length > 1 && (
            <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-gray-100">
              {siblings.map((sib) => (
                <Link
                  key={sib.id}
                  href={`/${categorySlug}/${sib.slug}`}
                  className={`px-3 py-1.5 text-[10px] font-black rounded-full border transition-all font-[Inter] ${
                    sib.slug === childSlug
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-emerald-600 hover:text-emerald-700"
                  }`}
                >
                  {sib.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ━━━ ZONE 2: Mosaic Hero — L-shape grid ━━━ */}
      <div className="bg-[#f8faf9] border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4 py-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4" style={{ minHeight: "380px" }}>
            {/* Tall main card — spans 2 rows */}
            <div className="md:col-span-7 md:row-span-2 min-h-[280px] md:min-h-0">
              <MosaicCard story={mosaicMain} tall />
            </div>
            {/* 2 stacked side cards */}
            {mosaicSide.map((story) => (
              <div key={story.id} className="md:col-span-5 min-h-[170px]">
                <MosaicCard story={story} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ━━━ ZONE 3: Featured Strip — 4 compact square cards ━━━ */}
      {stripCards.length > 0 && (
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 py-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 bg-emerald-600 rounded-full shrink-0" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-950 font-[Inter]">
                From the Desk
              </h2>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stripCards.map((story) => (
                <StripCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ━━━ MAIN CONTENT AREA ━━━ */}
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
          <main className="flex-1 min-w-0">
            {/* Ad */}
            <div className="mb-6 flex justify-center">
              <AdSlot slotKey="child_category_leaderboard" />
            </div>

            {/* ━━━ ZONE 5: Magazine Feed — alternating rows + See More ━━━ */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-5 border-b-2 border-emerald-600 pb-2">
                <h2 className="text-base md:text-lg font-black text-gray-900 font-[Playfair_Display]">
                  All Stories in {label}
                </h2>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 font-[Inter]">
                  Desk feed
                </span>
              </div>

              <LoadMoreFeed
                initialPosts={feedPosts.slice(0, FEED_SIZE)}
                fetchParams={{ categorySlug: childSlug }}
                endpoint="/public/posts"
                limit={FEED_SIZE}
                offset={consumed}
                totalFromServer={totalPosts > consumed ? totalPosts - consumed : undefined}
                buttonLabel={`See More from ${label}`}
                buttonClass="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-dark uppercase tracking-widest shadow-sm hover:shadow-md"
                variant="subcategory"
              />
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-[300px] xl:w-[300px] shrink-0">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ChildCategoryPageSkeleton() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6 animate-pulse">
      <div className="h-8 w-52 bg-gray-200 rounded mb-4" />
      <div className="h-72 bg-gray-200 rounded-2xl mb-5" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-40 bg-gray-200 rounded-xl" />
        <div className="h-40 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

export default function SubcategoryPage(props) {
  return (
    <Suspense fallback={<ChildCategoryPageSkeleton />}>
      <SubcategoryPageContent {...props} />
    </Suspense>
  );
}
