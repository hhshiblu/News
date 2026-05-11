import { getPublicStoryBySlugAction } from "@/actions/public-extra.action";
import { getNewsFeed } from "@/actions/public";
import { Clock, Share2, ArrowLeft, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import StoryReadingSidebar from "@/components/stories/StoryReadingSidebar";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const story = await getPublicStoryBySlugAction(slug);
  if (!story) return { title: "Story Not Found" };
  return {
    title: `${story.title} — Stories — LabourPulse`,
    description: story.title,
  };
}

function mergeBreaking(a, b) {
  const seen = new Set();
  const out = [];
  for (const p of [...(a || []), ...(b || [])]) {
    if (!p?.id || seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
  }
  return out;
}

export default async function StoryDetailPage({ params }) {
  const { slug } = await params;
  const [story, latestRes, breakingA, breakingB, trendingHot, trendingFeatured] =
    await Promise.all([
      getPublicStoryBySlugAction(slug),
      getNewsFeed({ limit: 10 }),
      getNewsFeed({ tagSlug: "breaking-news", limit: 8 }),
      getNewsFeed({ tagSlug: "breaking", limit: 8 }),
      getNewsFeed({ tagSlug: "hot-news", limit: 10 }),
      getNewsFeed({ featured: "true", limit: 10 }),
    ]);

  if (!story) notFound();

  const mergedBreaking = mergeBreaking(breakingA?.posts, breakingB?.posts);
  const breakingNews =
    mergedBreaking.length > 0
      ? mergedBreaking
      : (latestRes?.posts || []).slice(0, 5);

  const latestNews = (latestRes?.posts || []).slice(0, 6);
  const trendingSource =
    (trendingHot?.posts || []).length > 0 ? trendingHot.posts : trendingFeatured?.posts || [];
  const trendingNews = trendingSource.slice(0, 6);

  return (
    <main className="bg-[#fafafa] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          <article className="flex-1 min-w-0 rounded-2xl border border-gray-100 bg-white p-5 md:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <Link
                href="/stories"
                className="inline-flex items-center gap-2 text-gray-500 text-[12px] font-semibold uppercase tracking-wider hover:text-primary transition-colors font-[Inter]"
              >
                <ArrowLeft size={14} aria-hidden /> Back to stories
              </Link>
              <span className="px-2.5 py-1 bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-widest rounded-md border border-primary/15 font-[Inter]">
                Feature narrative
              </span>
            </div>

            <header className="mb-8 space-y-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-950 font-[Playfair_Display] leading-tight tracking-tight">
                {story.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100 text-[12px] md:text-[13px] text-gray-600 font-[Inter]">
                <span className="inline-flex items-center gap-2 font-medium">
                  <Clock size={14} className="text-primary shrink-0" aria-hidden />
                  {new Date(story.createdAt).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-2 font-medium">
                  <BookOpen size={14} className="text-primary shrink-0" aria-hidden />
                  Long read
                </span>
              </div>
            </header>

            {story.thumbnailImage && (
              <div className="relative aspect-video mb-8 rounded-xl overflow-hidden border border-gray-100 bg-gray-100">
                <Image
                  src={story.thumbnailImage}
                  alt={story.title || ""}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  priority
                />
              </div>
            )}

            <div className="article-body-readable max-w-none text-[13px] md:text-[14px] leading-relaxed text-gray-800 font-[Inter] [&_p]:mb-4 [&_p]:leading-relaxed [&_h2]:text-lg [&_h2]:md:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-[Playfair_Display] [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-2 [&_a]:text-primary [&_a]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_img]:rounded-lg [&_img]:border [&_img]:border-gray-100">
              {Array.isArray(story.content) ? (
                story.content.map((block, idx) => (
                  <div key={idx} className="mb-6">
                    {block.type === "text" && (
                      <div dangerouslySetInnerHTML={{ __html: block.content }} />
                    )}
                    {block.type === "image" && (
                      <figure className="my-6 space-y-2">
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                          <Image
                            src={block.content}
                            alt=""
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 65vw"
                          />
                        </div>
                        {block.metaInfo && (
                          <figcaption className="text-center text-[12px] text-gray-500 font-[Inter]">
                            {block.metaInfo}
                          </figcaption>
                        )}
                      </figure>
                    )}
                  </div>
                ))
              ) : typeof story.content === "string" ? (
                <div dangerouslySetInnerHTML={{ __html: story.content }} />
              ) : null}
            </div>

            <footer className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide font-[Inter]">
                  Share
                </span>
                <button
                  type="button"
                  className="p-2.5 bg-gray-50 text-gray-600 rounded-full border border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                  aria-label="Share"
                >
                  <Share2 size={16} />
                </button>
              </div>
              <Link
                href="/stories"
                className="inline-flex items-center gap-2 text-primary font-bold text-[13px] hover:gap-3 transition-all font-[Inter]"
              >
                More stories <ArrowRight size={16} aria-hidden />
              </Link>
            </footer>
          </article>

          <aside className="w-full lg:w-[300px] xl:w-[320px] shrink-0">
            <div className="lg:sticky lg:top-24">
              <StoryReadingSidebar
                latestNews={latestNews}
                breakingNews={breakingNews}
                trendingNews={trendingNews}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
