import Link from "next/link";
import Image from "next/image";
import { getNewsFeed } from "@/actions/public";

export const metadata = {
  title: "Opinion - LabourPulse",
  description: "Editorial and expert perspectives from LabourPulse.",
};

export default async function OpinionPage() {
  const feed = await getNewsFeed({ isOpinion: true, limit: 24 });
  const posts = feed?.posts || [];

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-gray-200 bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-[1280px] px-4">
          <h1 className="text-4xl font-black font-[Playfair_Display]">Opinion</h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-300">
            Sharp perspectives and analysis from our editorial desk and contributors.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-[1280px] px-4">
          {posts.length === 0 ? (
            <p className="text-sm text-gray-500">No opinion articles published yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/news/${post.slug}`}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="relative aspect-16/10 bg-gray-100">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="space-y-2 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Opinion</p>
                    <h2 className="line-clamp-3 text-base font-bold text-gray-900">{post.title}</h2>
                    <p className="line-clamp-2 text-xs text-gray-500">{post.subtitle || "Read full editorial analysis."}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
