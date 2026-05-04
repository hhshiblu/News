import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Hash, TrendingUp, Newspaper, Clock, ChevronRight, Flame, Zap } from "lucide-react";
import { getNewsFeed } from "@/actions/public";
import Sidebar from "@/components/layout/Sidebar";
import LoadMoreFeed from "@/components/news/LoadMoreFeed";

const PAGE_SIZE = 20; // enough for hero zones + feed

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

// ── Tag config: visual treatment ──
const TAG_CONFIG = {
  "breaking-news": { icon: Zap, color: "#DD0000", tint: "#fff5f5", label: "Breaking News", badge: "JUST IN" },
  "breaking":      { icon: Zap, color: "#DD0000", tint: "#fff5f5", label: "Breaking News", badge: "JUST IN" },
  "trending":      { icon: TrendingUp, color: "#C41E3A", tint: "#fef2f2", label: "Trending Now", badge: "🔥 HOT" },
  "hot-news":      { icon: Flame, color: "#f97316", tint: "#fff7ed", label: "Hot News", badge: "HOT" },
  "must-read":     { icon: Hash, color: "#1E5B8A", tint: "#eff6ff", label: "Must Read", badge: "EDITOR'S PICK" },
};

// ── Panoramic Hero Card ──
function PanoramicHero({ post, accentColor }) {
  return (
    <Link href={`/news/${post.slug}`} className="group block mb-8">
      <div className="relative w-full aspect-[21/9] overflow-hidden rounded-xl bg-gray-200 shadow-sm">
        <Image
          src={imgSrc(post)}
          alt={post.title}
          fill priority unoptimized
          sizes="(max-width:768px) 100vw, 65vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
        <span
          className="absolute top-4 left-4 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-sm font-[Inter]"
          style={{ background: accentColor }}
        >
          {catLabel(post)}
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
          <h2 className="text-white text-[22px] md:text-[30px] font-bold font-[Playfair_Display] leading-tight line-clamp-3 mb-2">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-white/70 text-[13px] font-[Inter] line-clamp-2 mb-2 max-w-2xl">{post.excerpt}</p>
          )}
          <p className="text-white/50 text-[11px] font-[Inter] flex items-center gap-1">
            <Clock size={10} /> {fmtDate(post)}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ── Asymmetric Featured Row: 1 tall left + 3 stacked right ──
function AsymmetricFeatured({ posts, accentColor }) {
  const [lead, ...rest] = posts;
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8 pb-8 border-b border-gray-100">
      {lead && (
        <div className="md:col-span-7">
          <Link href={`/news/${lead.slug}`} className="group block">
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg mb-3 bg-gray-100">
              <Image
                src={imgSrc(lead)} alt={lead.title} fill unoptimized
                sizes="(max-width:768px) 100vw, 55vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <span
                className="absolute top-3 left-3 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 font-[Inter] rounded-sm"
                style={{ background: accentColor }}
              >
                {catLabel(lead)}
              </span>
            </div>
            <h3 className="text-[18px] md:text-[20px] font-bold text-gray-950 font-[Playfair_Display] leading-snug line-clamp-3 group-hover:text-primary transition-colors mb-2">
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
      <div className="md:col-span-5 flex flex-col gap-4 md:pl-4 md:border-l md:border-gray-100">
        {rest.slice(0, 3).map((p) => (
          <Link key={p.id} href={`/news/${p.slug}`} className="group flex gap-3 items-start">
            <div className="relative w-[90px] h-[68px] shrink-0 rounded-lg overflow-hidden bg-gray-100">
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


// ── Main page ──
async function TagPageContent({ slug }) {
  const tagName = decodeURIComponent(slug).replace(/-/g, " ");
  const config = TAG_CONFIG[slug] || {
    icon: Hash,
    color: "#C41E3A",
    tint: "#fef2f2",
    label: `#${tagName}`,
    badge: "TOPIC",
  };

  const [mainRes, sideLatestRes] = await Promise.all([
    getNewsFeed({ tagSlug: slug, page: 1, limit: PAGE_SIZE }),
    getNewsFeed({ limit: 5 }),
  ]);

  const posts = mainRes?.posts || [];
  const totalCount = mainRes?.total ?? posts.length;

  if (posts.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="py-20 text-center max-w-[1280px] mx-auto px-4">
          <Hash size={48} className="mx-auto mb-4 text-gray-200" />
          <h2 className="text-xl font-bold text-gray-700 font-[Playfair_Display] mb-2">
            No stories tagged #{decodeURIComponent(slug)} yet
          </h2>
          <p className="text-gray-400 font-[Inter] text-[14px] mb-6">
            When editors publish stories with this tag, they will appear here.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 font-bold text-[13px] font-[Inter] rounded-lg hover:bg-primary-dark transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const sideLatest = (sideLatestRes?.posts || []).filter((p) => !posts.find((q) => q.id === p.id));

  // Split posts for zones
  const heroPost = posts[0];
  const featuredPosts = posts.slice(1, 5);
  const feedPosts = posts.slice(5);
  const consumed = Math.min(posts.length, 5); // hero(1) + featured(4)

  const IconComponent = config.icon;

  return (
    <div className="bg-white min-h-screen">
      {/* ━━━ ZONE 1: Light Tinted Header ━━━ */}
      <div
        className="relative py-12 md:py-16 overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${config.tint} 0%, #ffffff 100%)` }}
      >
        {/* Decorative circles (light) */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 -translate-y-1/2 translate-x-1/4"
          style={{ background: config.tint }} />

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
            <h1 className="text-3xl md:text-5xl font-black text-gray-950 font-[Playfair_Display] leading-tight mb-3 italic">
              {config.label}
            </h1>
            {/* Subtitle */}
            <p className="text-gray-500 text-[14px] font-[Inter] leading-relaxed mb-5 max-w-2xl">
              All stories tagged{" "}
              <span className="font-bold text-gray-900">#{decodeURIComponent(slug)}</span>
              {" "}— newest first. Updated continuously.
            </p>
            {/* Stats */}
            <div className="flex items-center gap-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest font-[Inter]">
              <span className="flex items-center gap-1.5">
                <Newspaper size={13} />
                {totalCount} {totalCount === 1 ? "Story" : "Stories"}
              </span>
              <span className="text-gray-200">|</span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} /> Updated continuously
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ CONTENT ━━━ */}
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main feed */}
          <main className="flex-1 min-w-0">
            {/* Section header */}
            <div className="flex items-center justify-between border-b-[3px] pb-2 mb-6"
              style={{ borderColor: config.color }}>
              <h2 className="text-[14px] font-black uppercase tracking-wide text-gray-900 font-[Inter] flex items-center gap-2">
                <IconComponent size={14} style={{ color: config.color }} />
                Top Stories
              </h2>
              {totalCount > 0 && (
                <span className="text-[11px] font-semibold text-gray-400 font-[Inter]">
                  {totalCount} total
                </span>
              )}
            </div>

            {/* ━━━ ZONE 2: Panoramic Hero ━━━ */}
            <PanoramicHero post={heroPost} accentColor={config.color} />

            {/* ━━━ ZONE 3: Asymmetric Featured ━━━ */}
            {featuredPosts.length > 0 && (
              <AsymmetricFeatured posts={featuredPosts} accentColor={config.color} />
            )}

            {/* ━━━ ZONE 5: Staggered Feed + Load More ━━━ */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-0.5 w-8" style={{ background: config.color }} />
                <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-950 font-[Inter]">
                  More Tagged Stories
                </h2>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <LoadMoreFeed
                initialPosts={feedPosts.slice(0, 10)}
                fetchParams={{ tagSlug: slug }}
                endpoint="/public/posts"
                limit={10}
                offset={consumed}
                totalFromServer={totalCount > consumed ? totalCount - consumed : undefined}
                buttonLabel={`Load More #${decodeURIComponent(slug)}`}
                buttonClass="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-dark uppercase tracking-widest shadow-sm hover:shadow-md"
                variant="tag"
              />
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-[300px] shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Latest news block */}
              {sideLatest.length > 0 && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-900">
                    <Clock size={13} className="text-primary shrink-0" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 font-[Inter]">
                      Latest Across Site
                    </h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    {sideLatest.slice(0, 5).map((p) => (
                      <Link key={p.id} href={`/news/${p.slug}`} className="group flex gap-3 items-start">
                        <div className="relative w-14 h-11 shrink-0 rounded-md overflow-hidden bg-gray-200">
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
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 font-[Inter] mb-4 pb-2 border-b-2 border-gray-900">
                  Other Topics
                </h2>
                <div className="flex flex-wrap gap-2">
                  {["breaking-news","trending","hot-news","must-read","politics","economy","labour","international","health","business","technology"].filter(t => t !== slug).map((t) => (
                    <Link
                      key={t}
                      href={`/tag/${t}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-[11px] font-bold text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-all font-[Inter]"
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

export default async function TagPage({ params }) {
  const { slug } = await params;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-[1280px] px-4">
          <div className="h-48 bg-gray-100 rounded-xl" />
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-gray-100 rounded-xl" />)}
          </div>
        </div>
      </div>
    }>
      <TagPageContent slug={slug} />
    </Suspense>
  );
}
