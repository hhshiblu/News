import HeroCard from "@/components/news/HeroCard";
import BigCard from "@/components/news/BigCard";
import SmallCard from "@/components/news/SmallCard";
import HorizontalCard from "@/components/news/HorizontalCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function FeaturedSection({ posts = [] }) {
  // If no posts, show nothing or a placeholder
  if (!posts.length) return null;

  // Logic to distribute posts into the layout
  const heroStory = posts[0];
  const bigCards = posts.slice(1, 3); // next 2
  const smallCards = posts.slice(3, 7); // next 4
  const featuredHorizontals = posts.slice(7, 9); // next 2

  return (
    <div className="flex flex-col gap-4">
      {/* ── Hero Card ── */}
      <HeroCard story={heroStory} />

      {/* ── Secondary Row: 2 BigCards + SmallCard Stack ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {bigCards.map((story) => (
          <BigCard key={story.id} story={story} />
        ))}

        {/* Small card list — right col, fills full height */}
        {smallCards.length > 0 && (
          <div className="flex flex-col justify-between border border-gray-100 p-3 md:col-span-2 lg:col-span-1">
            {smallCards.map((story) => (
              <SmallCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </div>

      {/* ── More Stories divider ── */}
      <div className="flex items-center justify-between border-b-[3px] border-primary pb-2 pt-2">
        <h2 className="text-[14px] font-bold uppercase tracking-wide text-gray-900 font-[Inter]">
          More Stories
        </h2>
        <Link href="/news" className="text-[12px] font-semibold text-primary flex items-center gap-0.5 hover:opacity-75 font-[Inter]">
          View All <ChevronRight size={13} />
        </Link>
      </div>

      {/* ── Horizontal Cards ── */}
      <div className="flex flex-col gap-3">
        {featuredHorizontals.map((story) => (
          <HorizontalCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
}
