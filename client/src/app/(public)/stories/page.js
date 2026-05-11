import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Clock, LayoutGrid } from "lucide-react";
import { getPublicStoriesAction } from "@/actions/public-extra.action";

export const metadata = {
  title: "Stories — LabourPulse",
  description:
    "Explore in-depth narrative stories and investigative features from LabourPulse.",
};

function storyImage(story) {
  return (
    story.thumbnailImage ||
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200"
  );
}

export default async function StoriesListPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const pageNum = Math.max(
    1,
    parseInt(String(resolvedParams?.page ?? "1"), 10) || 1,
  );
  const { stories, totalPages } = await getPublicStoriesAction(
    `page=${pageNum}&limit=12`,
  );

  const showLead = pageNum === 1 && stories.length > 0;
  const lead = showLead ? stories[0] : null;
  const sidePair = showLead ? stories.slice(1, 3) : [];
  const gridStories = showLead ? stories.slice(3) : stories;

  return (
    <main className="bg-white min-h-screen font-[Inter]">
      <section className="relative overflow-hidden px-4 border-b border-gray-100">
        <div className="absolute inset-0 bg-linear-to-br from-gray-50 via-white to-gray-100" />
        <div className="absolute top-0 left-0 w-[520px] h-[520px] bg-primary/5 rounded-full -translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-[1280px] mx-auto py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-[0.2em] rounded-full mb-5">
            <BookOpen size={12} aria-hidden />
            Stories
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-950 font-[Playfair_Display] leading-tight mb-4">
            Narratives that <span className="text-primary italic">matter</span>
          </h1>
          <p className="max-w-2xl mx-auto text-[13px] md:text-[14px] text-gray-600 leading-relaxed">
            Long-form reporting and human stories on labour, justice, and work
            worldwide — edited for clarity and international readability.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14 px-4">
        <div className="max-w-[1280px] mx-auto">
          {showLead && lead && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 mb-10 md:mb-12">
              <Link
                href={`/stories/${lead.slug}`}
                className="lg:col-span-8 group flex flex-col rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:border-primary/15 transition-all duration-300"
              >
                <div className="relative aspect-16/10 md:aspect-21/9 overflow-hidden bg-gray-100">
                  <Image
                    src={storyImage(lead)}
                    alt={lead.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 px-2.5 py-1 bg-white/95 text-primary text-[10px] font-bold uppercase tracking-widest rounded-md shadow-sm">
                    Featured
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                    <p className="text-white/80 text-[12px] md:text-[13px] font-medium mb-2 flex items-center gap-2">
                      <Clock size={13} aria-hidden />
                      {new Date(lead.createdAt).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <h2 className="text-white text-[20px] md:text-[26px] font-bold font-[Playfair_Display] leading-snug line-clamp-3 group-hover:underline decoration-white/40 underline-offset-4">
                      {lead.title}
                    </h2>
                    <span className="inline-flex items-center gap-2 mt-3 text-white text-[12px] md:text-[13px] font-semibold">
                      Read story <ArrowRight size={14} aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>

              <div className="lg:col-span-4 flex flex-col gap-4">
                {sidePair.map((story) => (
                  <Link
                    key={story.id}
                    href={`/stories/${story.slug}`}
                    className="group flex gap-3 p-3 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-primary/15 transition-all min-h-[112px]"
                  >
                    <div className="relative w-[104px] shrink-0 rounded-lg overflow-hidden bg-gray-100 aspect-4/3">
                      <Image
                        src={storyImage(story)}
                        alt={story.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="104px"
                      />
                    </div>
                    <div className="min-w-0 flex flex-col justify-center py-0.5">
                      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-1">
                        {new Date(story.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                      <h3 className="text-[13px] md:text-[14px] font-bold text-gray-900 leading-snug line-clamp-3 group-hover:text-primary transition-colors font-[Inter]">
                        {story.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {gridStories.map((story) => (
              <Link
                key={story.id}
                href={`/stories/${story.slug}`}
                className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-primary/15 transition-all duration-300"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
                  <Image
                    src={storyImage(story)}
                    alt={story.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 bg-white/95 text-primary text-[10px] font-bold uppercase tracking-wider rounded shadow-sm">
                      Story
                    </span>
                  </div>
                </div>

                <div className="p-4 md:p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    <Clock size={12} aria-hidden />
                    {new Date(story.createdAt).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <h3 className="text-[15px] md:text-[16px] font-bold text-gray-950 font-[Playfair_Display] leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-3">
                    {story.title}
                  </h3>
                  <div className="mt-auto pt-2 flex items-center gap-2 text-primary text-[12px] md:text-[13px] font-semibold group-hover:gap-3 transition-all">
                    Read story <ArrowRight size={14} aria-hidden />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {stories.length === 0 && (
            <div className="py-20 text-center">
              <LayoutGrid
                size={44}
                className="mx-auto text-gray-200 mb-4"
                aria-hidden
              />
              <h3 className="text-lg font-bold text-gray-900 font-[Playfair_Display]">
                No stories yet
              </h3>
              <p className="text-[13px] text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
                New narratives will appear here when editors publish them.
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 md:mt-14 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/stories?page=${pageNum - 1}`}
                className={`px-5 py-2.5 rounded-full border border-gray-200 text-[12px] md:text-[13px] font-semibold hover:bg-gray-50 transition-colors ${
                  pageNum === 1 ? "pointer-events-none opacity-40" : ""
                }`}
              >
                Previous
              </Link>
              <span className="text-[12px] md:text-[13px] text-gray-500 font-medium px-2">
                Page {pageNum} of {totalPages}
              </span>
              <Link
                href={`/stories?page=${pageNum + 1}`}
                className={`px-5 py-2.5 rounded-full border border-gray-200 text-[12px] md:text-[13px] font-semibold hover:bg-gray-50 transition-colors ${
                  pageNum === totalPages ? "pointer-events-none opacity-40" : ""
                }`}
              >
                Next
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
