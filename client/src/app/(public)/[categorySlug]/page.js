import { ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import CategoryHero from "@/components/category/CategoryHero";
import Sidebar from "@/components/layout/Sidebar";
import AdSlot from "@/components/ads/AdSlot";
import BigCard from "@/components/news/BigCard";
import LoadMoreFeed from "@/components/news/LoadMoreFeed";
import { fetchPublicPosts } from "@/lib/api";
import { getPublicCategoryBySlugAction } from "@/actions/public-extra.action";

const INITIAL_LOAD = 30; // enough for hero zone + feed
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

function pickUnique(posts, usedSet, { start = 0, count = Infinity, predicate } = {}) {
  const bucket = [];
  for (let i = start; i < posts.length; i += 1) {
    const post = posts[i];
    if (predicate && !predicate(post)) continue;
    const key = getStoryKey(post);
    if (!key || usedSet.has(key)) continue;
    usedSet.add(key);
    bucket.push(post);
    if (bucket.length >= count) break;
  }
  return bucket;
}

export async function generateMetadata({ params }) {
  const { categorySlug } = await params;
  const categoryData = await getPublicCategoryBySlugAction(categorySlug);
  const label =
    categoryData?.data?.name ||
    (categorySlug || "").charAt(0).toUpperCase() + (categorySlug || "").slice(1);

  return {
    title: `${label} — Latest Coverage — LabourPulse`,
    description: `The definitive source for ${label} news, analysis, and exclusive insights from LabourPulse.`,
  };
}


async function ParentCategoryPageContent({ params }) {
  const { categorySlug } = await params;

  const categoryResponse = await getPublicCategoryBySlugAction(categorySlug);
  const categoryData = categoryResponse?.data;

  const postsResponse = await fetchPublicPosts({
    parentCategorySlug: categorySlug,
    page: 1,
    limit: INITIAL_LOAD,
  });
  const rawPosts = postsResponse?.posts || [];
  const totalPosts = postsResponse?.total ?? rawPosts.length;

  const allPosts = rawPosts.map(normalizePost);

  if (!categoryData) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-gray-900 font-[Playfair_Display] mb-4">
          {categorySlug.toUpperCase()}
        </h1>
        <p className="text-gray-500 font-[Inter] mb-8">
          This section is currently under editorial review.
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:shadow-xl transition-all"
        >
          ← Back to Hub
        </Link>
      </div>
    );
  }

  const label = categoryData.name;
  const subcategories = categoryData.children || [];

  if (allPosts.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-gray-900 font-[Playfair_Display] mb-4">
          {label}
        </h1>
        <p className="text-gray-500 font-[Inter] mb-8">
          This section is currently under editorial review.
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:shadow-xl transition-all"
        >
          ← Back to Hub
        </Link>
      </div>
    );
  }

  // ── Distribute posts across zones (unique — no repeats) ──
  const usedStories = new Set();
  const leadStory = pickUnique(allPosts, usedStories, { count: 1 })[0];
  const sideHeadlines = pickUnique(allPosts, usedStories, { count: 4 });
  const editorsPicks = pickUnique(allPosts, usedStories, { count: 3 });
  const spotlightStory =
    pickUnique(allPosts, usedStories, { predicate: (p) => !!p?.isOpinion, count: 1 })[0] ||
    pickUnique(allPosts, usedStories, { count: 1 })[0] ||
    null;
  const feedPosts = pickUnique(allPosts, usedStories); // remaining → feed

  // How many were consumed by hero zones
  const consumed = usedStories.size;

  return (
    <div className="bg-[#fcfcfc]">
      {/* ━━━ ZONE 1: Category Header ━━━ */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 pt-4 pb-5">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3 font-[Inter]">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={10} className="text-gray-300 shrink-0" />
            <span className="text-gray-900">{label}</span>
          </nav>

          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-1 h-10 bg-primary rounded-full shrink-0 mt-1" />
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-gray-950 font-[Playfair_Display] leading-tight">
                  {label}<span className="text-primary italic">.</span>
                </h1>
              </div>
            </div>
            {subcategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {subcategories.slice(0, 6).map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/${categorySlug}/${sub.slug}`}
                    className="px-2.5 py-1 bg-gray-50 hover:bg-primary hover:text-white text-[10px] font-black rounded-md border border-gray-200 transition-all font-[Inter]"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ━━━ ZONE 2: Hero — Lead Story + Side Headlines ━━━ */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4 py-5">
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Lead story — 65% */}
            <div className="lg:w-[65%]">
              <div className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-200/80 bg-white">
                <CategoryHero
                  story={leadStory}
                  hClass="min-h-[200px] md:min-h-[300px] lg:min-h-[340px]"
                  layout="stacked"
                  compact
                />
              </div>
            </div>

            {/* Side headlines — 35% */}
            <div className="lg:w-[35%] flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b-2 border-primary">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-primary shrink-0" />
                  <h2 className="text-[11px] font-black uppercase tracking-widest font-[Inter]">
                    Latest
                  </h2>
                </div>
              </div>
              <div className="flex flex-col divide-y divide-gray-100 flex-1">
                {sideHeadlines.map((story) => (
                  <Link
                    key={story.id}
                    href={`/news/${story.slug}`}
                    className="group flex gap-3 items-start py-3 first:pt-0"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-12 relative shrink-0 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={story.image || "/placeholder.jpg"}
                        alt={story.title}
                        fill
                        unoptimized
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 text-[8px] font-bold text-primary uppercase tracking-wider mb-0.5">
                        <span>{story.category}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-gray-400">{story.timestamp}</span>
                      </div>
                      <h3 className="text-[13px] font-bold text-gray-900 group-hover:text-primary leading-snug transition-colors line-clamp-2 font-[Inter]">
                        {story.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ MAIN CONTENT AREA ━━━ */}
      <div className="max-w-[1280px] mx-auto px-4 py-5">
        <div className="flex flex-col lg:flex-row gap-5">
          <main className="flex-1 min-w-0">
            {/* Ad leaderboard */}
            <div className="mb-6 flex justify-center">
              <AdSlot slotKey="category_hub_leaderboard" />
            </div>

            {/* ━━━ ZONE 3: Editors' Picks — 3-col BigCards ━━━ */}
            {editorsPicks.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-0.5 w-8 bg-primary" />
                  <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-950 font-[Inter]">
                    Editor&apos;s Picks
                  </h2>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {editorsPicks.map((story) => (
                    <BigCard key={story.id} story={story} compact />
                  ))}
                </div>
              </div>
            )}

            {/* ━━━ ZONE 4: Editorial Spotlight — white bg horizontal card ━━━ */}
            {spotlightStory && (
              <div className="mb-8 p-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-[45%] h-[200px] md:h-auto md:min-h-[220px] relative">
                  <Image
                    src={spotlightStory.image}
                    alt={spotlightStory.title}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 45vw"
                  />
                </div>
                <div className="p-5 md:p-6 md:w-[55%] flex flex-col justify-center bg-white">
                  <div className="text-primary text-[9px] font-black uppercase tracking-widest mb-1.5 font-[Inter]">
                    Editorial Spotlight
                  </div>
                  <h2 className="text-lg md:text-xl font-black font-[Playfair_Display] leading-tight mb-2 text-gray-950">
                    {spotlightStory.title}
                  </h2>
                  <p className="text-gray-500 text-[13px] font-[Inter] line-clamp-3 mb-4">
                    {spotlightStory.excerpt ||
                      "Diving deep into the core issues that define our industry today."}
                  </p>
                  <Link
                    href={`/news/${spotlightStory.slug}`}
                    className="flex items-center gap-3 text-primary font-bold text-xs uppercase tracking-widest hover:text-primary-dark transition-colors group"
                  >
                    Read Story{" "}
                    <ChevronRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            )}

            {/* ━━━ ZONE 5: Latest Stories Feed — 2-col horizontal cards + See More ━━━ */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-1 w-12 bg-primary rounded-sm" />
                <h2 className="text-base md:text-lg font-black text-gray-950 font-[Playfair_Display]">
                  Latest Stories
                </h2>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <LoadMoreFeed
                initialPosts={feedPosts.slice(0, FEED_SIZE)}
                fetchParams={{ parentCategorySlug: categorySlug }}
                endpoint="/public/posts"
                limit={FEED_SIZE}
                offset={consumed}
                totalFromServer={totalPosts > consumed ? totalPosts - consumed : undefined}
                buttonLabel="See More Stories"
                buttonClass="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-dark uppercase tracking-widest shadow-sm hover:shadow-md"
                variant="category"
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

function CategoryPageSkeleton() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-72 bg-gray-200 rounded-2xl" />
        <div className="h-72 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  );
}

export default function ParentCategoryPage(props) {
  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <ParentCategoryPageContent {...props} />
    </Suspense>
  );
}
