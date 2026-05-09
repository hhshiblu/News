import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getReporterBySlug, getNewsFeed } from "@/actions/public";
import Pagination from "@/components/ui/Pagination";
import { CategoryTagRails } from "@/components/category/CategoryDeskRails";
import AdSlot from "@/components/ads/AdSlot";
import { buildTagLanes } from "@/lib/postLanes";

const PAGE_SIZE = 12;
const LANE_SAMPLE = 80;

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.page, 10) || 1);
  const res = await getReporterBySlug(slug, { page, limit: PAGE_SIZE });
  const name = res?.data?.reporter?.name;
  const base = name ? `${name} — LabourPulse` : "Reporter";
  return {
    title: page > 1 ? `${base} (Page ${page})` : base,
    description: res?.data?.author?.bio || "",
  };
}

async function ReporterSlugPageContent({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  let page = Math.max(1, parseInt(sp?.page, 10) || 1);

  const res = await getReporterBySlug(slug, { page, limit: PAGE_SIZE });
  const payload = res?.success ? res.data : null;
  const reporter = payload?.reporter;
  const posts = payload?.posts || [];
  const pagination = payload?.pagination || {
    page: 1,
    limit: PAGE_SIZE,
    total: posts.length,
    totalPages: 1,
  };
  const totalPages = Math.max(1, pagination.totalPages || 1);
  const totalStories = pagination.total ?? posts.length;

  if (page > totalPages) {
    redirect(totalPages <= 1 ? `/reporter/${slug}` : `/reporter/${slug}?page=${totalPages}`);
  }

  if (!reporter) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-gray-900 font-[Playfair_Display] mb-2">
          Reporter not found
        </h1>
        <Link href="/" className="text-primary font-semibold text-sm hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  let tagLanes = [];
  if (page === 1 && reporter.id) {
    const feed = await getNewsFeed({ authorId: reporter.id, limit: LANE_SAMPLE });
    const sample = feed.posts || [];
    tagLanes = buildTagLanes(sample, 4, 5);
  }

  const socials = reporter.socials && typeof reporter.socials === "object" ? reporter.socials : {};
  const basePath = `/reporter/${encodeURIComponent(slug)}`;

  return (
    <div className="bg-[#fafafa] min-h-screen flex flex-col">
      <header className="relative overflow-hidden border-b border-gray-200 bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-[#0f172a]/[0.04] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[min(50vw,420px)] h-full bg-primary/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="relative max-w-[1200px] mx-auto px-4 py-8 md:py-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/30 to-primary/5 blur-xl opacity-80" />
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-xl ring-1 ring-gray-100">
                <Image
                  src={reporter.avatar || "/placeholder.jpg"}
                  alt={reporter.name}
                  fill
                  className="object-cover"
                  sizes="176px"
                  unoptimized
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">
                LabourPulse contributor
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-950 font-[Playfair_Display] tracking-tight mb-2">
                {reporter.name}
              </h1>
              {reporter.position && (
                <p className="text-xs font-semibold text-gray-500 font-[Inter] mb-2">{reporter.position}</p>
              )}
              <p className="text-[13px] text-gray-600 font-[Inter] leading-relaxed max-w-2xl mx-auto md:mx-0 mb-4">
                {reporter.bio || "Journalist and contributor to LabourPulse."}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm">
                <span className="px-2.5 py-0.5 rounded-full bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider">
                  {reporter.role?.replace("_", " ") || "Reporter"}
                </span>
                <span className="text-gray-400 text-[12px] font-[Inter]">
                  {totalStories} stor{totalStories === 1 ? "y" : "ies"} published
                </span>
              </div>
              {(socials.twitter || socials.linkedin || socials.website || socials.email) && (
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                  {socials.website && (
                    <a
                      href={socials.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5"
                    >
                      Website
                    </a>
                  )}
                  {socials.twitter && (
                    <a
                      href={socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                    >
                      X / Twitter
                    </a>
                  )}
                  {socials.linkedin && (
                    <a
                      href={socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                    >
                      LinkedIn
                    </a>
                  )}
                  {socials.email && (
                    <a
                      href={`mailto:${socials.email}`}
                      className="text-xs font-bold text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                    >
                      Email
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-[1200px] w-full mx-auto px-4 py-6 md:py-8">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 font-[Inter] py-16">No published stories yet.</p>
        ) : (
          <>
            {page === 1 && tagLanes.length > 0 && (
              <CategoryTagRails
                lanes={tagLanes}
                heading="Top tags on this byline"
                variant="author"
              />
            )}

            {page === 1 && (
              <div className="mb-6 flex justify-center">
                <AdSlot slotKey="author_page_leaderboard" />
              </div>
            )}

            <section>
              <div className="flex flex-wrap items-end justify-between gap-3 mb-4 border-b-2 border-gray-900 pb-2">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-950 font-[Playfair_Display]">
                    All stories
                  </h2>
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest font-[Inter]">
                    Newest first
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {posts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/news/${p.slug}`}
                    className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all overflow-hidden"
                  >
                    <div className="relative aspect-[16/10] bg-gray-100">
                      <Image
                        src={p.featuredImage || "/placeholder.jpg"}
                        alt=""
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 33vw"
                        unoptimized
                      />
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest mb-0.5">
                        {p.category?.name || "News"}
                      </span>
                      <h3 className="text-[13px] font-bold text-gray-900 font-[Inter] leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {p.title}
                      </h3>
                      <time className="mt-auto pt-2 text-[10px] text-gray-400 font-semibold">
                        {formatDate(p.publishedAt)}
                      </time>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <Pagination basePath={basePath} currentPage={page} totalPages={totalPages} />
          </>
        )}
      </div>
    </div>
  );
}

function ReporterPageSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 animate-pulse">
      <div className="h-28 bg-gray-200 rounded-2xl mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="h-52 bg-gray-200 rounded-xl" />
        <div className="h-52 bg-gray-200 rounded-xl" />
        <div className="h-52 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

export default function ReporterSlugPage(props) {
  return (
    <Suspense fallback={<ReporterPageSkeleton />}>
      <ReporterSlugPageContent {...props} />
    </Suspense>
  );
}
