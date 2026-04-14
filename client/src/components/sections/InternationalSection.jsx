import SectionHeader from "@/components/sections/SectionHeader";
import MediumCard from "@/components/news/MediumCard";

export default function InternationalSection({ posts = [] }) {
  if (!posts.length) return null;

  return (
    <section className="section-gap">
      <SectionHeader title="International" href="/international/asia" emoji="🌍" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((story) => (
          <div key={story.id} className="relative">
            <MediumCard story={story} />
            {/* Country badge */}
            {story.countryTag && (
              <span className="absolute top-2.5 right-2.5 bg-white/90 text-gray-700 text-[11px] font-semibold px-2 py-0.5 shadow-sm font-[Inter]">
                {story.countryTag}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
