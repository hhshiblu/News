import Link from "next/link";
import Image from "next/image";
import { Camera, Play, ChevronRight } from "lucide-react";

function PhotoCard({ story }) {
  return (
    <Link href={`/news/${story.slug}`} className="group block relative overflow-hidden rounded-sm">
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={story.featuredImage || story.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600"}
          alt={story.title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="text-[9px] font-black text-white/70 uppercase tracking-widest block mb-1">
            {typeof story.category === "object" ? story.category?.name : story.category || "Photo"}
          </span>
          <h3 className="text-white text-[14px] font-bold leading-snug font-[Playfair_Display] line-clamp-2">
            {story.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

function VideoCard({ story }) {
  return (
    <Link href={`/news/${story.slug}`} className="group block">
      <div className="relative w-full aspect-video overflow-hidden rounded-sm mb-2.5">
        <Image
          src={story.featuredImage || story.image || "https://images.unsplash.com/photo-1585829364612-63cb5d3c6399?w=600"}
          alt={story.title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 30vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/60 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play size={18} className="text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>
      <h3 className="text-white text-[13.5px] font-bold leading-snug font-[Playfair_Display] line-clamp-2 group-hover:text-gray-300 transition-colors">
        {story.title}
      </h3>
      <span className="text-gray-500 text-[11px] font-[Inter] mt-1 block">
        {story.timestamp || new Date(story.createdAt).toLocaleDateString()}
      </span>
    </Link>
  );
}

export default function MultimediaLounge({ photoPosts = [], videoPosts = [] }) {
  if (!photoPosts.length && !videoPosts.length) return null;

  return (
    <section className="bg-[#111] py-12 px-0">
      <div className="max-w-[1280px] mx-auto px-4">

        {/* Photo Stories */}
        {photoPosts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2.5">
                <Camera size={16} className="text-primary" />
                <h2 className="text-[13px] font-black uppercase tracking-[0.25em] text-white font-[Inter]">
                  Photo Stories
                </h2>
              </div>
              <Link href="/photo" className="text-[11px] font-bold text-gray-500 hover:text-white flex items-center gap-1 uppercase tracking-widest transition-colors">
                View All <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {photoPosts.slice(0, 4).map(s => (
                <PhotoCard key={s.id} story={s} />
              ))}
            </div>
          </div>
        )}

        {/* Video Section */}
        {videoPosts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2.5">
                <Play size={16} className="text-primary" />
                <h2 className="text-[13px] font-black uppercase tracking-[0.25em] text-white font-[Inter]">
                  Video
                </h2>
              </div>
              <Link href="/videos" className="text-[11px] font-bold text-gray-500 hover:text-white flex items-center gap-1 uppercase tracking-widest transition-colors">
                View All <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videoPosts.slice(0, 4).map(s => (
                <VideoCard key={s.id} story={s} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
