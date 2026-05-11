import Link from "next/link";
import { ArrowRight, BookOpen, Clock, LayoutGrid } from "lucide-react";
import { getPublicStoriesAction } from "@/actions/public-extra.action";

export const metadata = {
  title: "Stories — LabourPulse",
  description: "Explore in-depth narrative stories and investigative features from LabourPulse.",
};

export default async function StoriesListPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const pageNum = Math.max(1, parseInt(String(resolvedParams?.page ?? "1"), 10) || 1);
  const { stories, total, totalPages } = await getPublicStoriesAction(`page=${pageNum}&limit=12`);

  return (
    <main className="bg-white min-h-screen">
      {/* ━━━ HERO SECTION ━━━ */}
      <section className="relative overflow-hidden px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full -translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-[1280px] mx-auto py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 font-[Inter]">
            <BookOpen size={12} />
            Exclusive Stories
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-950 font-[Playfair_Display] leading-tight mb-5">
            Narratives that <span className="text-primary italic">Matter</span>
          </h1>
          <p className="max-w-2xl mx-auto text-[14px] md:text-[16px] text-gray-600 leading-relaxed font-[Inter] mb-8">
            Deep-dive investigations, human-interest narratives, and long-form journalism exploring the heart of labour issues worldwide.
          </p>
        </div>
      </section>

      {/* ━━━ STORIES GRID ━━━ */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/stories/${story.slug}`}
                className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/20"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
                  <img
                    src={story.thumbnailImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200"}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 left-4">
                     <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">Story</span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    <Clock size={12} /> {new Date(story.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h3 className="text-[18px] md:text-[20px] font-black text-gray-950 font-[Playfair_Display] leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {story.title}
                  </h3>
                  <div className="mt-auto pt-4 flex items-center gap-2 text-primary text-[12px] font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                    Read Story <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {stories.length === 0 && (
             <div className="py-20 text-center">
                <LayoutGrid size={48} className="mx-auto text-gray-100 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">No stories found</h3>
                <p className="text-gray-500">Check back later for fresh narratives.</p>
             </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-4">
              <Link
                href={`/stories?page=${pageNum - 1}`}
                className={`flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-[12px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all ${pageNum === 1 ? 'pointer-events-none opacity-40' : ''}`}
              >
                Previous
              </Link>
              <div className="text-[12px] font-black text-gray-400 uppercase tracking-widest">
                Page {pageNum} of {totalPages}
              </div>
              <Link
                href={`/stories?page=${pageNum + 1}`}
                className={`flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-[12px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all ${pageNum === totalPages ? 'pointer-events-none opacity-40' : ''}`}
              >
                Next
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ━━━ FOOTER CTA ━━━ */}
      <section className="bg-gray-950 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary mb-4 border border-primary/30">
            <BookOpen size={32} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white font-[Playfair_Display]">Stay Informed</h2>
          <p className="text-gray-400 text-[14px] md:text-[16px] font-[Inter] leading-relaxed">
            Our stories bring you closer to the heartbeat of the labour movement. Subscribe to our newsletter to receive the latest investigations directly in your inbox.
          </p>
          <div className="pt-4">
             <Link href="/newsletter" className="inline-flex px-10 py-4 bg-primary hover:bg-primary-dark text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-full transition-all shadow-xl shadow-primary/20">
                Subscribe Now
             </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
