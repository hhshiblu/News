import Link from "next/link";
import Image from "next/image";

export default function BigCard({ story, compact = false }) {
  return (
    <Link href={`/news/${story.slug}`} className="flex flex-col bg-white border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 img-zoom h-full">
      {/* Image */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ paddingTop: compact ? "56%" : "60%" }}>
        <Image
          src={story.featuredImage || story.image || "/placeholder.jpg"}
          alt={story.title}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 30vw"
        />
        <span
          className={`absolute left-2.5 text-[10px] font-bold tracking-widest uppercase text-white bg-primary font-[Inter] ${
            compact ? "top-2 text-[9px] px-1.5 py-px" : "top-2.5 px-2 py-0.5"
          }`}
        >
          {typeof story.category === "object" ? story.category.name : story.category}
        </span>
      </div>
      {/* Text — flex-1 so it fills remaining height */}
      <div className={`flex flex-col flex-1 ${compact ? "p-2.5" : "p-3.5"}`}>
        <h3
          className={`font-bold text-gray-900 leading-snug line-clamp-3 font-[Playfair_Display] mb-2 flex-1 ${
            compact ? "text-[13px]" : "text-[15px]"
          }`}
        >
          {story.title}
        </h3>
        <span className={`text-gray-400 font-[Inter] mt-auto ${compact ? "text-[10px]" : "text-[11px]"}`}>
          {story.timestamp || new Date(story.createdAt).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
}

