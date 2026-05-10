import Image from "next/image";
import Link from "next/link";
import { Users, ArrowRight, Mail, Globe, Award, ShieldCheck, PenTool } from "lucide-react";
import { getPublicTeamMembersAction } from "@/actions/public-extra.action";

export const metadata = {
  title: "Our Team — LabourPulse",
  description:
    "Meet the LabourPulse team — supervisors, reporters, and editors from around the world committed to truthful labour journalism.",
};

const DEPT_ICONS = {
  "Supervisor": Award,
  "Reporter": PenTool,
  "Editorial": ShieldCheck,
};

export default async function TeamPage() {
  const teamMembers = await getPublicTeamMembersAction();

  // Group members by department
  const groupedMembers = teamMembers.reduce((acc, member) => {
    const deptName = member?.department?.name || "General Desk";
    if (!acc[deptName]) acc[deptName] = [];
    acc[deptName].push(member);
    return acc;
  }, {});

  // Define priority sorting for departments
  const sortedDepartmentNames = Object.keys(groupedMembers).sort((a, b) => {
    const p = { "Supervisor": 1, "Reporter": 2, "Editorial": 1000 };
    const aP = p[a] || 500;
    const bP = p[b] || 500;
    if (aP !== bP) return aP - bP;
    return a.localeCompare(b);
  });

  return (
    <main className="bg-white min-h-screen">
      {/* ━━━ HERO SECTION ━━━ */}
      <section className="relative overflow-hidden px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f2fdf7] via-white to-[#f0f9ff]" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#00a651]/5 rounded-full -translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-[1280px] mx-auto py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00a651]/10 text-[#00a651] text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 font-[Inter]">
            <Users size={12} />
            Our Team
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-950 font-[Playfair_Display] leading-tight mb-5">
            The Faces of <span className="text-[#00a651] italic">Truth</span>
          </h1>
          <p className="max-w-3xl mx-auto text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-[Inter] mb-8">
            Our newsroom team combines reporting, fact-checking, visual storytelling and editorial
            strategy to keep public-interest journalism accurate, transparent and human-centered.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-[#00a651] text-[12px] font-black uppercase tracking-widest hover:gap-3 transition-all font-[Inter]"
          >
            Learn About LabourPulse <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ━━━ INFO CARDS ━━━ */}
      <section className="py-10 md:py-14 bg-[#f8f9fa] border-y border-gray-100 px-4">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#00a651]/10 flex items-center justify-center mb-3">
              <Users size={18} className="text-[#00a651]" />
            </div>
            <h3 className="text-[14px] font-bold text-gray-900 font-[Inter] mb-2">Why our team matters</h3>
            <p className="text-[12px] text-gray-500 leading-relaxed font-[Inter]">
              A strong team means faster verification, responsible reporting at scale, and stories
              that truly represent the communities we cover.
            </p>
          </div>
          <div className="rounded-xl bg-white border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
              <Globe size={18} className="text-accent" />
            </div>
            <h3 className="text-[14px] font-bold text-gray-900 font-[Inter] mb-2">Cross-desk collaboration</h3>
            <p className="text-[12px] text-gray-500 leading-relaxed font-[Inter]">
              Editors, reporters and researchers work together from briefing to publication, ensuring
              every angle is covered with precision.
            </p>
          </div>
          <div className="rounded-xl bg-white border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#00a651]/10 flex items-center justify-center mb-3">
              <Mail size={18} className="text-[#00a651]" />
            </div>
            <h3 className="text-[14px] font-bold text-gray-900 font-[Inter] mb-2">Audience-first storytelling</h3>
            <p className="text-[12px] text-gray-500 leading-relaxed font-[Inter]">
              We focus on clarity, trust, and impact — crafting stories that resonate with readers
              across web and mobile platforms.
            </p>
          </div>
        </div>
      </section>

      {/* ━━━ TEAM BY DEPARTMENTS ━━━ */}
      <div className="py-12 md:py-20">
        {sortedDepartmentNames.map((deptName, idx) => {
          const members = groupedMembers[deptName];
          const Icon = DEPT_ICONS[deptName] || Users;

          return (
            <section 
              key={deptName} 
              className={`py-12 md:py-16 px-4 ${idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}
            >
              <div className="max-w-[1280px] mx-auto">
                {/* Department Header */}
                <div className="flex flex-col items-center mb-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#00a651]/10 flex items-center justify-center mb-4">
                    <Icon size={24} className="text-[#00a651]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-950 font-[Playfair_Display] uppercase tracking-tight">
                    {deptName}
                  </h2>
                  <div className="h-1 w-20 bg-[#00a651] mt-4 rounded-full" />
                </div>

                {/* Member Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {members.map((member) => (
                    <article
                      key={member.id}
                      className="group rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                    >
                      {/* Photo */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                        <img
                          src={member.photoUrl || "https://i.pravatar.cc/400"}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                          <p className="text-white text-[12px] font-[Inter] leading-relaxed line-clamp-4 italic">
                            &ldquo;{member.description || "Committed to delivering truthful stories that resonate with the heart of labour."}&rdquo;
                          </p>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5">
                        <h3 className="text-[14px] font-bold text-gray-900 font-[Inter] mb-1 group-hover:text-[#00a651] transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-[12px] text-gray-500 font-medium font-[Inter] mb-3">
                          {member.role || "Team Contributor"}
                        </p>
                        
                        <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                          <button className="text-gray-400 hover:text-[#00a651] transition-colors">
                            <Mail size={16} />
                          </button>
                          <button className="text-gray-400 hover:text-[#00a651] transition-colors">
                            <Globe size={16} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ━━━ JOIN CTA ━━━ */}
      <section className="bg-[#f2fdf7] py-16 md:py-24 border-t border-[#00a651]/10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Users size={32} className="text-[#00a651]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-950 font-[Playfair_Display] mb-4">
            Want to Join Our Team?
          </h2>
          <p className="text-[13px] md:text-[14px] text-gray-600 font-[Inter] leading-relaxed mb-10">
            We are always looking for passionate journalists, editors, and contributors who believe in
            giving voice to the unheard.
          </p>
          <Link
            href="/careers"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#00a651] hover:bg-[#008c44] text-white text-[12px] font-black uppercase tracking-widest rounded-full transition-all shadow-lg font-[Inter]"
          >
            View Open Positions <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
