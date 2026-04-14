import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Clock } from "lucide-react";
import { getCategories, getNewsFeed } from "@/actions/public";

function fmt(s) {
  try {
    const d = s.publishedAt || s.createdAt;
    if (!d) return s.timestamp || "";
    return new Date(d).toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return s.timestamp || "";
  }
}

const ACCENTS = ["#C0392B", "#1A3A6D", "#1A6D4C"];

async function fetchDeskPosts(cat) {
  if (!cat?.slug) return [];
  const byParent = await getNewsFeed({ parentCategorySlug: cat.slug, limit: 7 });
  if (byParent.posts?.length) return byParent.posts;
  if (cat.id && String(cat.id).length > 20) {
    const byId = await getNewsFeed({ categoryId: cat.id, limit: 7 });
    return byId.posts || [];
  }
  return [];
}

async function fetchOneForCategory(slug) {
  if (!slug) return null;
  const res = await getNewsFeed({ parentCategorySlug: slug, limit: 1 });
  const p = res.posts?.[0] || null;
  if (p) return { post: p, slug };
  return null;
}

function TitleColumn({ category, posts = [], accent = "#C0392B" }) {
  const href = `/${category.slug}`;

  return (
    <div className="flex flex-col min-w-0 h-full">
      <div
        className="flex items-center justify-between pb-2.5 mb-4 border-b-[3px]"
        style={{ borderBottomColor: accent }}
      >
        <h2 className="text-[12.5px] font-black uppercase tracking-[0.18em] text-gray-900 font-[Inter]">
          {category.name}
        </h2>
        <Link
          href={href}
          className="text-[10px] font-bold flex items-center gap-0.5 uppercase tracking-wide font-[Inter] hover:opacity-70 transition-opacity"
          style={{ color: accent }}
        >
          View All <ChevronRight size={11} />
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-[12px] text-gray-400 font-[Inter] py-4">
          No stories in this desk yet—open the section to see the archive.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 flex-1">
          {posts.map((s, i) => (
            <li key={s.id}>
              <Link
                href={`/news/${s.slug}`}
                className="flex items-start gap-3 py-3 group hover:bg-gray-50/70 -mx-2 px-2 transition-colors rounded-sm"
              >
                <span
                  className="text-[22px] font-black leading-none shrink-0 w-6 text-right font-[Playfair_Display] transition-colors"
                  style={{ color: i < 3 ? accent : "#e5e7eb" }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13.5px] font-semibold leading-snug text-gray-800 group-hover:text-primary transition-colors font-[Inter] line-clamp-2">
                    {s.title}
                  </h3>
                  <span className="text-[10.5px] text-gray-400 flex items-center gap-1 mt-0.5 font-[Inter]">
                    <Clock size={9} /> {fmt(s)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-70 transition-opacity font-[Inter]"
        style={{ color: accent }}
      >
        All {category.name} <ChevronRight size={11} />
      </Link>
    </div>
  );
}

function CategoryPhotoCard({ category, post }) {
  const href = `/${category.slug}`;
  const src = post?.featuredImage || post?.image;

  return (
    <Link
      href={href}
      className="group relative block rounded-xl overflow-hidden border border-gray-200 bg-gray-900 aspect-[4/3] shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 16vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center p-4">
          <span className="text-[11px] font-black uppercase tracking-widest text-white/60 font-[Inter] text-center">
            {category.name}
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/90 font-[Inter] mb-1">
          {category.name}
        </p>
        <p className="text-[12px] md:text-[13px] font-bold text-white font-[Inter] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {post?.title || `Open the ${category.name} desk →`}
        </p>
      </div>
    </Link>
  );
}

/**
 * By Section — top 3 desks (title lists) + photo cards for those 3 plus one story each from other parent categories.
 */
export default async function CategoryTitlesStrip({ categorySlugs = [] }) {
  if (!categorySlugs.length) return null;

  const catRes = await getCategories();
  const allCats = catRes.data || [];
  const getCat = (slug) =>
    allCats.find((c) => c.slug === slug) || {
      id: slug,
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      slug,
    };

  const topSlugs = categorySlugs.slice(0, 3);
  const categories = topSlugs.map(getCat);

  const feedResults = await Promise.all(categories.map((cat) => fetchDeskPosts(cat)));

  const topSlugSet = new Set(topSlugs);
  const otherParents = allCats
    .filter((c) => c?.slug && !topSlugSet.has(c.slug) && !c.parentId)
    .slice(0, 8);

  const extraPhotoData = await Promise.all(
    otherParents.map(async (c) => {
      const row = await fetchOneForCategory(c.slug);
      if (!row) return null;
      return { category: c, post: row.post };
    })
  );
  const extraPhotos = extraPhotoData.filter(Boolean);

  const mainPhotos = categories.map((cat, idx) => ({
    category: cat,
    post: feedResults[idx]?.[0] || null,
  }));

  return (
    <section className="bg-white border-y border-gray-200 py-8 md:py-10">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-1 h-5 bg-primary rounded-full" />
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 font-[Inter]">
            By Section
          </h2>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {categories.map((cat, idx) => (
            <div
              key={cat.slug}
              className={[
                idx === 0 ? "md:pr-8 pb-8 md:pb-0" : "",
                idx === 1 ? "md:px-8 py-8 md:py-0" : "",
                idx === 2 ? "md:pl-8 pt-8 md:pt-0" : "",
              ].join(" ")}
            >
              <TitleColumn
                category={cat}
                posts={feedResults[idx] || []}
                accent={ACCENTS[idx % ACCENTS.length]}
              />
            </div>
          ))}
        </div>

        <div className="mt-10 pt-10 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 font-[Inter]">
              Desk snapshot · tap a card to open that section
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {mainPhotos.map(({ category, post }) => (
              <CategoryPhotoCard key={category.slug} category={category} post={post} />
            ))}
            {extraPhotos.map(({ category, post }) => (
              <CategoryPhotoCard key={`extra-${category.slug}`} category={category} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
