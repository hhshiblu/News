import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

function fmtDate(story) {
  const d = story?.publishedAt || story?.createdAt;
  if (!d) return story?.timestamp || "";
  try {
    const now = new Date();
    const pub = new Date(d);
    const diffMins = Math.floor((now - pub) / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return pub.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return story?.timestamp || "";
  }
}

function imageSrc(story) {
  return story?.featuredImage || story?.image || "/placeholder.jpg";
}

export default function MosaicNewsGrid({ posts = [], maxItems = 7 }) {
  const list = (posts || []).slice(0, maxItems);
  if (!list.length) return null;

  return (
    <div className="mx-auto w-full max-w-[980px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {list.map((story, idx) => (
        <Link
          key={story.id || story.slug || `std-${idx}`}
          href={`/news/${story.slug}`}
          className="group block overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow"
        >
          <div className="relative aspect-video bg-gray-100">
            <Image
              src={imageSrc(story)}
              alt={story.title}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="px-3 py-2.5">
            <h3 className="text-[12.5px] md:text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {story.title}
            </h3>
            <p className="mt-1 text-[10px] text-gray-400 flex items-center gap-1">
              <Clock size={10} /> {fmtDate(story)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
