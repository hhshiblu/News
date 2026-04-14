import Image from "next/image";
import Link from "next/link";
import { Clock, User } from "lucide-react";

export default function CategoryHero({ story, hClass = "", layout = "split", compact = false }) {
  if (!story) return null;

  const catLabel =
    typeof story.category === "object"
      ? story.category?.name
      : story.category || "World";
  const authorLine = story.author
    ? typeof story.author === "object"
      ? story.author?.name
      : story.author
    : story.authorData
      ? typeof story.authorData === "object"
        ? story.authorData?.name
        : story.authorData
      : null;

  if (layout === "stacked") {
    return (
      <article className="group border border-gray-200/80 overflow-hidden rounded-2xl hover:shadow-xl transition-all duration-300 bg-white shadow-sm">
        <Link
          href={`/news/${story.slug}`}
          className={`relative block w-full overflow-hidden bg-gray-100 img-zoom ${hClass || "min-h-[220px] md:min-h-[380px]"}`.trim()}
        >
          <Image
            src={story.image || "/placeholder.jpg"}
            alt={story.title}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 1280px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />
          <span
            className={`absolute left-4 font-bold tracking-widest uppercase text-white bg-primary rounded-md font-[Inter] shadow-lg ${
              compact ? "top-3 text-[9px] px-2 py-1" : "top-4 text-[10px] px-3 py-1.5"
            }`}
          >
            {catLabel}
          </span>
        </Link>
        <div className={`border-t border-gray-100 ${compact ? "p-4 md:p-5" : "p-6 md:p-8 lg:p-10"}`}>
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] font-[Inter] mb-2 block">
            Featured lead
          </span>
          <Link href={`/news/${story.slug}`}>
            <h2
              className={`font-bold text-gray-950 leading-[1.15] font-[Playfair_Display] hover:text-primary transition-colors mb-4 ${
                compact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl lg:text-[2rem]"
              }`}
            >
              {story.title}
            </h2>
          </Link>
          {story.excerpt ? (
            <p
              className={`text-gray-600 leading-relaxed font-[Inter] mb-5 line-clamp-3 max-w-3xl ${
                compact ? "text-[13px]" : "text-[14px] md:text-[15px]"
              }`}
            >
              {story.excerpt}
            </p>
          ) : null}
          <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-500 font-[Inter] ${compact ? "text-[11px]" : "text-[12px]"}`}>
            {authorLine ? (
              <span className="flex items-center gap-1.5 text-gray-900 font-semibold">
                <User size={14} className="text-primary shrink-0" />
                {authorLine}
              </span>
            ) : null}
            <span className="flex items-center gap-1.5 text-gray-500">
              <Clock size={14} className="shrink-0" />
              {story.timestamp || story.publishedAt || "Recently"}
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="group border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow bg-white rounded-xl">
      <div className="flex flex-col lg:flex-row gap-0">
        <Link
          href={`/news/${story.slug}`}
          className={`relative lg:w-[55%] overflow-hidden img-zoom block ${hClass}`.trim()}
          style={{ minHeight: hClass ? undefined : "300px" }}
        >
          <Image
            src={story.image || "/placeholder.jpg"}
            alt={story.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          <span className="absolute top-4 left-4 text-[10px] font-bold tracking-widest uppercase px-3 py-1 text-white bg-primary font-[Inter] rounded">
            {catLabel}
          </span>
        </Link>

        <div className="lg:w-[45%] p-5 md:p-7 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-[Inter] mb-2 block">
            Featured Story
          </span>

          <Link href={`/news/${story.slug}`}>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight font-[Playfair_Display] hover:text-primary transition-colors mb-3">
              {story.title}
            </h2>
          </Link>

          <p className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-[Inter] mb-4 line-clamp-3">
            {story.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[12px] text-gray-400 font-[Inter]">
            {authorLine ? (
              <span className="flex items-center gap-1.5 text-gray-900 font-bold">
                <User size={12} /> By {authorLine}
              </span>
            ) : null}
            <span className="flex items-center gap-1.5">
              <Clock size={12} /> {story.timestamp || story.publishedAt || "Recently"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
