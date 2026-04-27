import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Hash, TrendingUp, Newspaper, Clock, ChevronRight, Flame, Zap } from "lucide-react";
import { getNewsFeed } from "@/actions/public";
import Sidebar from "@/components/layout/Sidebar";
import Pagination from "@/components/ui/Pagination";

const PAGE_SIZE = 16;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tagName = decodeURIComponent(slug).replace(/-/g, " ");
  const titleTag = tagName.charAt(0).toUpperCase() + tagName.slice(1);
  const specialTitles = {
    "breaking-news": "Breaking News — Live Alerts",
    "breaking": "Breaking News — Live Alerts",
    "trending": "Trending Now — Most Read Stories",
    "hot-news": "Hot News — Top Stories Right Now",
    "must-read": "Must Read — Editor's Picks",
  };
  return {
    title: (specialTitles[slug] || `#${titleTag} — Topic Hub`) + " | LabourPulse",
    description: `Browse all LabourPulse stories tagged with ${tagName}. Latest breaking news, analysis and reports.`,
  };
}

function fmtDate(p) {
  const d = p?.publishedAt || p?.createdAt;
  if (!d) return "";
  try {
    const now = new Date();
    const pub = new Date(d);
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

// ── Tag config: special visual treatment ────────────────────────────────────
const TAG_CONFIG = {
  "breaking-news": { icon: Zap, color: "#DD0000", bg: "#DD0000", label: "Breaking News", badge: "JUST IN" },
  "breaking":      { icon: Zap, color: "#DD0000", bg: "#DD0000", label: "Breaking News", badge: "JUST IN" },
  "trending":      { icon: TrendingUp, color: "#C41E3A", bg: "#0f172a", label: "Trending Now", badge: "🔥 HOT" },
  "hot-news":      { icon: Flame, color: "#f97316", bg: "#1c0a00", label: "Hot News", badge: "HOT" },
  "must-read":     { icon: Hash, color: "#1E5B8A", bg: "#0c1a2e", label: "Must Read", badge: "EDITOR'S PICK" },
};

// ── Hero story card ──────────────────────────────────────────────────────────
function HeroCard({ post, accentColor }) {
  return (
    <Link href={`/news/${post.slug}`} className="group block mb-8">
      <div className="relative w-full aspect-[21/9] overflow-hidden rounded-sm bg-gray-200 mb-4">
        <Image
          src={imgSrc(post)}
          alt={post.title}
          fill priority unoptimized
          sizes="(max-width:768px) 100vw, 65vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <span
          className="absolute top-3 left-3 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 font-[Inter]"
          style={{ background: accentColor }}
        >
          {catLabel(post)}
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
          <h2 className="text-white text-[20px] md:text-[28px] font-bold font-[Playfair_Display] leading-tight line-clamp-3 mb-2">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-white/70 text-[13px] font-[Inter] line-clamp-2 mb-2">{post.excerpt}</p>
          )}
          <p className="text-white/50 text-[11px] font-[Inter] flex items-center gap-1">
            <Clock size={10} /> {fmtDate(post)}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ── Standard image card ──────────────────────────────────────────────────────
function NewsCard({ post, accentColor }) {
  return (
    <Link href={`/news/${post.slug}`} className="group block">
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm mb-2.5 bg-gray-100">
        <Image
          src={imgSrc(post)}
          alt={post.title}
          fill unoptimized
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 30vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        <span
          className="absolute top-2 left-2 text-white text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 font-[Inter]"
          style={{ background: accentColor }}
        >
          {catLabel(post)}
        </span>
      </div>
      <h3 className="text-[13px] md:text-[14px] font-bold text-gray-900 font-[Playfair_Display] leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1">
        {post.title}
      </h3>
      <p className="text-[10px] text-gray-400 font-[Inter] flex items-center gap-1">
        <Clock size={9} /> {fmtDate(post)}
      </p>
    </Link>
  );
}

// ── Featured row: 1 big left + 2 stacked right ──────────────────────────────
function FeaturedRow({ posts, accentColor }) {
  const [lead, ...rest] = posts;
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 pb-8 border-b border-gray-100">
      {lead && (
        <div className="md:col-span-7">
          <Link href={`/news/${lead.slug}`} className="group block">
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm mb-3 bg-gray-100">
              <Image
                src={imgSrc(lead)}
                alt={lead.title}
                fill unoptimized
                sizes="(max-width:768px) 100vw, 55vw"
                className="object-cover group-hover:scale-105 transition-transform duration-600"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <span
                className="absolute top-2 left-2 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 font-[Inter]"
                style={{ background: accentColor }}
              >
                {catLabel(lead)}
              </span>
            </div>
            <h3 className="text-[17px] md:text-[19px] font-bold text-gray-950 font-[Playfair_Display] leading-snug line-clamp-3 group-hover:text-primary transition-colors mb-1.5">
              {lead.title}
            </h3>
            {lead.excerpt && (
              <p className="text-[13px] text-gray-500 line-clamp-2 font-[Inter] mb-1.5">{lead.excerpt}</p>
            )}
            <p className="text-[10px] text-gray-400 flex items-center gap-1 font-[Inter]">
              <Clock size={9} /> {fmtDate(lead)}
            </p>
          </Link>
        </div>
      )}
      <div className="md:col-span-5 flex flex-col gap-4 md:pl-2 md:border-l md:border-gray-100">
        {rest.slice(0, 3).map((p) => (
          <Link key={p.id} href={`/news/${p.slug}`} className="group flex gap-3 items-start">
            <div className="relative w-[90px] h-[68px] shrink-0 rounded-sm overflow-hidden bg-gray-100">
              <Image src={imgSrc(p)} alt={p.title} fill unoptimized sizes="90px"
                className="object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black uppercase tracking-widest block mb-0.5 font-[Inter]"
                style={{ color: accentColor }}>{catLabel(p)}</span>
              <h4 className="text-[12.5px] font-bold text-gray-900 font-[Inter] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {p.title}
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5 font-[Inter]">{fmtDate(p)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
async function TagPageContent({ slug, page }) {
  const tagName = decodeURIComponent(slug).replace(/-/g, " ");
  const config = TAG_CONFIG[slug] || {
    icon: Hash,
    color: "#C41E3A",
    bg: "#1a1a2e",
    label: `#${tagName}`,
    badge: "TOPIC",
  };

  const [mainRes, sideLatestRes] = await Promise.all([
    getNewsFeed({ tagSlug: slug, page, limit: PAGE_SIZE }),
    page === 1 ? getNewsFeed({ limit: 5 }) : Promise.resolve({ posts: [] }),
  ]);

  const posts = mainRes?.posts || [];
  const totalPages = Math.max(1, mainRes?.totalPages ?? 1);
  const totalCount = mainRes?.total ?? posts.length;

  if (page > totalPages) {
    redirect(totalPages <= 1 ? `/tag/${slug}` : `/tag/${slug}?page=${totalPages}`);
  }

  const sideLatest = (sideLatestRes?.posts || []).filter((p) => !posts.find((q) => q.id === p.id));

  // Split posts for different layout zones
  const heroPost = page === 1 && posts[0];
  const featuredPosts = page === 1 ? posts.slice(1, 5) : [];
  const gridPosts = page === 1 ? posts.slice(5) : posts;

  const IconComponent = config.icon;

  return (
    <div className="bg-white min-h-screen">
      {/* ── HERO HEADER ── */}
      <div
        className="relative py-14 md:py-20 overflow-hidden"
        style={{ background: config.bg }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 -translate-y-1/2 translate-x-1/4"
          style={{ background: config.color }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5 translate-y-1/2 -translate-x-1/4"
          style={{ background: config.color }} />

        <div className="max-w-[1280px] mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] mb-5 font-[Inter]"
              style={{ background: config.color }}
            >
              <IconComponent size={12} />
              {config.badge}
            </div>
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-black text-white font-[Playfair_Display] leading-tight mb-4 italic">
              {config.label}
            </h1>
            {/* Subtitle */}
            <p className="text-white/60 text-[15px] font-[Inter] leading-relaxed mb-6 max-w-2xl">
              All stories tagged{" "}
              <span className="font-bold text-white">#{decodeURIComponent(slug)}</span>
              {" "}— newest first. Updated continuously.
            </p>
            {/* Stats */}
            <div className="flex items-center gap-6 text-[11px] font-bold text-white/50 uppercase tracking-widest font-[Inter]">
              <span className="flex items-center gap-1.5">
                <Newspaper size={13} />
                {totalCount} {totalCount === 1 ? "Story" : "Stories"}
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} /> Updated continuously
              </span>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-white"
          style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }} />
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-[1280px] mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main feed */}
          <main className="flex-1 min-w-0">
            {posts.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-gray-200 rounded-xl">
                <Hash size={48} className="mx-auto mb-4 text-gray-200" />
                <h2 className="text-xl font-bold text-gray-700 font-[Playfair_Display] mb-2">
                  No stories tagged #{decodeURIComponent(slug)} yet
                </h2>
                <p className="text-gray-400 font-[Inter] text-[14px] mb-6">
                  When editors publish stories with this tag, they will appear here.
                </p>
                <Link href="/" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 font-bold text-[13px] font-[Inter] hover:bg-primary-dark transition-colors">
                  ← Back to Home <ChevronRight size={14} />
                </Link>
              </div>
            ) : (
              <>
                {/* Section header */}
                <div className="flex items-center justify-between border-b-[3px] pb-2 mb-6"
                  style={{ borderColor: config.color }}>
                  <h2 className="text-[14px] font-black uppercase tracking-wide text-gray-900 font-[Inter] flex items-center gap-2">
                    <IconComponent size={14} style={{ color: config.color }} />
                    {page === 1 ? "Top Stories" : `Page ${page} — More Stories`}
                  </h2>
                  {totalCount > 0 && (
                    <span className="text-[11px] font-semibold text-gray-400 font-[Inter]">
                      {totalCount} total
                    </span>
                  )}
                </div>

                {/* Page 1: Hero + Featured row + Grid */}
                {heroPost && page === 1 && (
                  <HeroCard post={heroPost} accentColor={config.color} />
                )}

                {featuredPosts.length > 0 && (
                  <FeaturedRow posts={featuredPosts} accentColor={config.color} />
                )}

                {/* Standard 3-col grid */}
                {gridPosts.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {gridPosts.map((p) => (
                      <NewsCard key={p.id} post={p} accentColor={config.color} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <Pagination
                  basePath={`/tag/${slug}`}
                  currentPage={page}
                  totalPages={totalPages}
                />
              </>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:w-[300px] shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Latest news block in sidebar */}
              {sideLatest.length > 0 && (
                <div className="bg-gray-50 border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-900">
                    <Clock size={13} className="text-primary shrink-0" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 font-[Inter]">
                      Latest Across Site
                    </h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    {sideLatest.slice(0, 5).map((p) => (
                      <Link key={p.id} href={`/news/${p.slug}`} className="group flex gap-3 items-start">
                        <div className="relative w-14 h-11 shrink-0 rounded-sm overflow-hidden bg-gray-200">
                          <Image src={imgSrc(p)} alt={p.title} fill unoptimized sizes="56px"
                            className="object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11.5px] font-semibold text-gray-900 font-[Inter] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {p.title}
                          </p>
                          <p className="text-[9.5px] text-gray-400 mt-0.5 font-[Inter]">{fmtDate(p)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related tag links */}
              <div className="bg-white border border-gray-100 p-4">
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 font-[Inter] mb-4 pb-2 border-b-2 border-gray-900">
                  Other Topics
                </h2>
                <div className="flex flex-wrap gap-2">
                  {["breaking-news","trending","hot-news","must-read","politics","economy","labour","international","health","business","technology"].filter(t => t !== slug).map((t) => (
                    <Link
                      key={t}
                      href={`/tag/${t}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 border border-gray-200 text-[11px] font-bold text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-all font-[Inter]"
                    >
                      <Hash size={9} /> {t.replace(/-/g, " ")}
                    </Link>
                  ))}
                </div>
              </div>

              <Sidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default async function TagPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.page, 10) || 1);

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-[1280px] px-4">
          <div className="h-48 bg-gray-100 rounded-sm" />
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-gray-100 rounded-sm" />)}
          </div>
        </div>
      </div>
    }>
      <TagPageContent slug={slug} page={page} />
    </Suspense>
  );
}
