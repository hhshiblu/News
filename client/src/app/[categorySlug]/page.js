import { ChevronRight, Bookmark, Share2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import CategoryHero from "@/components/category/CategoryHero";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import AdSlot from "@/components/ads/AdSlot";
import MarketTicker from "@/components/sections/MarketTicker";
import SectionHeader from "@/components/sections/SectionHeader";
import HorizontalCard from "@/components/news/HorizontalCard";
import MediumCard from "@/components/news/MediumCard";
import SmallCard from "@/components/news/SmallCard";
import BigCard from "@/components/news/BigCard";
import Pagination from "@/components/ui/Pagination";
import { CategoryTagRails } from "@/components/category/CategoryDeskRails";
import { fetchPublicPosts } from "@/lib/api";
import { buildTagLanes } from "@/lib/postLanes";

const CATEGORY_PAGE_SIZE = 30;
const ARCHIVE_PAGE_SIZE = 12;
/** Larger sample so “Topic pulse” can surface top 4 tags with 5 stories each. */
const TAG_LANE_SAMPLE = 100;

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
  const { categorySlug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.page, 10) || 1);
  const categoryData = await getCategoryData(categorySlug);
  
  const label = categoryData?.data?.name || (categorySlug || "").charAt(0).toUpperCase() + (categorySlug || "").slice(1);
  const titleBase = `${label} — Latest Standard Coverage — LabourPulse`;

  return {
    title: page > 1 ? `${label} — Page ${page} — LabourPulse` : titleBase,
    description: `The definitive source for ${label} news, analysis, and exclusive insights from LabourPulse.`,
  };
}

export default async function ParentCategoryPage({ params, searchParams }) {
  const { categorySlug } = await params;
  const sp = await searchParams;
  let page = Math.max(1, parseInt(sp?.page, 10) || 1);
  const allPage = Math.max(1, parseInt(sp?.allPage, 10) || 1);

  const categoryResponse = await getCategoryData(categorySlug);
  const categoryData = categoryResponse?.data;

  const postsResponse = await fetchPublicPosts({
    parentCategorySlug: categorySlug,
    page,
    limit: CATEGORY_PAGE_SIZE,
  });
  const rawPosts = postsResponse?.posts || [];
  const totalPages = Math.max(1, postsResponse?.totalPages ?? 1);
  if (page > totalPages) {
    redirect(totalPages <= 1 ? `/${categorySlug}` : `/${categorySlug}?page=${totalPages}`);
  }

  const allPosts = rawPosts.map(normalizePost);
  let tagLanes = [];
  if (page === 1) {
    const laneFeed = await fetchPublicPosts({
      parentCategorySlug: categorySlug,
      page: 1,
      limit: TAG_LANE_SAMPLE,
    });
    tagLanes = buildTagLanes(laneFeed.posts || [], 4, 5);
  }

  let archivePosts = [];
  let archiveTotalPages = 1;
  if (page === 1) {
    const archiveRes = await fetchPublicPosts({
      parentCategorySlug: categorySlug,
      page: allPage,
      limit: ARCHIVE_PAGE_SIZE,
      offset: CATEGORY_PAGE_SIZE,
    });
    archivePosts = (archiveRes.posts || []).map(normalizePost);
    archiveTotalPages = Math.max(1, archiveRes.totalPages ?? 1);
    if (allPage > archiveTotalPages) {
      redirect(archiveTotalPages <= 1 ? `/${categorySlug}` : `/${categorySlug}?allPage=${archiveTotalPages}`);
    }
  }

  if (!categoryData) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-gray-900 font-[Playfair_Display] mb-4">
          {categorySlug.toUpperCase()}
        </h1>
        <p className="text-gray-500 font-[Inter] mb-8">This section is currently under editorial review.</p>
        <Link href="/" className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:shadow-xl transition-all">← Back to Hub</Link>
      </div>
    );
  }

  const label = categoryData.name;

  if (allPosts.length === 0) {
    if (page > 1) redirect(`/${categorySlug}`);
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-gray-900 font-[Playfair_Display] mb-4">
          {label}
        </h1>
        <p className="text-gray-500 font-[Inter] mb-8">This section is currently under editorial review.</p>
        <Link href="/" className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:shadow-xl transition-all">← Back to Hub</Link>
      </div>
    );
  }

  if (page > 1) {
    return (
      <div className="bg-[#fcfcfc] min-h-screen flex flex-col">
        <Navbar />
        <div className="w-full h-px bg-gray-200" />
        <div className="max-w-[1280px] mx-auto px-4 py-4 flex-1 w-full">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
            <main className="flex-1 min-w-0">
              <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4 font-[Inter]">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight size={10} className="text-gray-300 shrink-0" />
                <Link href={`/${categorySlug}`} className="hover:text-primary text-gray-900">
                  {label}
                </Link>
              </nav>
              <h1 className="text-2xl md:text-3xl font-black text-gray-950 font-[Playfair_Display] mb-6 leading-tight">
                {label}
                <span className="block sm:inline sm:ml-2 text-base md:text-lg font-bold text-gray-400 mt-1 sm:mt-0">
                  · Page {page}
                </span>
              </h1>
              <div className="space-y-4 md:space-y-5">
                {allPosts.map((story) => (
                  <HorizontalCard key={story.id} story={story} compact />
                ))}
              </div>
              <Pagination basePath={`/${categorySlug}`} currentPage={page} totalPages={totalPages} />
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
  const subcategories = categoryData.children || [];

  // Data Slices for Standard Density Layout
  const leadStory = allPosts[0];
  const sideHeadlines = allPosts.slice(1, 5);
  const topRegistry = allPosts.slice(5, 11);
  const detailedSpotlight = allPosts.find(p => p.isOpinion) || allPosts[11];
  const editorialFeed = allPosts.slice(12);

  return (
    <div className="bg-[#fcfcfc] min-h-screen flex flex-col">
      <Navbar />
      {/* Ribbon Removed (Live was there) */}
      <div className="w-full h-px bg-gray-200" />

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4 pt-3 pb-5">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
            
            <div className="lg:w-2/3">
              <div className="flex items-center gap-2 mb-2">
                 <div className="px-2 py-0.5 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest rounded">Hub</div>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
              </div>
              <h1 className="text-xl md:text-3xl font-black text-gray-950 font-[Playfair_Display] leading-tight tracking-tight mb-3">
                {label}<span className="text-primary italic">.</span>
              </h1>
              
              <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-gray-200/80 bg-white">
                <CategoryHero
                  story={leadStory}
                  hClass="min-h-[200px] md:min-h-[300px] lg:min-h-[340px]"
                  layout="stacked"
                  compact
                />
              </div>
            </div>

            <div className="lg:w-1/3 flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b-2 border-gray-900">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-primary shrink-0" />
                  <h2 className="text-[11px] font-black uppercase tracking-widest font-[Inter]">Latest</h2>
                </div>
                <Link href="/" className="text-[9px] font-black uppercase tracking-widest text-primary hover:opacity-80 font-[Inter]">
                  View all —
                </Link>
              </div>
              <div className="flex flex-col gap-4 flex-1">
                {sideHeadlines.map(story => (
                  <Link key={story.id} href={`/news/${story.slug}`} className="group flex gap-2 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5 ring-2 ring-emerald-600/15" aria-hidden />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 text-[8px] font-bold text-primary uppercase tracking-wider mb-0.5">
                         <span>{story.category}</span>
                         <span className="text-gray-300">·</span>
                         <span className="text-gray-400">{story.timestamp}</span>
                      </div>
                      <h3 className="text-[12px] font-bold text-gray-900 group-hover:text-primary leading-snug transition-colors line-clamp-3 font-[Inter]">
                        {story.title}
                      </h3>
                    </div>
                  </Link>
                ))}
                
                {subcategories.length > 0 && (
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Sections</h3>
                    <div className="flex flex-wrap gap-1.5">
                       {subcategories.slice(0, 6).map(sub => (
                         <Link key={sub.id} href={`/${categorySlug}/${sub.slug}`} className="px-2.5 py-1 bg-gray-50 hover:bg-gray-950 hover:text-white text-[10px] font-black rounded-md border border-gray-100 transition-all font-[Inter]">
                           {sub.name}
                         </Link>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Economy-specific: MarketTicker */}
      {categorySlug === "economy" && <MarketTicker />}

      <div className="max-w-[1280px] mx-auto px-4 py-4 flex-1">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
          
          <main className="flex-1 min-w-0">
            {tagLanes.length > 0 && (
              <CategoryTagRails
                lanes={tagLanes}
                heading="Topic pulse in this desk"
                variant="compact"
              />
            )}

            <div className="mb-6 flex justify-center">
              <AdSlot slotKey="category_hub_leaderboard" />
            </div>

            <div className="mb-8">
               <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-950 font-[Inter] flex items-center gap-3">
                     <div className="w-8 h-0.5 bg-gray-900"></div> Registry
                  </h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  {topRegistry.map(story => (
                    <BigCard key={story.id} story={story} compact />
                  ))}
               </div>
            </div>

            {/* 2. PERSPECTIVE SECTION (Detailed Spotlight) */}
            {detailedSpotlight && (
              <div className="mb-7 md:mb-8 p-0 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                 <div className="md:w-[45%] h-[200px] md:h-auto md:min-h-[240px] relative">
                    <img src={detailedSpotlight.image} alt={detailedSpotlight.title} className="absolute inset-0 w-full h-full object-cover" />
                 </div>
                 <div className="p-4 md:p-5 md:w-[55%] flex flex-col justify-center bg-gray-950 text-white">
                    <div className="text-primary text-[9px] font-black uppercase tracking-widest mb-1.5">Editorial Spotlight</div>
                    <h2 className="text-lg md:text-xl font-black font-[Playfair_Display] leading-tight mb-2">
                      {detailedSpotlight.title}
                    </h2>
                    <p className="text-gray-400 text-[12px] font-[Inter] line-clamp-3 mb-4">
                       {detailedSpotlight.excerpt || "Diving deep into the core issues that define our industry today. This analysis provides unparalleled context and actionable insights."}
                    </p>
                    <Link href={`/news/${detailedSpotlight.slug}`} className="flex items-center gap-3 text-white font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors group">
                       View Perspective <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                 </div>
              </div>
            )}

            {/* 3. EDITORIAL FEED (Standard News Deck) */}
            <div className="mb-8">
               <div className="mb-3 flex flex-col gap-1">
                  <div className="h-1 w-12 bg-primary"></div>
                  <h2 className="text-base md:text-lg font-black text-gray-950 font-[Playfair_Display]">Editorial Feed</h2>
               </div>
               <div className="space-y-4 md:space-y-5">
                  {editorialFeed.map(story => (
                    <HorizontalCard key={story.id} story={story} compact />
                  ))}
               </div>
              {totalPages > 1 && (
                <Pagination basePath={`/${categorySlug}`} currentPage={page} totalPages={totalPages} />
              )}
            </div>

            {page === 1 && archivePosts.length > 0 && (
              <section className="mt-14 pt-10 border-t-2 border-dashed border-gray-200">
                <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary font-[Inter] block mb-1">
                      Full archive
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-950 font-[Playfair_Display]">
                      All news in {label}
                    </h2>
                    <p className="text-[12px] text-gray-500 font-[Inter] mt-1 max-w-xl">
                      Everything after the front page bundle—newest first, paginated so the page stays light.
                    </p>
                  </div>
                </div>
                <ul className="space-y-0 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white overflow-hidden">
                  {archivePosts.map((story) => (
                    <li key={story.id}>
                      <Link
                        href={`/news/${story.slug}`}
                        className="flex gap-3 sm:gap-4 items-start px-4 py-3.5 hover:bg-primary/[0.04] transition-colors group"
                      >
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5 ring-2 ring-primary/20" aria-hidden />
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
                    basePath={`/${categorySlug}`}
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
