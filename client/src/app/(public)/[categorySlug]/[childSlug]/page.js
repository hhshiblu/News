import { ChevronRight, Bookmark, Share2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import CategoryHero from "@/components/category/CategoryHero";
import CategoryGrid from "@/components/category/CategoryGrid";
import BigCard from "@/components/news/BigCard";
import MosaicNewsGrid from "@/components/news/MosaicNewsGrid";
import HorizontalCard from "@/components/news/HorizontalCard";
import Sidebar from "@/components/layout/Sidebar";
import AdSlot from "@/components/ads/AdSlot";
import Pagination from "@/components/ui/Pagination";
import { fetchPublicPosts } from "@/lib/api";
import { getPublicCategoryBySlugAction } from "@/actions/public-extra.action";

const CHILD_CATEGORY_PAGE_SIZE = 30;
const ARCHIVE_PAGE_SIZE = 12;

const normalizePost = (post) => ({
  ...post,
  image: post.featuredImage || "/placeholder.jpg",
  author: post.author?.name || "Staff Reporter",
  category: post.category?.name || "News",
  categorySlug: post.category?.slug,
  timestamp: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Recently"
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

export async function generateMetadata({ params, searchParams }) {
  const { categorySlug, childSlug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.page, 10) || 1);
  const categoryData = await getPublicCategoryBySlugAction(childSlug);
  const parentData = await getPublicCategoryBySlugAction(categorySlug);
  
  const label = categoryData?.data?.name || (childSlug || "").charAt(0).toUpperCase() + (childSlug || "").slice(1);
  const parentLabel = parentData?.data?.name || (categorySlug || "").charAt(0).toUpperCase() + (categorySlug || "").slice(1);
  const titleBase = `${label} — ${parentLabel} News — LabourPulse`;

  return {
    title: page > 1 ? `${label} — ${parentLabel} — Page ${page} — LabourPulse` : titleBase,
    description: `Latest ${label} news and analysis from our ${parentLabel} desk.`,
  };
}

async function SubcategoryPageContent({ params, searchParams }) {
  const { categorySlug, childSlug } = await params;
  const sp = await searchParams;
  let page = Math.max(1, parseInt(sp?.page, 10) || 1);
  const allPage = Math.max(1, parseInt(sp?.allPage, 10) || 1);

  const [categoryRes, parentRes] = await Promise.all([
    getPublicCategoryBySlugAction(childSlug),
    getPublicCategoryBySlugAction(categorySlug)
  ]);

  const categoryData = categoryRes?.data;
  const parentData = parentRes?.data;

  const postsResponse = await fetchPublicPosts({
    categorySlug: childSlug,
    page,
    limit: CHILD_CATEGORY_PAGE_SIZE,
  });
  const rawPosts = postsResponse?.posts || [];
  const totalPages = Math.max(1, postsResponse?.totalPages ?? 1);
  if (page > totalPages) {
    redirect(
      totalPages <= 1
        ? `/${categorySlug}/${childSlug}`
        : `/${categorySlug}/${childSlug}?page=${totalPages}`
    );
  }

  const displayArticles = rawPosts.map(normalizePost);
  const label = categoryData?.name || childSlug;
  const parentLabel = parentData?.name || categorySlug;
  const listBasePath = `/${categorySlug}/${childSlug}`;

  let archivePosts = [];
  let archiveTotalPages = 1;
  if (page === 1) {
    const archiveRes = await fetchPublicPosts({
      categorySlug: childSlug,
      page: allPage,
      limit: ARCHIVE_PAGE_SIZE,
      offset: CHILD_CATEGORY_PAGE_SIZE,
    });
    archivePosts = (archiveRes.posts || []).map(normalizePost);
    archiveTotalPages = Math.max(1, archiveRes.totalPages ?? 1);
    if (allPage > archiveTotalPages) {
      redirect(
        archiveTotalPages <= 1
          ? listBasePath
          : `${listBasePath}?allPage=${archiveTotalPages}`
      );
    }
  }

  if (!displayArticles || displayArticles.length === 0) {
    if (page > 1) redirect(listBasePath);
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-32 text-center h-[60vh] flex flex-col justify-center border-t border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 font-[Playfair_Display] mb-4">
          {categoryData?.name || childSlug.replace(/-/g, " ")}
        </h1>
        <p className="text-gray-500 font-[Inter] mb-8">No stories found in this section yet. Check back soon!</p>
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

  if (page > 1) {
    return (
      <div className="bg-[#fcfcfc]">
        <div className="max-w-[1280px] mx-auto px-4 py-8 w-full">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <main className="flex-1 min-w-0">
              <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4 font-[Inter] flex-wrap">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight size={10} className="text-gray-300 shrink-0" />
                <Link href={`/${categorySlug}`} className="hover:text-primary transition-colors">{parentLabel}</Link>
                <ChevronRight size={10} className="text-gray-300 shrink-0" />
                <span className="text-gray-900">{label}</span>
              </nav>
              <h1 className="text-2xl md:text-3xl font-black text-gray-950 font-[Playfair_Display] mb-6 leading-tight">
                {label}
                <span className="block sm:inline sm:ml-2 text-base md:text-lg font-bold text-gray-400 mt-1 sm:mt-0">
                  · Page {page}
                </span>
              </h1>
              <div className="mb-6">
                <MosaicNewsGrid posts={displayArticles} maxItems={7} />
              </div>
              {displayArticles.length > 7 && (
                <div className="space-y-6 md:space-y-8 mb-6">
                  {displayArticles.slice(7).map((story) => (
                    <HorizontalCard key={`list-${story.id}`} story={story} />
                  ))}
                </div>
              )}
              <Pagination basePath={listBasePath} currentPage={page} totalPages={totalPages} />
            </main>
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

  // Unique story distribution across hero/spotlight/feed.
  const usedStories = new Set();
  const hero = pickUnique(displayArticles, usedStories, { count: 1 })[0];
  const spotlight = pickUnique(displayArticles, usedStories, { start: 1, count: 2 });
  const featuredInDepth = pickUnique(displayArticles, usedStories, { start: 3, count: 1 })[0];
  const gridCoverage = pickUnique(displayArticles, usedStories);
  const layoutTone = childSlug.length % 2 === 0 ? "emerald" : "primary";
  const accentClass = layoutTone === "emerald" ? "text-emerald-600" : "text-primary";
  const accentBarClass = layoutTone === "emerald" ? "bg-emerald-600" : "bg-primary";

  return (
    <div className="bg-[#fcfcfc]">
      <div className="bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 border-b border-gray-800">
        <div className="max-w-[1280px] mx-auto px-4 py-5 md:py-7">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-3">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={10} className="text-gray-300" />
            <Link href={`/${categorySlug}`} className="hover:text-primary transition-colors">{parentLabel}</Link>
            <ChevronRight size={10} className="text-gray-300" />
            <span className="text-white">{label}</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className={`text-[10px] font-black uppercase tracking-[0.26em] mb-2 ${accentClass}`}>Desk layout</p>
              <h1 className="text-2xl md:text-4xl font-black text-white font-[Playfair_Display] leading-tight mb-3">
                {label}<span className={`${accentClass} italic`}>.</span>
              </h1>
              <p className="text-[13px] text-gray-300 font-medium leading-relaxed font-[Inter] border-l-2 border-white/25 pl-4">
                Reporting on {label.toLowerCase()} from our {parentLabel.toLowerCase()} desk.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
               <button type="button" className="px-4 py-2 bg-white/10 border border-white/20 text-white text-[10px] font-black tracking-widest uppercase rounded-lg hover:bg-white/20 transition-all">
                 Follow Desk
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          <main className="flex-1 min-w-0">
            <div className="mb-6 flex justify-center">
              <AdSlot slotKey="child_category_leaderboard" />
            </div>

            <section className="mb-8 md:mb-10 grid grid-cols-1 xl:grid-cols-12 gap-4">
              <div className="xl:col-span-8">
                <CategoryHero
                  story={hero}
                  hClass="min-h-[220px] md:min-h-[360px] lg:min-h-[420px]"
                  layout="stacked"
                />
              </div>
              <div className="xl:col-span-4 rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Latest pulse</h3>
                  <span className={`h-1.5 w-1.5 rounded-full ${accentBarClass}`} />
                </div>
                <div className="space-y-3">
                  {spotlight.slice(0, 2).map((story) => (
                    <Link key={`mini-${story.id}`} href={`/news/${story.slug}`} className="block group">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{story.timestamp}</p>
                      <p className="text-[13px] font-semibold text-gray-800 leading-snug group-hover:text-primary line-clamp-2">
                        {story.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {spotlight.length > 0 && (
              <div className="mb-10 md:mb-12">
                 <div className="flex flex-col gap-1 mb-5">
                    <div className={`h-1 w-10 ${accentBarClass}`}></div>
                    <h2 className="text-lg md:text-xl font-black text-gray-950 font-[Playfair_Display] tracking-tight">Editors&apos; Spotlight</h2>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    {spotlight.map(story => (
                      <BigCard key={story.id + "-spot"} story={story} />
                    ))}
                 </div>
              </div>
            )}

            {/* 3. FEATURE IN-DEPTH */}
            {featuredInDepth && (
               <div className="mb-10 py-6 border-y border-gray-100">
                  <HorizontalCard story={featuredInDepth} />
               </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-5 border-b border-gray-200 pb-2">
                <h2 className="text-base md:text-lg font-black text-gray-900 font-[Playfair_Display]">Latest in {label}</h2>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 font-[Inter]">Desk feed</span>
              </div>
              <CategoryGrid articles={gridCoverage} />
              {totalPages > 1 && (
                <Pagination basePath={listBasePath} currentPage={page} totalPages={totalPages} />
              )}
            </div>

            {page === 1 && archivePosts.length > 0 && (
              <section className="mt-14 pt-10 border-t-2 border-dashed border-gray-200">
                <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary font-[Inter] block mb-1">
                      Complete run
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-950 font-[Playfair_Display]">
                      All stories in {label}
                    </h2>
                    <p className="text-[12px] text-gray-500 font-[Inter] mt-1 max-w-xl">
                      Every remaining article in this slug, newest first—paginated below the feature zone.
                    </p>
                  </div>
                </div>
                <ul className="space-y-0 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white overflow-hidden">
                  {archivePosts.map((story) => (
                    <li key={story.id}>
                      <Link
                        href={`/news/${story.slug}`}
                        className="flex gap-3 sm:gap-4 items-start px-4 py-3.5 hover:bg-emerald-500/6 transition-colors group"
                      >
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ring-2 ${layoutTone === "emerald" ? "bg-emerald-600 ring-emerald-600/20" : "bg-primary ring-primary/20"}`}
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 font-[Inter]">
                            {story.timestamp}
                          </span>
                          <p className="text-[14px] md:text-[15px] font-semibold text-gray-900 font-[Inter] leading-snug group-hover:text-primary line-clamp-2">
                            {story.title}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-primary shrink-0 mt-1" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
                {archiveTotalPages > 1 && (
                  <Pagination
                    basePath={listBasePath}
                    currentPage={allPage}
                    totalPages={archiveTotalPages}
                    paramName="allPage"
                  />
                )}
              </section>
            )}

          </main>

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
