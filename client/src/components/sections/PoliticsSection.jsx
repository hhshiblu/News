import SectionHeader from "@/components/sections/SectionHeader";
import HorizontalCard from "@/components/news/HorizontalCard";
import MediumCard from "@/components/news/MediumCard";
import SmallCard from "@/components/news/SmallCard";

export default function PoliticsSection({ posts = [] }) {
  if (!posts.length) return null;

  const featured = posts[0];
  const secondary1 = posts[1];
  const secondary2 = posts[2];
  const smallItems = posts.slice(3, 7); // Up to 4 small items

  return (
    <section className="bg-white py-6 px-0 section-gap">
      <SectionHeader title="Politics & Governance" href="/politics/national" emoji="🏛️" />

      {/* Main row: Horizontal + 2 Medium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-1">
          {featured ? <HorizontalCard story={featured} /> : null}
        </div>
        <div className="md:col-span-1">
          {secondary1 ? <MediumCard story={secondary1} /> : null}
        </div>
        <div className="md:col-span-1">
          {secondary2 ? <MediumCard story={secondary2} /> : null}
        </div>
      </div>

      {/* Small cards row */}
      {smallItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4">
          {smallItems.map((story) => (
            <SmallCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </section>
  );
}
