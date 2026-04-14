import Link from "next/link";
import Image from "next/image";

export default function OpinionCard({ story }) {
  return (
    <Link href={`/news/${story.slug}`} className="flex flex-col items-center text-center p-6 bg-white border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-200 h-full group">
      {/* Quote mark */}
      <div className="text-5xl leading-none text-primary/30 font-[Playfair_Display] -mb-1">"</div>
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-[3px] border-primary relative mb-3">
        <Image src={story.author?.image || story.authorData?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"} alt={typeof story.author === 'object' ? story.author.name : story.author} fill unoptimized className="object-cover" sizes="64px" />
      </div>
      {/* Author */}
      <p className="text-[13px] font-bold text-gray-900 font-[Inter]">{typeof story.author === 'object' ? story.author.name : (story.author || 'Editorial Staff')}</p>
      <p className="text-[11px] text-gray-500 leading-snug mb-3 font-[Inter]">{story.authorData?.role || story.author?.role || "Columnist"}</p>
      {/* Title */}
      <h3 className="text-[14px] font-bold text-gray-800 line-clamp-3 leading-snug font-[Playfair_Display] group-hover:text-primary transition-colors flex-1">
        {story.title}
      </h3>
      <span className="text-[11px] text-gray-400 mt-3 font-[Inter]">
        {typeof story.timestamp === 'object' ? (story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'Recently') : (story.timestamp || story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'Recently')}
      </span>
    </Link>
  );
}
