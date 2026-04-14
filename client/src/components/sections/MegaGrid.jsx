import Link from "next/link";
import Image from "next/image";
import HeroCard from "@/components/news/HeroCard";
import SmallCard from "@/components/news/SmallCard";
import AdSlot from "@/components/ads/AdSlot";
import { TrendingUp } from "lucide-react";

export default function MegaGrid({ featuredPosts = [], trendingPosts = [] }) {
  if (!featuredPosts.length) return null;

  const mainStory = featuredPosts[0];
  const listStories = featuredPosts.slice(1, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 pb-12 border-b border-gray-100">
      
      {/* Column 1: Main Story (BBC Style) */}
      <div className="lg:col-span-6 xl:col-span-7">
        <HeroCard story={mainStory} />
      </div>

      {/* Column 2: Top Headlines List */}
      <div className="lg:col-span-3 xl:col-span-3 flex flex-col justify-start">
        <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-primary mb-5 flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" /> Top Headlines
        </h2>
        <div className="space-y-1 divide-y divide-gray-50">
          {listStories.map((story) => (
            <SmallCard key={story.id} story={story} />
          ))}
        </div>
      </div>

      {/* Column 3: Sidebar (Ad + Trending) */}
      <div className="lg:col-span-3 xl:col-span-2 space-y-8">
         <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex flex-col items-center">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Advertisement</p>
            <div className="w-full h-[250px] bg-gray-200 rounded flex items-center justify-center">
                <AdSlot slotKey="public_sidebar_medium" />
            </div>
         </div>

         <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 border-b-2 border-gray-100 pb-2 flex items-center gap-2">
                <TrendingUp size={14} className="text-primary" /> Trending Now
            </h3>
            <ul className="space-y-4">
                {trendingPosts.slice(0, 5).map((story, i) => (
                    <li key={story.id} className="flex gap-4 group">
                        <span className="text-3xl font-black text-gray-100 group-hover:text-primary/20 transition-colors">{i + 1}</span>
                        <Link href={`/news/${story.slug}`} className="text-[13px] font-bold text-gray-800 leading-tight hover:text-primary transition-colors line-clamp-3">
                            {story.title}
                        </Link>
                    </li>
                ))}
            </ul>
         </div>
      </div>

    </div>
  );
}
