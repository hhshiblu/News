import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { AlertTriangle, Clock, ChevronRight, Share2 } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Pagination from "@/components/ui/Pagination";
import { getNewsFeed } from "@/actions/public";

const PAGE_SIZE = 12;
const MORE_SIZE = 6;
/** Matches ticker: posts tagged breaking-news OR breaking */
const BREAKING_TAG_PARAM = "breaking-news,breaking";

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.page, 10) || 1);
  const titleBase = "Breaking News — Real-time Alerts — LabourPulse";
  return {
    title: page > 1 ? `${titleBase} (Page ${page})` : titleBase,
    description:
      "Stay informed with real-time news alerts on the most critical global and national developments.",
  };
}

function fmtDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

function catLabel(p) {
  if (typeof p.category === "object" && p.category?.name) return p.category.name;
  return p.category || "News";
}

function storyImage(p) {
  return p.featuredImage || p.image || "/placeholder.jpg";
}

export default async function BreakingNewsPage({ searchParams }) {
  const sp = await searchParams;
  let page = Math.max(1, parseInt(sp?.page, 10) || 1);

  const [breakingRes, moreRes] = await Promise.all([
    getNewsFeed({
      tagSlugs: BREAKING_TAG_PARAM,
      page,
      limit: PAGE_SIZE,
    }),
    page === 1
      ? getNewsFeed({ page: 1, limit: MORE_SIZE })
      : Promise.resolve({ posts: [] }),
  ]);

  const posts = breakingRes.posts || [];
  const totalPages = Math.max(1, breakingRes.totalPages ?? 1);

  if (page > totalPages) {
    redirect(totalPages <= 1 ? "/breaking" : `/breaking?page=${totalPages}`);
  }

  const moreStories = page === 1 ? moreRes.posts || [] : [];

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-breaking py-16 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
          <div className="w-[800px] h-[800px] bg-white rounded-full animate-pulse border-[40px]" />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="bg-white text-breaking px-4 py-1 font-bold text-[11px] tracking-[0.3em] uppercase mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-breaking animate-pulse" />
              Live Reporting
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-[Playfair_Display] italic tracking-tighter mb-4">
              Breaking News Hub
            </h1>
            <p className="max-w-2xl text-lg text-white/80 font-[Inter] mb-8 font-medium">
              Stories tagged <span className="text-white font-semibold">breaking-news</span> or{" "}
              <span className="text-white font-semibold">breaking</span>, newest first. Paginated for
              easier reading.
            </p>
            <div className="flex items-center gap-4 text-[12px] font-bold text-white uppercase tracking-widest font-[Inter]">
              <span className="flex items-center gap-1.5">
                <AlertTriangle size={15} /> 24/7 Monitoring
              </span>
              <span className="text-white/40">|</span>
              <span className="flex items-center gap-1.5">
                <Clock size={15} /> Updated live
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0">
            <div className="mb-12">
              <div className="flex items-center justify-between border-b-[3px] border-breaking pb-2.5 mb-6 flex-wrap gap-2">
                <h2 className="text-[17px] font-bold uppercase tracking-tight text-gray-900 font-[Inter]">
                  Critical alerts
                </h2>
                {breakingRes.total != null && (
                  <span className="text-[11px] font-semibold text-gray-400 font-[Inter]">
                    {breakingRes.total} stor{breakingRes.total === 1 ? "y" : "ies"} tagged
                  </span>
                )}
              </div>

              {posts.length === 0 ? (
                <p className="text-[15px] text-gray-500 font-[Inter] py-8 border border-dashed border-gray-200 rounded-xl px-6">
                  No breaking-tagged posts right now. When editors tag stories with{" "}
                  <strong>breaking-news</strong> or <strong>breaking</strong>, they will appear here.
                </p>
              ) : (
                <div className="space-y-4">
                  {posts.map((alert) => (
                    <div
                      key={alert.id}
                      className="bg-red-50/50 border-l-4 border-breaking p-6 flex flex-col sm:flex-row items-start gap-5 group hover:bg-red-50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-breaking">
                        <Clock size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-breaking uppercase tracking-widest font-[Inter] block mb-2">
                          Just in · {catLabel(alert)}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 font-[Playfair_Display] group-hover:text-breaking transition-colors mb-4 line-clamp-2">
                          {alert.title}
                        </h3>
                        {alert.excerpt && (
                          <p className="text-[13px] text-gray-600 font-[Inter] line-clamp-2 mb-3">
                            {alert.excerpt}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4">
                          <Link
                            href={`/news/${alert.slug}`}
                            className="text-[13px] font-bold text-breaking flex items-center gap-1 hover:underline"
                          >
                            Read full story <ChevronRight size={14} />
                          </Link>
                          <span className="text-[12px] text-gray-400 font-[Inter] flex items-center gap-1">
                            <Clock size={14} />
                            {fmtDate(alert.publishedAt)}
                          </span>
                          <span className="text-[13px] font-bold text-gray-400 flex items-center gap-1.5 opacity-60 cursor-not-allowed">
                            <Share2 size={14} /> Share
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Pagination basePath="/breaking" currentPage={page} totalPages={totalPages} />
            </div>

            {moreStories.length > 0 && (
              <div>
                <div className="flex items-center justify-between border-b-[3px] border-primary pb-2.5 mb-6">
                  <h2 className="text-[17px] font-bold uppercase tracking-tight text-gray-900 font-[Inter]">
                    Latest across the site
                  </h2>
                  <Link
                    href="/"
                    className="text-[11px] font-bold text-primary uppercase tracking-widest hover:underline font-[Inter]"
                  >
                    Home →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {moreStories.map((story) => (
                    <Link key={story.id} href={`/news/${story.slug}`} className="group cursor-pointer">
                      <div className="aspect-video relative overflow-hidden rounded mb-4 bg-gray-100">
                        <Image
                          src={storyImage(story)}
                          alt=""
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width:768px) 100vw, 35vw"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-primary uppercase tracking-widest font-[Inter] block mb-2">
                        {catLabel(story)}
                      </span>
                      <h4 className="text-xl font-bold text-gray-900 font-[Playfair_Display] group-hover:text-primary transition-colors leading-snug">
                        {story.title}
                      </h4>
                      {story.excerpt && (
                        <p className="text-[13px] text-gray-500 font-[Inter] mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {story.excerpt}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>

          <aside className="lg:w-[310px] shrink-0">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
