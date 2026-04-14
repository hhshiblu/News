import SectionHeader from "@/components/sections/SectionHeader";
import OpinionCard from "@/components/news/OpinionCard";

export default function OpinionSection({ posts = [] }) {
  if (!posts.length) return null;

  return (
    <section className="bg-amber-50 py-8 px-4 md:px-0 section-gap -mx-4 md:mx-0">
      <div className="max-w-[1280px] mx-auto px-4">
        <SectionHeader title="Opinion & Analysis" emoji="✍️" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {posts.map((story) => (
            <OpinionCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
