import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";

export default function VideoCard({ story }) {
  return (
    <Link href={`/news/${story.slug}`} className="block group hover:-translate-y-1 transition-all duration-200">
      {/* Thumbnail */}
      <div className="relative overflow-hidden bg-black" style={{ paddingTop: "56.25%" }}>
        <Image
          src={story.thumbnail || story.image || "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800"}
          alt={story.title}
          fill
          className="object-cover opacity-80 group-hover:opacity-70 transition-opacity"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <Play size={18} className="text-white fill-white ml-0.5" />
          </div>
        </div>
        {/* Duration */}
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-semibold px-1.5 py-0.5 font-[Inter]">
          {story.duration || "2:45"}
        </span>
      </div>
      {/* Info */}
      <div className="pt-2.5 pb-1">
        <span className="inline-block text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 text-white bg-primary mb-1.5 font-[Inter]">
          {typeof story.category === 'object' ? story.category.name : (story.category || 'World')}
        </span>
        <h4 className="text-[13px] font-bold text-white line-clamp-2 leading-snug font-[Playfair_Display] group-hover:text-gray-300 transition-colors">
          {story.title}
        </h4>
      </div>
    </Link>
  );
}
