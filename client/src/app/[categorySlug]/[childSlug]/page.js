import { ChevronRight, Bookmark, Share2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import CategoryHero from "@/components/category/CategoryHero";
import CategoryGrid from "@/components/category/CategoryGrid";
import BigCard from "@/components/news/BigCard";
import HorizontalCard from "@/components/news/HorizontalCard";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import AdSlot from "@/components/ads/AdSlot";
import Pagination from "@/components/ui/Pagination";
import { CategoryTagRails } from "@/components/category/CategoryDeskRails";
import { fetchPublicPosts } from "@/lib/api";
import { buildTagLanes } from "@/lib/postLanes";

const CHILD_CATEGORY_PAGE_SIZE = 30;
const ARCHIVE_PAGE_SIZE = 12;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1/public';

async function getCategoryData(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

const normalizePost = (post) => ({
  ...post,
  image: post.featuredImage || "/placeholder.jpg",
  author: post.author?.name || "Staff Reporter",
  category: post.category?.name || "News",
  categorySlug: post.category?.slug,
  timestamp: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Recently"
});

export async function generateMetadata({ params, searchParams }) {
  const { categorySlug, childSlug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.page, 10) || 1);
  const categoryData = await getCategoryData(childSlug);
  const parentData = await getCategoryData(categorySlug);
  
  const label = categoryData?.data?.name || (childSlug || "").charAt(0).toUpperCase() + (childSlug || "").slice(1);
  const parentLabel = parentData?.data?.name || (categorySlug || "").charAt(0).toUpperCase() + (categorySlug || "").slice(1);
  const titleBase = `${label} — ${parentLabel} News — LabourPulse`;

  return {
    title: page > 1 ? `${label} — ${parentLabel} — Page ${page} — LabourPulse` : titleBase,
    description: `Latest ${label} news and analysis from our ${parentLabel} desk.`,
  };
}

export default async function SubcategoryPage({ params, searchParams }) {
  const { categorySlug, childSlug } = await params;
  const sp = await searchParams;
  let page = Math.max(1, parseInt(sp?.page, 10) || 1);
  const allPage = Math.max(1, parseInt(sp?.allPage, 10) || 1);

  const [categoryRes, parentRes] = await Promise.all([
    getCategoryData(childSlug),
    getCategoryData(categorySlug)
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
  const tagLanes = page === 1 ? buildTagLanes(rawPosts, 4, 5) : [];
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
      <div className="bg-[#fcfcfc] min-h-screen flex flex-col">
        <Navbar />
        <div className="max-w-[1280px] mx-auto px-4 py-8 flex-1 w-full">
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
              <div className="space-y-6 md:space-y-8">
                {displayArticles.map((story) => (
                  <HorizontalCard key={story.id} story={story} />
                ))}
              </div>
              <Pagination basePath={listBasePath} currentPage={page} totalPages={totalPages} />
            </main>
            <aside className="lg:w-[300px] xl:w-[300px] shrink-0">
              <div className="sticky top-24">
                <Sidebar />
              </div>
            </aside>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Optimized Content Slicing to show ALL latest coverage without duplication
  const hero = displayArticles[0];
  const spotlight = displayArticles.slice(1, 3);
  const featuredInDepth = displayArticles[3];
  const gridCoverage = displayArticles.slice(4); // Show EVERYTHING from index 4 onwards

  return (
    <div className="bg-[#fcfcfc] min-h-screen flex flex-col">
      <Navbar />
      {/* Modern Breadcrumb & Subcategory Title */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4 py-4 md:py-5">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-3">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={10} className="text-gray-300" />
            <Link href={`/${categorySlug}`} className="hover:text-primary transition-colors">{parentLabel}</Link>
            <ChevronRight size={10} className="text-gray-300" />
            <span className="text-gray-900">{label}</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h1 className="text-2xl md:text-4xl font-black text-gray-950 font-[Playfair_Display] leading-tight mb-3">
                {label}<span className="text-primary italic">.</span>
              </h1>
              <p className="text-[13px] text-gray-600 font-medium leading-relaxed font-[Inter] border-l-2 border-primary/25 pl-4">
                Reporting on {label.toLowerCase()} from our {parentLabel.toLowerCase()} desk.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
               <button type="button" className="px-4 py-2 bg-gray-950 text-white text-[10px] font-black tracking-widest uppercase rounded-lg hover:bg-primary transition-all">
                 Follow Desk
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-6 md:py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          <main className="flex-1 min-w-0">
            {tagLanes.length > 0 && (
              <CategoryTagRails lanes={tagLanes} heading="Tags driving this beat" />
            )}

            <div className="mb-6 flex justify-center">
              <AdSlot slotKey="child_category_leaderboard" />
            </div>

            <div className="mb-8 md:mb-10">
              <CategoryHero
                story={hero}
                hClass="min-h-[220px] md:min-h-[360px] lg:min-h-[400px]"
                layout="stacked"
              />
            </div>

            {spotlight.length > 0 && (
              <div className="mb-10 md:mb-12">
                 <div className="flex flex-col gap-1 mb-5">
                    <div className="h-1 w-10 bg-gray-950"></div>
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
                        className="flex gap-3 sm:gap-4 items-start px-4 py-3.5 hover:bg-emerald-500/[0.06] transition-colors group"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5 ring-2 ring-emerald-600/20" aria-hidden />
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

      <Footer />
    </div>
  );
}
