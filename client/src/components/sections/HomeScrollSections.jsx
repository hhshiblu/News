import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";

function catName(c) {
  return typeof c === "object" ? c?.name : c || "News";
}

function fmtShort(p) {
  const d = p.publishedAt || p.createdAt;
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function img(p) {
  return p.featuredImage || p.image || "/placeholder.jpg";
}

/**
 * Large asymmetric “desk” blocks — lead + stack, rotates visual style by index.
 */
export function HomeMagazineDesks({ desks = [], layoutOffset = 0 }) {
  const active = desks.filter((d) => d.posts?.length > 0);
  if (!active.length) return null;

  return (
    <section className="border-t border-gray-200 bg-gray-50/40">
      <div className="max-w-[1280px] mx-auto px-4 py-10 md:py-14 space-y-10 md:space-y-14">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-gray-900 pb-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary font-[Inter] mb-1">
              Desks · deeper than the fold
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-950 font-[Playfair_Display] leading-tight">
              Category lanes
            </h2>
          </div>
          <p className="text-[12px] text-gray-500 font-[Inter] max-w-md">
            Each block pulls 3–5 recent stories from that desk—mixed layouts so the page feels like a broadsheet, not a template.
          </p>
        </div>

        {active.map((desk, i) => {
          const L = (layoutOffset + i) % 3;
          const { category, posts } = desk;
          const slug = category?.slug || "news";
          const [lead, ...rest] = posts;
          const side = rest.slice(0, 4);

          if (L === 0) {
            return (
              <article
                key={slug + i}
                className="rounded-2xl border border-gray-200/90 bg-white shadow-sm overflow-hidden scroll-mt-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-gray-950 text-white">
                  <h3 className="text-lg md:text-xl font-bold font-[Playfair_Display] tracking-tight">
                    {category.name}
                  </h3>
                  <Link
                    href={`/${slug}`}
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline font-[Inter] inline-flex items-center gap-1"
                  >
                    Open desk <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {lead && (
                    <Link
                      href={`/news/${lead.slug}`}
                      className="lg:col-span-5 group block min-w-0"
                    >
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-3">
                        <Image
                          src={img(lead)}
                          alt=""
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          sizes="(max-width:1024px) 100vw, 40vw"
                        />
                        <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest bg-white/95 text-gray-900 px-2 py-1 rounded font-[Inter]">
                          Lead
                        </span>
                      </div>
                      <h4 className="text-[1.15rem] md:text-xl font-bold text-gray-950 font-[Playfair_Display] leading-snug group-hover:text-primary transition-colors line-clamp-3">
                        {lead.title}
                      </h4>
                      <p className="mt-2 text-[11px] text-gray-400 font-semibold font-[Inter]">{fmtShort(lead)}</p>
                    </Link>
                  )}
                  <ul className="lg:col-span-7 flex flex-col gap-0 divide-y divide-gray-100">
                    {side.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/news/${p.slug}`}
                          className="flex gap-3 py-3 group first:pt-0"
                        >
                          <div className="relative w-20 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={img(p)}
                              alt=""
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-105 transition-transform"
                              sizes="80px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] md:text-[13px] font-semibold text-gray-900 font-[Inter] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                              {p.title}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1 font-[Inter]">{fmtShort(p)}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          }

          if (L === 1) {
            return (
              <article
                key={slug + i}
                className="relative rounded-2xl border border-gray-900/10 bg-gradient-to-br from-white via-white to-primary/5 px-4 py-6 md:px-8 md:py-8 scroll-mt-8 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="relative flex flex-col md:flex-row md:items-start gap-6">
                  <div className="md:w-[38%] shrink-0 md:border-r md:border-gray-200 md:pr-8">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.35em] font-[Inter] mb-3">
                      Title card
                    </p>
                    <h3 className="text-4xl md:text-5xl font-black text-gray-950 font-[Playfair_Display] leading-[0.95] tracking-tight mb-4">
                      {category.name}
                      <span className="text-primary">.</span>
                    </h3>
                    <Link
                      href={`/${slug}`}
                      className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-900 border-b-2 border-primary pb-0.5 hover:text-primary font-[Inter]"
                    >
                      View section <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="md:flex-1 space-y-3 min-w-0">
                    {posts.slice(0, 5).map((p, idx) => (
                      <div key={p.id}>
                        <Link href={`/news/${p.slug}`} className="flex gap-3 group items-start">
                          <span className="text-2xl font-black text-gray-200 font-[Playfair_Display] tabular-nums w-8 shrink-0 leading-none pt-0.5">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0 flex-1 border-b border-gray-100 pb-3">
                            <p className="text-[13px] md:text-[14px] font-semibold text-gray-900 font-[Inter] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                              {p.title}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1 font-[Inter]">
                              {catName(p.category)} · {fmtShort(p)}
                            </p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          }

          return (
            <article
              key={slug + i}
              className="rounded-2xl bg-gray-950 text-white overflow-hidden scroll-mt-8 border border-gray-800"
            >
              <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10">
                <h3 className="text-xl font-bold font-[Playfair_Display]">{category.name}</h3>
                <Link
                  href={`/${slug}`}
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline font-[Inter]"
                >
                  Desk →
                </Link>
              </div>
              <div className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {posts.slice(0, 5).map((p) => (
                  <Link
                    key={p.id}
                    href={`/news/${p.slug}`}
                    className="group rounded-xl bg-white/5 border border-white/10 p-3 hover:bg-white/10 transition-colors"
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-gray-800">
                      <Image
                        src={img(p)}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all"
                        sizes="(max-width:768px) 100vw, 20vw"
                      />
                    </div>
                    <p className="text-[11px] md:text-[12px] font-semibold text-white/95 font-[Inter] leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                      {p.title}
                    </p>
                    <p className="text-[9px] text-white/45 mt-1.5 font-[Inter]">{fmtShort(p)}</p>
                  </Link>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Typography-forward row: four small “openers” with 3 links each (secondary slice).
 */
export function HomeTitleCardBand({ items = [] }) {
  const active = items.filter((x) => x.posts?.length > 0);
  if (!active.length) return null;

  return (
    <section className="bg-white border-y border-gray-200">
      <div className="max-w-[1280px] mx-auto px-4 py-10 md:py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-14 bg-primary rounded-full" />
          <h2 className="text-sm md:text-base font-black uppercase tracking-[0.2em] text-gray-900 font-[Inter]">
            Quick scan · four desks
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {active.map(({ category, posts }) => {
            const slug = category?.slug || "news";
            return (
              <div
                key={slug}
                className="rounded-xl border-2 border-gray-900/90 bg-[#fafafa] p-4 flex flex-col min-h-[220px] shadow-[4px_4px_0_0_rgba(17,24,39,0.12)]"
              >
                <div className="flex items-start justify-between gap-2 mb-4">
                  <h3 className="text-2xl font-black text-gray-950 font-[Playfair_Display] leading-none">
                    {category.name}
                  </h3>
                  <Link
                    href={`/${slug}`}
                    className="text-primary hover:opacity-80 shrink-0"
                    aria-label={`More ${category.name}`}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                <ul className="space-y-2.5 mt-auto">
                  {posts.slice(0, 3).map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/news/${p.slug}`}
                        className="text-[12px] font-semibold text-gray-800 font-[Inter] leading-snug line-clamp-2 hover:text-primary transition-colors block"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Dense two-column headline river for extra scroll depth.
 */
export function HomeHeadlinesRiver({ posts = [], title = "Still reporting" }) {
  const list = posts.filter(Boolean);
  if (list.length < 4) return null;

  return (
    <section className="bg-[#f3f4f6]/80 border-t border-gray-200">
      <div className="max-w-[1280px] mx-auto px-4 py-10 md:py-12">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-950 font-[Playfair_Display]">{title}</h2>
          <p className="text-[12px] text-gray-500 font-[Inter] max-w-sm">
            Fresh lines from the wire—keep scrolling for a fuller picture of the day.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 border-t border-gray-300/80">
          {list.map((p) => (
            <Link
              key={p.id}
              href={`/news/${p.slug}`}
              className="flex gap-3 py-3.5 group items-start border-b border-gray-200"
            >
              <span className="w-2 h-2 rounded-sm bg-primary shrink-0 mt-1.5" aria-hidden />
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-[Inter] mb-0.5">
                  {catName(p.category)} · {fmtShort(p)}
                </p>
                <p className="text-[14px] font-semibold text-gray-900 font-[Inter] leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {p.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
