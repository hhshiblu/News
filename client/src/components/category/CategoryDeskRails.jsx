import Link from "next/link";

const DOTS = [
  "bg-rose-600 ring-rose-600/25",
  "bg-amber-500 ring-amber-500/25",
  "bg-emerald-600 ring-emerald-600/25",
  "bg-sky-600 ring-sky-600/25",
  "bg-violet-600 ring-violet-600/25",
  "bg-primary ring-primary/25",
];

/**
 * Tag-based lanes: small “magazine tape” cards + list rows with circle bullets.
 * variant="reporter" — only top tags, compact type, rank + total count.
 * variant="compact" — tighter desk (e.g. category hub) without rank badges.
 */
export function CategoryTagRails({ lanes, heading = "By tag", variant = "default" }) {
  if (!lanes?.length) return null;
  const isReporter = variant === "reporter";
  const isCompact = variant === "compact" || isReporter;
  const list = isReporter ? lanes.slice(0, 4) : lanes;

  return (
    <section className={`relative ${isReporter ? "mb-7" : isCompact ? "mb-8" : "mb-10"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-gray-900/[0.03] rounded-xl pointer-events-none" />
      <div
        className={`relative border border-gray-200/80 rounded-xl bg-white overflow-hidden shadow-sm ${
          isCompact ? "" : "backdrop-blur-sm bg-white/90"
        }`}
      >
        <div
          className={`border-b border-gray-100 bg-gray-950 text-white flex items-center gap-2 ${
            isCompact ? "px-3 py-2" : "px-4 py-3"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 animate-pulse" />
          <h2
            className={`font-black uppercase tracking-widest font-[Inter] ${
              isCompact ? "text-[10px] tracking-[0.15em]" : "text-[11px] tracking-[0.2em]"
            }`}
          >
            {heading}
          </h2>
          {isReporter && (
            <span className="text-[9px] font-semibold text-white/60 ml-auto font-[Inter]">Top 4 by use</span>
          )}
          {variant === "compact" && !isReporter && (
            <span className="text-[9px] font-semibold text-white/60 ml-auto font-[Inter] shrink-0">
              Top 4 tags · 5 stories each
            </span>
          )}
        </div>
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 ${
            isCompact ? "p-3 gap-3" : "p-4 md:p-5 gap-4 md:gap-5"
          }`}
        >
          {list.map((lane, li) => (
            <div
              key={lane.slug || lane.name}
              className={`rounded-lg border border-gray-100 bg-gradient-to-b from-gray-50/90 to-white shadow-sm hover:shadow hover:border-primary/25 transition-all ${
                isCompact ? "p-3" : "p-4"
              }`}
            >
              <div className={`flex items-center gap-2 ${variant === "reporter" ? "mb-2" : "mb-3"}`}>
                {isReporter && (
                  <span className="text-[9px] font-black tabular-nums text-gray-500 font-[Inter] w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center shrink-0 bg-white">
                    {li + 1}
                  </span>
                )}
                <Link
                  href={`/tag/${lane.slug}`}
                  className="inline-flex items-center gap-1.5 group/tag min-w-0 flex-1"
                >
                  {!isReporter && (
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ring-2 ${DOTS[li % DOTS.length]}`}
                      aria-hidden
                    />
                  )}
                  <span
                    className={`font-black uppercase tracking-widest text-primary group-hover/tag:underline font-[Inter] truncate ${
                      isCompact ? "text-[10px]" : "text-[11px]"
                    }`}
                  >
                    #{lane.name}
                  </span>
                </Link>
              </div>
              {isReporter && lane.totalCount != null && (
                <p className="text-[9px] font-bold text-gray-400 font-[Inter] mb-2">{lane.totalCount} stories tagged</p>
              )}
              <ul className={isCompact ? "space-y-1.5" : "space-y-2.5"}>
                {lane.posts.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/news/${p.slug}`}
                      className={`flex gap-2 items-start group text-gray-800 font-[Inter] leading-snug ${
                        isCompact ? "text-[11px] font-medium" : "text-[12px] font-semibold gap-2.5"
                      }`}
                    >
                      <span
                        className={`rounded-full shrink-0 ring-2 ${DOTS[(li + 1) % DOTS.length]} ${
                          isCompact ? "w-1 h-1 mt-1.5 ring-1" : "w-1.5 h-1.5 mt-1.5"
                        }`}
                        aria-hidden
                      />
                      <span className="line-clamp-2 group-hover:text-primary transition-colors">{p.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Category-name lanes (e.g. reporter portfolio). */
export function ReporterDeskRails({ categoryLanes, tagLanes }) {
  const hasCat = categoryLanes?.length > 0;
  const hasTag = tagLanes?.length > 0;
  if (!hasCat && !hasTag) return null;
  return (
    <div className="space-y-10 mb-12">
      {hasCat && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent max-w-12" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 font-[Inter]">
              Latest by category
            </h2>
            <span className="h-px flex-1 bg-gradient-to-r from-gray-300 via-transparent to-transparent" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryLanes.map((lane, li) => (
              <div
                key={lane.name}
                className="rounded-xl border border-dashed border-gray-200 bg-white p-4 hover:border-primary/40 transition-colors"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 font-[Inter]">
                  {lane.name}
                </p>
                <ul className="space-y-2">
                  {lane.posts.map((p) => (
                    <li key={p.id}>
                      <Link href={`/news/${p.slug}`} className="flex gap-2 items-start group">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 ring-2 ${DOTS[li % DOTS.length]}`}
                          aria-hidden
                        />
                        <span className="text-[12px] font-medium text-gray-800 line-clamp-2 font-[Inter] group-hover:text-primary">
                          {p.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
      {hasTag && <CategoryTagRails lanes={tagLanes} heading="Latest by tag" />}
    </div>
  );
}
