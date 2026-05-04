import Image from "next/image";
import Link from "next/link";
import { Users, ArrowRight, Mail, Globe } from "lucide-react";
import { getPublicTeamMembersAction } from "@/actions/public-extra.action";

export const metadata = {
  title: "Our Team — LabourPulse",
  description:
    "Meet the LabourPulse team — reporters, editors, and contributors from around the world committed to truthful labour journalism.",
};

export default async function TeamPage() {
  const teamMembers = await getPublicTeamMembersAction();
  const featured = teamMembers.slice(0, 3);
  const roster = teamMembers.slice(3);
  const departmentMap = teamMembers.reduce((acc, member) => {
    const key = member?.department?.name || "General Desk";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const departmentStats = Object.entries(departmentMap).sort((a, b) => b[1] - a[1]);

  return (
    <main className="bg-white min-h-screen">
      {/* ━━━ HERO SECTION — Light gradient ━━━ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fef2f2] via-white to-[#f0f9ff]" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full -translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-[1280px] mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 font-[Inter]">
            <Users size={12} />
            Our Team
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-950 font-[Playfair_Display] leading-tight mb-5">
            The Faces of <span className="text-primary italic">Truth</span>
          </h1>
          <p className="max-w-3xl mx-auto text-[14px] md:text-[15px] text-gray-600 leading-relaxed font-[Inter] mb-8">
            Our newsroom team combines reporting, fact-checking, visual storytelling and editorial
            strategy to keep public-interest journalism accurate, transparent and human-centered.
            Every story passes through rigorous editorial review before publication.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-primary text-[12px] font-black uppercase tracking-widest hover:gap-3 transition-all font-[Inter]"
          >
            Learn About LabourPulse <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ━━━ INFO CARDS ━━━ */}
      <section className="py-10 md:py-14 bg-[#f8f9fa] border-y border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <Users size={18} className="text-primary" />
            </div>
            <h3 className="text-[15px] font-bold text-gray-900 font-[Inter] mb-2">Why our team matters</h3>
            <p className="text-[13px] text-gray-500 leading-relaxed font-[Inter]">
              A strong team means faster verification, responsible reporting at scale, and stories
              that truly represent the communities we cover.
            </p>
          </div>
          <div className="rounded-xl bg-white border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
              <Globe size={18} className="text-accent" />
            </div>
            <h3 className="text-[15px] font-bold text-gray-900 font-[Inter] mb-2">Cross-desk collaboration</h3>
            <p className="text-[13px] text-gray-500 leading-relaxed font-[Inter]">
              Editors, reporters and researchers work together from briefing to publication, ensuring
              every angle is covered with precision.
            </p>
          </div>
          <div className="rounded-xl bg-white border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/10 flex items-center justify-center mb-3">
              <Mail size={18} className="text-emerald-600" />
            </div>
            <h3 className="text-[15px] font-bold text-gray-900 font-[Inter] mb-2">Audience-first storytelling</h3>
            <p className="text-[13px] text-gray-500 leading-relaxed font-[Inter]">
              We focus on clarity, trust, and impact — crafting stories that resonate with readers
              across web and mobile platforms.
            </p>
          </div>
        </div>
      </section>

      {/* ━━━ EDITORIAL LEADS (Featured 3) ━━━ */}
      {featured.length > 0 && (
        <section className="py-12 md:py-16 border-b border-gray-100">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-primary rounded-full" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-900 font-[Inter]">
                  Editorial Leads
                </h2>
              </div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-[Inter]">
                Featured
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((member) => (
                <article
                  key={member.id}
                  className="group rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Photo */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-[16px] font-bold text-gray-900 font-[Inter] mb-0.5">
                      {member.name}
                    </h3>
                    <p className="text-[12px] text-gray-500 font-[Inter]">
                      {member.role || "Contributor"}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-2 font-[Inter]">
                      {member.department?.name || "General Desk"}
                    </p>
                    <p className="mt-3 text-[13px] text-gray-500 line-clamp-3 leading-relaxed font-[Inter]">
                      {member.description ||
                        "Focused on verified reporting and meaningful public impact."}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ━━━ DEPARTMENT STATS ━━━ */}
      {departmentStats.length > 0 && (
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="max-w-[1280px] mx-auto px-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 font-[Inter]">
              Team by desk
            </h2>
            <div className="flex flex-wrap gap-2">
              {departmentStats.map(([name, count]) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] font-semibold text-gray-700 font-[Inter]"
                >
                  <span>{name}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary">
                    {count}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ━━━ FULL ROSTER ━━━ */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-12 bg-gray-900 rounded-full" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-900 font-[Inter]">
              Full Team
            </h2>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {roster.map((member) => (
              <div
                key={member.id}
                className="group rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Photo with overlay */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-[12px] font-[Inter] line-clamp-3">
                      {member.description ||
                        "Focused on verified reporting and meaningful public impact."}
                    </p>
                  </div>
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="text-[14px] font-bold text-gray-900 font-[Inter]">
                    {member.name}
                  </h3>
                  <p className="text-[12px] text-gray-500 font-[Inter]">
                    {member.role || "Contributor"}
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-primary mt-1 font-[Inter]">
                    {member.department?.name || "General Desk"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ JOIN CTA ━━━ */}
      <section className="bg-[#fef2f2] py-12 md:py-16 border-t border-primary/10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-gray-950 font-[Playfair_Display] mb-4">
            Want to Join Our Team?
          </h2>
          <p className="text-[14px] text-gray-600 font-[Inter] leading-relaxed mb-8">
            We are always looking for passionate journalists, editors, and contributors who believe in
            giving voice to the unheard.
          </p>
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white text-[12px] font-black uppercase tracking-widest rounded-full hover:bg-primary-dark transition-all shadow-sm font-[Inter]"
          >
            View Open Positions <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
