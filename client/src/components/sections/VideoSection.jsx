import SectionHeader from "@/components/sections/SectionHeader";
import VideoCard from "@/components/news/VideoCard";

export default function VideoSection({ posts = [] }) {
  if (!posts.length) return null;

  return (
    <section className="bg-bg-charcoal py-8 px-4 md:px-0 section-gap -mx-4 md:mx-0">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center justify-between border-b-[3px] border-primary pb-2.5 mb-5">
          <h2 className="text-[15px] font-bold uppercase tracking-wide text-white font-[Inter] flex items-center gap-1.5">
            🎬 Latest Videos
          </h2>
          <a href="/videos" className="text-[12px] font-semibold text-gray-400 hover:text-white transition-colors font-[Inter]">
            View All →
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {posts.map((story) => (
            <VideoCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
