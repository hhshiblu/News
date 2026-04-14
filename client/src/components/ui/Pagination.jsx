import Link from "next/link";

function clampPage(n, totalPages) {
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, Math.max(1, totalPages));
}

function buildHref(basePath, p, paramName, preserveParams) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(preserveParams || {})) {
    if (v === undefined || v === null || v === "") continue;
    if (k === paramName) continue;
    params.set(k, String(v));
  }
  if (p > 1) params.set(paramName, String(p));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/**
 * @param {string} paramName - default "page"; use "allPage" for archive-style second pagers
 * @param {Record<string,string|number>} preserveParams - extra query params to keep on every link
 */
export default function Pagination({
  basePath,
  currentPage,
  totalPages,
  className = "",
  paramName = "page",
  preserveParams = {},
}) {
  const tp = Math.max(1, totalPages);
  const cp = clampPage(currentPage, tp);
  if (tp <= 1) return null;

  const href = (p) => buildHref(basePath, p, paramName, preserveParams);

  const windowSize = 5;
  let start = Math.max(1, cp - Math.floor(windowSize / 2));
  let end = Math.min(tp, start + windowSize - 1);
  if (end - start < windowSize - 1) start = Math.max(1, end - windowSize + 1);

  const nums = [];
  for (let i = start; i <= end; i++) nums.push(i);

  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 py-6 ${className}`}
      aria-label="Pagination"
    >
      {cp > 1 ? (
        <Link
          href={href(cp - 1)}
          className="inline-flex items-center justify-center min-w-9 px-3 py-2 rounded-lg border border-gray-200 bg-white text-[11px] font-black uppercase tracking-widest text-gray-800 hover:border-gray-900 hover:bg-gray-950 hover:text-white transition-colors font-[Inter]"
        >
          Prev
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center min-w-9 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-[11px] font-black uppercase tracking-widest text-gray-300 font-[Inter] cursor-not-allowed">
          Prev
        </span>
      )}

      {start > 1 && (
        <>
          <Link
            href={href(1)}
            className="inline-flex items-center justify-center min-w-9 h-9 rounded-lg border border-gray-200 bg-white text-[12px] font-bold text-gray-700 hover:border-primary hover:text-primary transition-colors font-[Inter]"
          >
            1
          </Link>
          {start > 2 && <span className="px-1 text-gray-300 text-xs">…</span>}
        </>
      )}

      {nums.map((n) =>
        n === cp ? (
          <span
            key={n}
            className="inline-flex items-center justify-center min-w-9 h-9 rounded-lg bg-gray-950 text-white text-[12px] font-bold font-[Inter] shadow-sm"
            aria-current="page"
          >
            {n}
          </span>
        ) : (
          <Link
            key={n}
            href={href(n)}
            className="inline-flex items-center justify-center min-w-9 h-9 rounded-lg border border-gray-200 bg-white text-[12px] font-bold text-gray-700 hover:border-primary hover:text-primary transition-colors font-[Inter]"
          >
            {n}
          </Link>
        )
      )}

      {end < tp && (
        <>
          {end < tp - 1 && <span className="px-1 text-gray-300 text-xs">…</span>}
          <Link
            href={href(tp)}
            className="inline-flex items-center justify-center min-w-9 h-9 rounded-lg border border-gray-200 bg-white text-[12px] font-bold text-gray-700 hover:border-primary hover:text-primary transition-colors font-[Inter]"
          >
            {tp}
          </Link>
        </>
      )}

      {cp < tp ? (
        <Link
          href={href(cp + 1)}
          className="inline-flex items-center justify-center min-w-9 px-3 py-2 rounded-lg border border-gray-200 bg-white text-[11px] font-black uppercase tracking-widest text-gray-800 hover:border-gray-900 hover:bg-gray-950 hover:text-white transition-colors font-[Inter]"
        >
          Next
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center min-w-9 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-[11px] font-black uppercase tracking-widest text-gray-300 font-[Inter] cursor-not-allowed">
          Next
        </span>
      )}

      <span className="w-full sm:w-auto sm:ml-2 text-center sm:text-left text-[10px] font-semibold text-gray-400 font-[Inter] mt-2 sm:mt-0">
        Page {cp} of {tp}
      </span>
    </nav>
  );
}
