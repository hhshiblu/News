import Link from "next/link";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

export default function SmallCard({ story }) {
  return (
    <Link href={`/news/${story.slug}`} className="flex gap-2.5 items-start py-2.5 border-b border-gray-100 group hover:opacity-80 transition-opacity">
      { (story.featuredImage || story.image) ? (
        <div className="w-[72px] h-[54px] flex-shrink-0 relative overflow-hidden">
          <Image
            src={story.featuredImage || story.image || "/placeholder.jpg"}
            alt={story.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="72px"
          />
        </div>
      ) : (
        <div className="w-[72px] h-[54px] flex-shrink-0 bg-gray-100 flex items-center justify-center text-gray-300">
           <ImageIcon size={20} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        {story.category && (
          <span className="text-[10px] font-bold text-primary uppercase tracking-wide block mb-0.5 font-[Inter]">
            {typeof story.category === 'object' ? story.category.name : story.category}
          </span>
        )}
        <p className="text-[12.5px] font-semibold text-gray-800 group-hover:text-primary line-clamp-2 leading-snug transition-colors font-[Inter]">
          {story.title}
        </p>
        <span className="text-[11px] text-gray-400 mt-0.5 block font-[Inter]">
          {story.timestamp || new Date(story.createdAt).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
}
