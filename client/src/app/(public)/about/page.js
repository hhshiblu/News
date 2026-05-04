import Image from "next/image";
import Link from "next/link";
import { Heart, Globe, Shield, Users, BookOpen, Newspaper, ChevronRight, Quote } from "lucide-react";

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
    color: "#059669",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "A growing space for connection, reflection, and meaningful conversations about the world of work.",
    color: "#B8860B",
  },
];

const STATS = [
  { number: "50+", label: "Contributors Worldwide" },
  { number: "12K+", label: "Stories Published" },
  { number: "30+", label: "Countries Covered" },
  { number: "1M+", label: "Monthly Readers" },
];

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* ━━━ HERO SECTION ━━━ */}
      <section className="relative overflow-hidden">
        {/* Soft gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#fef2f2] via-white to-[#eff6ff]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/4" />

        <div className="relative max-w-[1280px] mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Text */}
            <div className="flex-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 font-[Inter]">
                <Newspaper size={12} />
                About LabourPulse
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-950 font-[Playfair_Display] leading-tight mb-6">
                Because When Workers Are Heard,{" "}
                <span className="text-primary italic">the World Listens Differently.</span>
              </h1>
              <p className="text-[15px] md:text-[16px] text-gray-600 leading-relaxed font-[Inter] mb-8">
                Behind every skyline, every shipment, and every service we rely on, there are workers
                whose stories rarely reach the headlines. Their hands build, carry, clean, stitch, and
                sustain the world — often in silence. Their struggles are real, their dignity
                undeniable, and their resilience deserves to be seen and heard.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-primary text-white text-[12px] font-black uppercase tracking-widest rounded-full hover:bg-primary-dark transition-all shadow-sm hover:shadow-md font-[Inter]"
                >
                  Get in Touch
                </Link>
                <Link
                  href="/team"
                  className="px-6 py-3 border-2 border-gray-900 text-gray-900 text-[12px] font-black uppercase tracking-widest rounded-full hover:bg-gray-900 hover:text-white transition-all font-[Inter]"
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-primary font-[Playfair_Display] mb-1">
                  {stat.number}
                </p>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest font-[Inter]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ OUR MISSION ━━━ */}
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Image column */}
            <div className="flex-shrink-0 w-full lg:w-[380px]">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <Image
                  src="/images/about-mission.jpg"
                  alt="Our mission"
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 380px"
                />
              </div>
            </div>

            {/* Text column */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-primary rounded-full" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-primary font-[Inter]">
                  Our Mission
                </h2>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-950 font-[Playfair_Display] leading-tight mb-6">
                To Humanize the Statistics of the Global Workforce
              </h3>
              <div className="space-y-4 text-[14px] md:text-[15px] text-gray-600 leading-relaxed font-[Inter]">
                <p>
                  <strong className="text-gray-900">The Labour Pulse was created to break that silence.</strong>{" "}
                  Our mission is simple: to humanize the statistics of the global workforce and bring
                  real people back to the center of the story.
                </p>
                <p>
                  We are an independent global digital platform. We focus on workers' rights, migration,
                  labour conditions, and the economic realities that shape everyday lives. We do not
                  report from a distance — we report from within the realities people live every day.
                </p>
                <p>
                  This platform exists because too many voices remain unheard, too many stories go
                  untold, and too many lives are reduced to numbers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ PULLQUOTE ━━━ */}
      <section className="bg-[#fef2f2] py-12 md:py-16 border-y border-primary/10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Quote size={36} className="mx-auto text-primary/30 mb-4" />
          <blockquote className="text-xl md:text-2xl font-bold text-gray-900 font-[Playfair_Display] leading-relaxed italic mb-4">
            &ldquo;At The Labour Pulse, we believe that behind every number is a human being.&rdquo;
          </blockquote>
          <p className="text-[13px] text-gray-500 font-[Inter]">
            — The Labour Pulse Editorial
          </p>
        </div>
      </section>

      {/* ━━━ WHAT WE DO ━━━ */}
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="flex-shrink-0 w-full lg:w-[380px]">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <Image
                  src="/images/about-stories.jpg"
                  alt="Real stories from real people"
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 380px"
                />
              </div>
            </div>

            {/* Text */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-accent rounded-full" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-accent font-[Inter]">
                  What We Do
                </h2>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-950 font-[Playfair_Display] leading-tight mb-6">
                Real Stories from Real People
              </h3>
              <div className="space-y-4 text-[14px] md:text-[15px] text-gray-600 leading-relaxed font-[Inter]">
                <p>
                  We focus on real stories from real people — workers, migrants, and families whose
                  experiences shape economies across the world. We go beyond headlines to understand
                  context, listen carefully, and report with honesty and respect.
                </p>
                <p>
                  Our contributors come from different countries, cultures, and backgrounds. Their
                  voices reflect the strength, complexity, and diversity of the global workforce.
                </p>
                <p>
                  We take our responsibility seriously. Every piece of content is guided by truth,
                  fairness, and ethical journalism. Our purpose is not only to inform, but also to
                  create awareness, spark meaningful conversations, and deepen understanding of the
                  world of work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ VALUES GRID ━━━ */}
      <section className="bg-[#f8f9fa] py-14 md:py-20 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-gray-950 font-[Playfair_Display] mb-3">
              What Guides Us
            </h2>
            <p className="text-[14px] text-gray-500 font-[Inter] max-w-xl mx-auto">
              Our core values drive every story we publish, every voice we amplify.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{ background: `${v.color}15` }}
                  >
                    <Icon size={20} style={{ color: v.color }} />
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 font-[Inter] mb-2">
                    {v.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed font-[Inter]">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ LOOKING AHEAD ━━━ */}
      <section className="bg-white py-14 md:py-20 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen size={18} className="text-primary" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-primary font-[Inter]">
              Looking Ahead
            </h2>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-gray-950 font-[Playfair_Display] leading-tight mb-6">
            More Than a News Platform
          </h3>
          <div className="space-y-4 text-[14px] md:text-[15px] text-gray-600 leading-relaxed font-[Inter] text-left md:text-center">
            <p>
              Looking ahead, The Labour Pulse is more than a news platform. It is a growing space for
              connection, reflection, and change. A place where voices meet, realities are
              acknowledged, and a more just and dignified future of work can begin to take shape.
            </p>
            <p className="text-gray-900 font-bold text-[16px] md:text-[18px] font-[Playfair_Display] italic mt-6">
              Join us in sharing these stories. Be part of the conversation.
            </p>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-primary text-white text-[12px] font-black uppercase tracking-widest rounded-full hover:bg-primary-dark transition-all shadow-sm font-[Inter]"
            >
              Explore Stories
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-primary text-primary text-[12px] font-black uppercase tracking-widest rounded-full hover:bg-primary hover:text-white transition-all font-[Inter]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
