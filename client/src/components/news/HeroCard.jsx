import Link from "next/link";
import Image from "next/image";

export default function HeroCard({ story }) {
  return (
    <Link href={`/news/${story.slug}`} className="block relative overflow-hidden group mb-5 img-zoom">
      {/* Image */}
      <div className="relative w-full" style={{ paddingTop: "52%" }}>
        <Image
          src={story.featuredImage || story.image || "/placeholder.jpg"}
          alt={story.title}
          fill
          priority
          unoptimized
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 65vw"
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
          <span className={`inline-block text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 mb-2 font-[Inter] ${story.categoryClass} bg-primary text-white`}>
            {typeof story.category === 'object' ? story.category.name : story.category}
          </span>
          <h1 className="text-white text-2xl md:text-[1.6rem] font-bold leading-tight mb-2 font-[Playfair_Display] drop-shadow">
            {story.title}
          </h1>
          <p className="text-white/80 text-sm leading-relaxed line-clamp-2 mb-3 font-[Inter]">
            {story.excerpt}
          </p>
          <div className="flex items-center gap-3 text-[11px] text-white/65 font-[Inter]">
            <span>By {typeof story.author === 'object' ? story.author.name : (story.author || 'Editorial Staff')}</span>
            <span>·</span>
            <span>{story.timestamp || new Date(story.createdAt).toLocaleDateString()}</span>
            <span>·</span>
            <span>📖 {story.readTime || '3 min'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
