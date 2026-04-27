import Link from "next/link";
import { getCategories, getNewsFeed } from "@/actions/public";

async function fetchOneForCategory(slug) {
  if (!slug) return null;
  const res = await getNewsFeed({ parentCategorySlug: slug, limit: 1 });
  const p = res.posts?.[0] || null;
  if (p) return { post: p, slug };
  return null;
}

function CategoryPhotoCard({ category, post }) {
  const href = `/${category.slug}`;
  const rawSrc = post?.featuredImage || post?.image || category?.imageUrl || "";
  const src = rawSrc
    ? rawSrc.startsWith("http://") || rawSrc.startsWith("https://") || rawSrc.startsWith("/")
      ? rawSrc
      : `/${rawSrc}`
    : "";

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl border border-gray-200 bg-gray-950 aspect-[5/4] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30"
    >
      {src ? (
        <img
          src={src}
          alt={category.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-4">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70 font-[Inter] text-center line-clamp-2">
            {category.name} section
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 p-2.5 md:p-3.5">
        <p className="mb-1 inline-flex max-w-full rounded-md bg-black/30 px-1.5 py-0.5 text-[8.5px] font-black uppercase tracking-[0.18em] text-white/95 font-[Inter] backdrop-blur-sm line-clamp-1">
          {category.name}
        </p>
        <p className="text-[12px] font-bold text-white font-[Inter] leading-snug line-clamp-2 transition-colors group-hover:text-primary-light">
          {post?.title || `Open the ${category.name} desk →`}
        </p>
      </div>
    </Link>
  );
}

export default async function CategoryGridDirectory() {
  const catRes = await getCategories();
  const allCats = catRes.data || [];
  
  const categories = allCats
    .filter((c) => c?.slug && !c.parentId)
    .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));

  if (!categories.length) return null;

  const photoData = await Promise.all(
    categories.map(async (c) => {
      const row = await fetchOneForCategory(c.slug);
      return { category: c, post: row?.post || null };
    })
  );

  return (
    <section className="bg-white border-b border-gray-200 py-6 md:py-8">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center gap-2 mb-5">
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 font-[Inter]">
            All Sections Directory · Tap a card to explore
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
          {photoData.map(({ category, post }) => (
            <CategoryPhotoCard key={category.slug} category={category} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
