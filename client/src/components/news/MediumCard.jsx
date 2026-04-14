import Link from "next/link";
import Image from "next/image";

export default function MediumCard({ story }) {
  return (
    <Link href={`/news/${story.slug}`} className="block bg-white border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-200 img-zoom h-full">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ paddingTop: "58%" }}>
        <Image
          src={story.image || "/placeholder.jpg"}
          alt={story.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>
      {/* Text */}
      <div className="p-3">
        <span className="inline-block text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 mb-2 text-white bg-primary font-[Inter]">
          {typeof story.category === 'object' ? story.category.name : story.category}
        </span>
        <h3 className="text-[14px] font-bold text-gray-900 leading-snug line-clamp-3 font-[Playfair_Display] mb-1.5">
          {story.title}
        </h3>
        <span className="text-[11px] text-gray-400 font-[Inter]">{story.timestamp || new Date(story.createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
