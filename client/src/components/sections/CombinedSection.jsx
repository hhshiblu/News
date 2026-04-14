import Link from "next/link";
import Image from "next/image";
import SectionHeader from "./SectionHeader";
import BigCard from "@/components/news/BigCard";
import SmallCard from "@/components/news/SmallCard";

export default function CombinedSection({ cat1, cat2, posts1 = [], posts2 = [] }) {
  if (!posts1.length && !posts2.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
      
      {/* Category 1 Column */}
      <div className="space-y-6">
        <SectionHeader title={cat1.name} href={`/category/${cat1.slug}`} />
        <div className="space-y-4">
            {posts1[0] && <BigCard story={posts1[0]} />}
            <div className="divide-y divide-gray-50">
                {posts1.slice(1, 4).map(story => (
                    <SmallCard key={story.id} story={story} />
                ))}
            </div>
        </div>
      </div>

      {/* Category 2 Column */}
      <div className="space-y-6">
        <SectionHeader title={cat2.name} href={`/category/${cat2.slug}`} />
        <div className="space-y-4">
            {posts2[0] && <BigCard story={posts2[0]} />}
            <div className="divide-y divide-gray-50">
                {posts2.slice(1, 4).map(story => (
                    <SmallCard key={story.id} story={story} />
                ))}
            </div>
        </div>
      </div>

    </div>
  );
}
