import Link from "next/link";
import { Hash, TrendingUp, Zap, Flame, BookOpen } from "lucide-react";
import { getCategories } from "@/actions/public";

export const metadata = {
  title: "Topics & Tags — LabourPulse",
  description: "Browse news by topics: Breaking News, Trending, Hot News, and all category tags.",
};

const SPECIAL_TAGS = [
  {
    slug: "breaking-news",
    label: "Breaking News",
    desc: "Real-time alerts and critical updates as they happen.",
    icon: Zap,
    color: "#DD0000",
    bg: "#fff5f5",
    border: "#DD0000",
  },
  {
    slug: "trending",
    label: "Trending Now",
    desc: "The most-read stories right now across LabourPulse.",
    icon: TrendingUp,
    color: "#C41E3A",
    bg: "#fef2f2",
    border: "#C41E3A",
  },
  {
    slug: "hot-news",
    label: "Hot News",
    desc: "Stories catching fire — high engagement, breaking context.",
    icon: Flame,
    color: "#f97316",
    bg: "#fff7ed",
    border: "#f97316",
  },
  {
    slug: "must-read",
    label: "Must Read",
    desc: "Editor-curated stories every serious reader shouldn't miss.",
    icon: BookOpen,
    color: "#1E5B8A",
    bg: "#eff6ff",
    border: "#1E5B8A",
  },
];

export default async function TagIndexPage() {
  const catRes = await getCategories();
  const categories = (catRes?.data || []).filter((c) => c.slug && c.name);

  return (
    <main className="bg-white min-h-screen">
      {/* ── HERO ── */}
      <section className="bg-gray-950 py-16 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/10 -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="max-w-[1280px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6 font-[Inter]">
            <Hash size={12} /> Topic Discovery
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white font-[Playfair_Display] leading-tight mb-4 italic">
            Explore by <span className="text-primary">Topic</span>
          </h1>
          <p className="text-gray-400 text-[16px] max-w-2xl mx-auto font-[Inter] leading-relaxed">
            From breaking urgent alerts to deep-dive category archives — navigate every story by topic.
          </p>
        </div>
      </section>

      {/* ── SPECIAL TAGS ── */}
      <section className="max-w-[1280px] mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-6 bg-primary rounded-full shrink-0" />
          <h2 className="text-[13px] font-black uppercase tracking-[0.22em] text-gray-900 font-[Inter]">
            Special Collections
          </h2>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SPECIAL_TAGS.map((tag) => {
            const Icon = tag.icon;
            return (
              <Link
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                className="group relative overflow-hidden border-2 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{ borderColor: tag.border, background: tag.bg }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center mb-4 text-white"
                  style={{ background: tag.color }}
                >
                  <Icon size={20} />
                </div>
                <h3 className="text-[16px] font-black text-gray-900 font-[Playfair_Display] mb-2">
                  {tag.label}
                </h3>
                <p className="text-[12px] text-gray-500 font-[Inter] leading-relaxed mb-4">
                  {tag.desc}
                </p>
                <div
                  className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest font-[Inter]"
                  style={{ color: tag.color }}
                >
                  Browse stories →
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── CATEGORY TAGS ── */}
      {categories.length > 0 && (
        <section className="bg-[#f8f9fa] border-t border-gray-200 py-12 md:py-16">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-accent rounded-full shrink-0" />
              <h2 className="text-[13px] font-black uppercase tracking-[0.22em] text-gray-900 font-[Inter]">
                Category Topics
              </h2>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/tag/${cat.slug}`}
                  className="group flex items-center gap-2.5 p-3 bg-white border border-gray-200 hover:border-primary hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <Hash size={12} className="shrink-0 text-gray-300 group-hover:text-white" />
                  <span className="text-[12.5px] font-bold text-gray-700 group-hover:text-white font-[Inter] truncate">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── QUICK LINKS  ── */}
      <section className="max-w-[1280px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/breaking" className="group flex items-center gap-4 bg-red-600 text-white p-6 hover:bg-red-700 transition-colors">
            <Zap size={24} className="fill-white shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest font-[Inter] text-red-200 mb-1">Full Page</p>
              <h3 className="text-[16px] font-bold font-[Playfair_Display]">Breaking News Hub →</h3>
            </div>
          </Link>
          <Link href="/tag/trending" className="group flex items-center gap-4 bg-gray-900 text-white p-6 hover:bg-gray-950 transition-colors">
            <TrendingUp size={24} className="shrink-0 text-primary" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest font-[Inter] text-gray-400 mb-1">Most Popular</p>
              <h3 className="text-[16px] font-bold font-[Playfair_Display]">Trending Stories →</h3>
            </div>
          </Link>
          <Link href="/editorial" className="group flex items-center gap-4 bg-accent text-white p-6 hover:opacity-90 transition-opacity">
            <BookOpen size={24} className="shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest font-[Inter] text-blue-200 mb-1">In-depth</p>
              <h3 className="text-[16px] font-bold font-[Playfair_Display]">Editorial Archive →</h3>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
