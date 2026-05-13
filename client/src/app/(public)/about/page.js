import Image from "next/image";
import Link from "next/link";
import { Heart, Globe, Shield, Users, BookOpen, Newspaper, ChevronRight, Quote, Target, Lightbulb, Activity } from "lucide-react";
import { getPublicPartnersAction } from "@/actions/public-extra.action";

export const metadata = {
  title: "About Us — LabourPulse",
  description:
    "LabourPulse is an independent global digital platform focused on workers' rights, migration, labour conditions, and the economic realities that shape everyday lives.",
};

const VALUES = [
  {
    icon: Heart,
    title: "Truth & Fairness",
    desc: "Every piece of content is guided by honesty, accuracy, and ethical journalism.",
    color: "#C41E3A",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    desc: "Contributors from different countries, cultures, and backgrounds reflecting the diversity of the workforce.",
    color: "#1E5B8A",
  },
  {
    icon: Shield,
    title: "Dignity & Respect",
    desc: "We humanize the statistics and bring real people back to the center of the story.",
    color: "#00a651",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "A growing space for connection, reflection, and meaningful conversations about the world of work.",
    color: "#B8860B",
  },
];

const STATS = [
  { number: "50+", label: "Contributors Worldwide", icon: Globe },
  { number: "12K+", label: "Stories Published", icon: Newspaper },
  { number: "30+", label: "Countries Covered", icon: Target },
  { number: "1M+", label: "Monthly Readers", icon: Activity },
];

export default async function AboutPage() {
  const partners = await getPublicPartnersAction();
  return (
    <main className="bg-white min-h-screen">
      {/* ━━━ HERO SECTION ━━━ */}
      <section className="relative overflow-hidden px-4">
        {/* Soft gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f2fdf7] via-white to-[#eff6ff]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00a651]/5 rounded-full -translate-y-1/2 translate-x-1/4" />

        <div className="relative max-w-[1280px] mx-auto py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Text */}
            <div className="flex-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00a651]/10 text-[#00a651] text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 font-[Inter]">
                <Newspaper size={12} />
                About LabourPulse
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-950 font-[Playfair_Display] leading-tight mb-6">
                Because When Workers Are Heard,{" "}
                <span className="text-[#00a651] italic">the World Listens Differently.</span>
              </h1>
              <p className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-[Inter] mb-8">
                Behind every skyline, every shipment, and every service we rely on, there are workers
                whose stories rarely reach the headlines. Their hands build, carry, clean, stitch, and
                sustain the world — often in silence. Their struggles are real, their dignity
                undeniable, and their resilience deserves to be seen and heard.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-[#00a651] hover:bg-[#008c44] text-white text-[12px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg font-[Inter]"
                >
                  Get in Touch
                </Link>
                <Link
                  href="/team"
                  className="px-6 py-3 border-2 border-gray-900 text-gray-900 text-[12px] font-black uppercase tracking-widest rounded-lg hover:bg-gray-900 hover:text-white transition-all font-[Inter]"
                >
                  Meet the Team
                </Link>
              </div>
            </div>

            {/* Hero image */}
            <div className="flex-shrink-0 w-full lg:w-[420px]">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                <Image
                  src="/images/about-hero.jpg"
                  alt="Workers and journalism"
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 420px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white text-[13px] font-bold font-[Inter] leading-snug">
                    &ldquo;Behind every number is a human being.&rdquo;
                  </p>
                  <p className="text-white/60 text-[10px] mt-1 font-[Inter]">— The Labour Pulse</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ STATS BAR ━━━ */}
      <section className="border-y border-gray-100 bg-[#fafafa]">
        <div className="max-w-[1280px] mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-[#00a651]/10 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-[#00a651]" />
                  </div>
                  <p className="text-3xl md:text-4xl font-black text-gray-900 font-[Playfair_Display] mb-1">
                    {stat.number}
                  </p>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest font-[Inter]">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ OUR MISSION & GOAL ━━━ */}
      <section className="bg-white py-14 md:py-24 border-t border-gray-100 relative px-4">
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            {/* Image column */}
            <div className="flex-shrink-0 w-full lg:w-[450px]">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                <Image
                  src="/images/about-mission.jpg"
                  alt="Our mission"
                  fill
                  unoptimized
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width:1024px) 100vw, 450px"
                />
              </div>
            </div>

            {/* Text column */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-[#00a651] rounded-full" />
                <h2 className="text-[12px] font-black uppercase tracking-[0.25em] text-[#00a651] font-[Inter]">
                  Our Mission
                </h2>
              </div>
              <h3 className="text-2xl md:text-4xl font-black text-gray-950 font-[Playfair_Display] leading-tight mb-6">
                To Humanize the Statistics of the Global Workforce
              </h3>
              <div className="space-y-5 text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-[Inter]">
                <p>
                  <strong className="text-gray-900">The Labour Pulse was created to break the silence.</strong>{" "}
                  Our ultimate goal is simple: to humanize the statistics of the global workforce and bring
                  real people back to the center of the story.
                </p>
                <p>
                  We are an independent global digital platform. We focus on workers' rights, migration,
                  labour conditions, and the economic realities that shape everyday lives. We do not
                  report from a distance — we report from within the realities people live every day.
                </p>
                <div className="bg-gray-50 border-l-4 border-[#00a651] p-5 rounded-r-xl mt-6">
                  <p className="text-gray-900 italic font-[Playfair_Display] text-lg">
                    "This platform exists because too many voices remain unheard, too many stories go
                    untold, and too many lives are reduced to numbers. We aim to foster a community 
                    that understands the importance of fair wages, safety, and dignity for all workers."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ OUR CORE GOALS ━━━ */}
      <section className="bg-gray-900 py-16 md:py-24 text-white relative overflow-hidden px-4">
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Target size={18} className="text-[#00a651]" />
              <h2 className="text-[12px] font-black uppercase tracking-[0.25em] text-[#00a651] font-[Inter]">
                What We Aim For
              </h2>
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-white font-[Playfair_Display] leading-tight max-w-2xl mx-auto">
              Our Vision for the Future of Work
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 border border-gray-700/50 p-8 rounded-2xl backdrop-blur-sm hover:bg-gray-800 transition-colors">
              <div className="w-12 h-12 bg-[#00a651]/20 rounded-xl flex items-center justify-center mb-6">
                <Lightbulb size={24} className="text-[#00a651]" />
              </div>
              <h4 className="text-lg font-bold font-[Playfair_Display] mb-4">Illuminate Hidden Realities</h4>
              <p className="text-gray-400 text-[12px] leading-relaxed font-[Inter]">
                To shine a light on the unseen corners of the global supply chain, ensuring that exploitative practices are brought to public attention.
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 p-8 rounded-2xl backdrop-blur-sm hover:bg-gray-800 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <Users size={24} className="text-blue-400" />
              </div>
              <h4 className="text-lg font-bold font-[Playfair_Display] mb-4">Empower Through Knowledge</h4>
              <p className="text-gray-400 text-[12px] leading-relaxed font-[Inter]">
                To equip workers, advocates, and policymakers with the data and narratives needed to enforce fair labour laws and safety standards.
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 p-8 rounded-2xl backdrop-blur-sm hover:bg-gray-800 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
                <Globe size={24} className="text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold font-[Playfair_Display] mb-4">Foster Global Solidarity</h4>
              <p className="text-gray-400 text-[12px] leading-relaxed font-[Inter]">
                To bridge the gap between consumers and creators, building a global community that values dignity and living wages over cheap labor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ VALUES GRID ━━━ */}
      <section className="bg-[#f8f9fa] py-16 md:py-24 border-t border-gray-100 px-4">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-black text-gray-950 font-[Playfair_Display] mb-4">
              Our Core Values
            </h2>
            <p className="text-[13px] text-gray-500 font-[Inter] max-w-xl mx-auto">
              These principles guide every story we publish and every voice we amplify.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                    style={{ background: `${v.color}15` }}
                  >
                    <Icon size={24} style={{ color: v.color }} />
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 font-[Inter] mb-3">
                    {v.title}
                  </h3>
                  <p className="text-[12px] text-gray-500 leading-relaxed font-[Inter]">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ TRUSTED PARTNERS MARQUEE ━━━ */}
      {partners.length > 0 && (
        <section className="bg-[#f8f9fa] py-10 md:py-14 border-t border-gray-100">
          <div className="max-w-[1000px] mx-auto px-2 mb-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-1 w-10 bg-[#00a651] rounded-full" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-[#00a651] font-[Inter]">
                Trusted Partners
              </h2>
              <div className="h-1 w-10 bg-[#00a651] rounded-full" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-gray-950 font-[Playfair_Display] leading-tight">
              Organizations We Work With
            </h3>
          </div>

          <div className="w-full max-w-[1000px] mx-auto px-2">
            <div className="relative overflow-hidden rounded-xl bg-white/40">
              <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-r from-[#f8f9fa] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-[#f8f9fa] to-transparent z-10 pointer-events-none" />

              <div className="partners-marquee about-partners-ticker gap-4 py-3 [direction:ltr]">
                {[...partners, ...partners].map((p, i) => (
                  <a
                    key={`marq-${i}-${p.id}`}
                    href={p.websiteUrl || "#"}
                    target={p.websiteUrl ? "_blank" : undefined}
                    rel={p.websiteUrl ? "noopener noreferrer" : undefined}
                    className="shrink-0 flex h-16 w-[min(100%,11rem)] sm:h-20 sm:w-44 md:w-52 items-center justify-center rounded-lg border border-gray-200 bg-white px-2 shadow-sm hover:shadow-md hover:border-[#00a651]/40 transition-all"
                    title={p.name}
                  >
                    <img
                      src={p.logoUrl}
                      alt={p.name}
                      className="max-h-full w-full object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-[1000px] mx-auto px-2 text-center mt-6">
            <Link
              href="/partners"
              className="inline-flex items-center gap-2 px-5 py-2 border-2 border-gray-900 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-gray-900 hover:text-white transition-all font-[Inter]"
            >
              View All Partners <ChevronRight size={12} />
            </Link>
          </div>
        </section>
      )}

      {/* ━━━ PULLQUOTE ━━━ */}
      <section className="bg-white py-16 md:py-24 border-y border-gray-100 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Quote size={42} className="mx-auto text-[#00a651]/30 mb-6" />
          <blockquote className="text-xl md:text-3xl font-bold text-gray-900 font-[Playfair_Display] leading-relaxed italic mb-8">
            &ldquo;At The Labour Pulse, we believe that behind every statistic, every shipment, and every policy, there is a human being who deserves respect and fair treatment.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-[#00a651]"></div>
            <p className="text-[12px] font-bold uppercase tracking-widest text-gray-500 font-[Inter]">
              The Editorial Team
            </p>
            <div className="w-12 h-px bg-[#00a651]"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
