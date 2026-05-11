import { getPublicStoryBySlugAction } from "@/actions/public-extra.action";
import { Clock, Share2, ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const story = await getPublicStoryBySlugAction(slug);
  if (!story) return { title: "Story Not Found" };
  return {
    title: `${story.title} — Stories — LabourPulse`,
    description: story.title,
  };
}

export default async function StoryDetailPage({ params }) {
  const { slug } = await params;
  const story = await getPublicStoryBySlugAction(slug);

  if (!story) notFound();

  return (
    <main className="bg-white min-h-screen">
      {/* ━━━ HEADER SECTION ━━━ */}
      <article className="max-w-[1000px] mx-auto px-4 pt-10 pb-24">
        {/* Breadcrumb / Category */}
        <div className="flex items-center justify-between mb-8">
           <Link href="/stories" className="flex items-center gap-2 text-gray-400 text-[11px] font-black uppercase tracking-widest hover:text-primary transition-colors">
              <ArrowLeft size={14} /> Back to Stories
           </Link>
           <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/10">
              Story Narrative
           </div>
        </div>

        {/* Title & Metadata */}
        <header className="mb-12 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-950 font-[Playfair_Display] leading-[1.1] tracking-tight">
            {story.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-100">
             <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500 uppercase tracking-widest">
                <Clock size={14} className="text-primary" />
                {new Date(story.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
             </div>
             <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500 uppercase tracking-widest">
                <BookOpen size={14} className="text-primary" />
                Feature Narrative
             </div>
          </div>
        </header>

        {/* Featured Image */}
        {story.thumbnailImage && (
          <div className="relative aspect-[16/9] mb-16 rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
            <img
              src={story.thumbnailImage}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content Blocks */}
        <div className="max-w-[760px] mx-auto">
           <div className="prose prose-lg prose-gray max-w-none prose-headings:font-[Playfair_Display] prose-headings:font-black prose-headings:text-gray-950 prose-p:text-gray-700 prose-p:leading-[1.8] prose-p:font-[Inter] prose-img:rounded-3xl prose-img:shadow-lg prose-a:text-primary prose-a:font-bold hover:prose-a:text-primary-dark transition-colors">
              {Array.isArray(story.content) ? story.content.map((block, idx) => (
                <div key={idx} className="mb-8">
                   {block.type === 'text' && <div dangerouslySetInnerHTML={{ __html: block.content }} />}
                   {block.type === 'image' && (
                      <figure className="my-10 space-y-3">
                         <img src={block.content} className="w-full h-auto object-cover" alt="" />
                         {block.metaInfo && <figcaption className="text-center text-[12px] font-medium text-gray-400 italic">{block.metaInfo}</figcaption>}
                      </figure>
                   )}
                </div>
              )) : (
                <div dangerouslySetInnerHTML={{ __html: story.content }} />
              )}
           </div>

           {/* Share / Engagement */}
           <footer className="mt-20 pt-10 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Share this story:</span>
                 <div className="flex gap-2">
                    <button className="p-3 bg-gray-50 text-gray-600 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm">
                       <Share2 size={16} />
                    </button>
                 </div>
              </div>
              <Link href="/stories" className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-4 transition-all">
                 Browse more stories <ArrowRight size={16} />
              </Link>
           </footer>
        </div>
      </article>
    </main>
  );
}
