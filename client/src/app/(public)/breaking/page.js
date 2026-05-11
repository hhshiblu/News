import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Zap, Clock, ChevronRight } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Pagination from "@/components/ui/Pagination";
import MosaicNewsGrid from "@/components/news/MosaicNewsGrid";
import HorizontalCard from "@/components/news/HorizontalCard";
import { getNewsFeed } from "@/actions/public";

const PAGE_SIZE = 15;

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.page, 10) || 1);
  const base = "Breaking News — Live Alerts | LabourPulse";
  return {
    title: page > 1 ? `${base} (Page ${page})` : base,
    description: "Stay informed with real-time breaking news alerts on the most critical national and global developments.",
  };
}

function fmtDate(iso) {
  if (!iso) return "";
  try {
    const now = new Date();
    const pub = new Date(iso);
    const diffMs = now - pub;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return pub.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return ""; }
}
function catLabel(p) {
  return typeof p.category === "object" ? p.category?.name : p.category || "News";
}
function imgSrc(p) {
  return p?.featuredImage || p?.image || "/placeholder.jpg";
}

// Hero card: full-width big image with overlay title
function BreakingHero({ post }) {
  return (
    <Link href={`/news/${post.slug}`} className="group block mb-8">
      <div className="relative w-full aspect-21/9 overflow-hidden bg-gray-200">
        <Image
          src={imgSrc(post)}
          alt={post.title}
          fill priority unoptimized
          sizes="(max-width:768px) 100vw, 65vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
        <span className="absolute top-3 left-3 bg-breaking text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 font-[Inter] flex items-center gap-1">
          <Zap size={9} className="fill-white" /> Breaking
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
          <h2 className="text-white text-[22px] md:text-[30px] font-bold font-[Playfair_Display] leading-tight line-clamp-3 mb-2">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-white/70 text-[13px] font-[Inter] line-clamp-2 mb-2">{post.excerpt}</p>
          )}
          <p className="text-white/50 text-[11px] font-[Inter] flex items-center gap-1.5">
            <Clock size={10} /> {fmtDate(post.publishedAt || post.createdAt)}
            <span className="text-white/30 mx-1">·</span>
            <span>{catLabel(post)}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}

// Standard image card
function BreakingCard({ post }) {
  return (
    <Link href={`/news/${post.slug}`} className="group block">
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100 mb-2.5">
        <Image
          src={imgSrc(post)}
          alt={post.title}
          fill unoptimized
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 30vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
        <span className="absolute top-2 left-2 bg-breaking text-white text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 font-[Inter]">
          Breaking
        </span>
      </div>
      <h3 className="text-[13px] md:text-[14px] font-bold text-gray-900 font-[Playfair_Display] leading-snug line-clamp-2 group-hover:text-breaking transition-colors mb-1">
        {post.title}
      </h3>
      <p className="text-[10px] text-gray-400 font-[Inter] flex items-center gap-1">
        <Clock size={9} /> {fmtDate(post.publishedAt || post.createdAt)}
      </p>
    </Link>
  );
}

// Featured 1+2 row
function BreakingFeaturedRow({ posts }) {
  const [lead, ...rest] = posts;
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8 pb-8 border-b border-red-100">
      {lead && (
        <div className="md:col-span-7">
          <Link href={`/news/${lead.slug}`} className="group block">
            <div className="relative w-full aspect-video overflow-hidden bg-gray-100 mb-3">
              <Image
                src={imgSrc(lead)}
                alt={lead.title}
                fill unoptimized
                sizes="(max-width:768px) 100vw, 55vw"
                className="object-cover group-hover:scale-105 transition-transform duration-600"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              <span className="absolute top-2 left-2 bg-breaking text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 font-[Inter] flex items-center gap-1">
                <Zap size={8} className="fill-white" /> Just in
              </span>
            </div>
            <h3 className="text-[17px] md:text-[20px] font-bold text-gray-950 font-[Playfair_Display] leading-snug line-clamp-3 group-hover:text-breaking transition-colors mb-1.5">
              {lead.title}
            </h3>
            {lead.excerpt && (
              <p className="text-[13px] text-gray-500 line-clamp-2 font-[Inter] mb-1.5">{lead.excerpt}</p>
            )}
            <p className="text-[10px] text-gray-400 flex items-center gap-1 font-[Inter]">
              <Clock size={9} /> {fmtDate(lead.publishedAt)}
            </p>
          </Link>
        </div>
      )}
      <div className="md:col-span-5 flex flex-col gap-4 md:pl-2 md:border-l md:border-red-100">
        {rest.slice(0, 3).map((p) => (
          <Link key={p.id} href={`/news/${p.slug}`} className="group flex gap-3 items-start">
            <div className="relative w-[90px] h-[68px] shrink-0 overflow-hidden bg-gray-100">
              <Image src={imgSrc(p)} alt={p.title} fill unoptimized sizes="90px"
                className="object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-breaking uppercase tracking-widest block mb-0.5 font-[Inter]">
                {catLabel(p)}
              </span>
              <h4 className="text-[12.5px] font-bold text-gray-900 font-[Inter] leading-snug line-clamp-2 group-hover:text-breaking transition-colors">
                {p.title}
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5 font-[Inter]">{fmtDate(p.publishedAt)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function BreakingNewsPage({ searchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.page, 10) || 1);

  const [breakingRes, latestRes] = await Promise.all([
    getNewsFeed({ tagSlugs: "breaking-news,breaking", page, limit: PAGE_SIZE }),
    page === 1 ? getNewsFeed({ limit: 5 }) : Promise.resolve({ posts: [] }),
  ]);

  const posts = breakingRes?.posts || [];
  const totalPages = Math.max(1, breakingRes?.totalPages ?? 1);
  const totalCount = breakingRes?.total ?? posts.length;

  if (page > totalPages) {
    redirect(totalPages <= 1 ? "/breaking" : `/breaking?page=${totalPages}`);
  }

  const latestSide = (latestRes?.posts || []).filter((p) => !posts.find((q) => q.id === p.id));

  // Split layout zones
  const heroPart = page === 1 ? posts.slice(0, 1) : [];
  const featPart = page === 1 ? posts.slice(1, 5) : [];
  const gridPart = page === 1 ? posts.slice(5) : posts;

  return (
    <div className="bg-white min-h-screen">
      {/* ── HEADER ── */}
      <div className="bg-breaking py-14 md:py-18 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-60 border-white" />
        </div>
        <div className="max-w-[1280px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white text-breaking px-4 py-1.5 font-black text-[10px] tracking-[0.3em] uppercase mb-5 font-[Inter]">
            <span className="w-2 h-2 rounded-full bg-breaking animate-pulse" />
            24/7 Monitoring
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-[Playfair_Display] italic text-white tracking-tighter mb-3">
            Breaking News Hub
          </h1>
          <p className="max-w-2xl mx-auto text-white/70 font-[Inter] text-[15px] mb-5">
            Real-time critical alerts tagged{" "}
            <span className="text-white font-semibold">breaking-news</span> or{" "}
            <span className="text-white font-semibold">breaking</span>, newest first.
          </p>
          <div className="flex items-center justify-center gap-6 text-[11px] font-bold text-white/60 uppercase tracking-widest font-[Inter]">
            <span className="flex items-center gap-1.5"><Zap size={12} className="fill-white/60" /> {totalCount} stories</span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5"><Clock size={12} /> Updated live</span>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-[1280px] mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <main className="flex-1 min-w-0">
            {posts.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-red-100 rounded-xl">
                <Zap size={48} className="mx-auto mb-4 text-red-100" />
                <h2 className="text-xl font-bold text-gray-700 font-[Playfair_Display] mb-2">
                  No breaking stories right now
                </h2>
                <p className="text-gray-400 font-[Inter] text-[14px] mb-6">
                  When editors tag stories with <strong>breaking-news</strong> or <strong>breaking</strong>, they appear here instantly.
                </p>
                <Link href="/" className="inline-flex items-center gap-1.5 bg-breaking text-white px-6 py-2.5 font-bold text-[13px] font-[Inter]">
                  ← Back to Home <ChevronRight size={14} />
                </Link>
              </div>
            ) : (
              <>
                {/* Section label */}
                <div className="flex items-center justify-between border-b-[3px] border-breaking pb-2 mb-6">
                  <h2 className="text-[14px] font-black uppercase tracking-wide text-gray-900 font-[Inter] flex items-center gap-2">
                    <Zap size={13} className="text-breaking fill-breaking" />
                    {page === 1 ? "Critical Alerts" : `Page ${page}`}
                  </h2>
                  {totalCount > 0 && (
                    <span className="text-[11px] text-gray-400 font-[Inter]">{totalCount} total tagged</span>
                  )}
                </div>

                {/* Hero */}
                {heroPart[0] && <BreakingHero post={heroPart[0]} />}

                {/* Featured 1+3 row */}
                {featPart.length > 0 && <BreakingFeaturedRow posts={featPart} />}

                {/* Mosaic grid gallery */}
                {gridPart.length > 0 && (
                  <div className="mb-8">
                    <MosaicNewsGrid posts={gridPart} variant="breaking" />
                  </div>
                )}

                {gridPart.length > 15 && (
                  <section className="mb-8 space-y-4 md:space-y-5">
                    {gridPart.slice(15).map((post) => (
                      <HorizontalCard
                        key={`break-list-${post.id}`}
                        story={{
                          ...post,
                          image: imgSrc(post),
                          reporter: post.reporter?.name || "Staff Reporter",
                          category: catLabel(post),
                          timestamp: fmtDate(post.publishedAt || post.createdAt),
                        }}
                        compact
                      />
                    ))}
                  </section>
                )}

                <Pagination basePath="/breaking" currentPage={page} totalPages={totalPages} />
              </>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:w-[300px] shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Latest at a glance */}
              {latestSide.length > 0 && (
                <div className="border border-gray-100 p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-900">
                    <Clock size={12} className="text-primary shrink-0" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] font-[Inter]">
                      Latest Across Site
                    </h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    {latestSide.map((p) => (
                      <Link key={p.id} href={`/news/${p.slug}`} className="group flex gap-3 items-start">
                        <div className="relative w-14 h-11 shrink-0 overflow-hidden bg-gray-200">
                          <Image src={imgSrc(p)} alt={p.title} fill unoptimized sizes="56px"
                            className="object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11.5px] font-semibold text-gray-900 font-[Inter] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {p.title}
                          </p>
                          <p className="text-[9.5px] text-gray-400 mt-0.5 font-[Inter]">{fmtDate(p.publishedAt)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <Sidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
