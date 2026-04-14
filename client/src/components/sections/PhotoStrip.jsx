import Image from "next/image";
import Link from "next/link";

export default function PhotoStrip({ posts = [] }) {
  if (!posts.length) return null;

  return (
    <section className="bg-gray-100 py-6 px-4 md:px-0 section-gap -mx-4 md:mx-0">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center justify-between border-b-[3px] border-primary pb-2.5 mb-5">
          <h2 className="text-[15px] font-bold uppercase tracking-wide text-gray-900 font-[Inter]">
            📷 Photo Stories
          </h2>
          <a href="/photos" className="text-[12px] font-semibold text-primary hover:opacity-75 font-[Inter]">
            View All →
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {posts.map((photo) => {
            const imageBlock = photo.content?.find(b => b.type === 'image');
            const imageSrc = photo.featuredImage || imageBlock?.content || photo.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800";
            
            return (
              <Link key={photo.id} href={`/news/${photo.slug}`} className="relative aspect-square overflow-hidden group block">
                <Image
                  src={imageSrc}
                  alt={photo.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-110 transition-transform duration-400"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />

                {/* Caption overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end">
                  <p className="text-white text-[12px] font-semibold p-2.5 opacity-0 group-hover:opacity-100 transition-opacity font-[Inter] leading-snug">
                    {photo.title}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  );
}
