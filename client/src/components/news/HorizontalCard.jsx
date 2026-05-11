import Link from "next/link";
import Image from "next/image";

export default function HorizontalCard({ story, compact = false }) {
  return (
    <Link href={`/news/${story.slug}`} className="flex bg-white border border-gray-100 overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 h-full group img-zoom">
      {/* Image 40% */}
      <div
        className="w-[40%] flex-shrink-0 relative overflow-hidden"
        style={{ minHeight: compact ? "120px" : "160px" }}
      >
        <Image
          src={story.featuredImage || story.image || "/placeholder.jpg"}
          alt={story.title}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 768px) 40vw, 20vw"
        />
      </div>
      {/* Text 60% */}
      <div className={`flex-1 flex flex-col justify-between ${compact ? "p-3" : "p-4"}`}>
        <div>
          <span
            className={`inline-block font-bold tracking-widest uppercase mb-2 text-white bg-primary font-[Inter] ${
              compact ? "text-[9px] px-1.5 py-px" : "text-[10px] px-2 py-0.5"
            }`}
          >
            {typeof story.category === "object" ? story.category.name : story.category}
          </span>
          <h3
            className={`font-bold text-gray-900 leading-snug line-clamp-3 font-[Playfair_Display] mb-2 group-hover:text-primary transition-colors ${
              compact ? "text-[13px]" : "text-[15px]"
            }`}
          >
            {story.title}
          </h3>
          {story.excerpt && (
            <p
              className={`text-gray-500 leading-relaxed line-clamp-2 font-[Inter] ${compact ? "text-[12px]" : "text-[13px]"}`}
            >
              {story.excerpt}
            </p>
          )}
        </div>
        <div className={`flex items-center gap-2 text-gray-400 font-[Inter] ${compact ? "mt-2 text-[10px]" : "mt-2.5 text-[11px]"}`}>
          {story.reporter && <span>By {typeof story.reporter === 'object' ? story.reporter.name : story.reporter}</span>}
          {story.reporter && <span>·</span>}
          <span>{story.timestamp || new Date(story.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
