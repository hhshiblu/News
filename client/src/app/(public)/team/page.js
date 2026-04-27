import { getPublicTeamMembersAction } from "@/actions/public-extra.action";

export const metadata = { title: "Our Team — LabourPulse", description: "Meet the LabourPulse team." };

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
      <section className="py-16 md:py-20 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-center">
        <div className="max-w-[1280px] mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-[Playfair_Display] mb-4">The Faces of Truth</h1>
          <p className="max-w-3xl mx-auto text-[13px] md:text-[14px] text-gray-200">
            Our newsroom team combines reporting, fact-checking, visual storytelling and editorial
            strategy to keep public-interest journalism accurate, transparent and human-centered.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-gray-50 border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white border border-gray-100 p-5">
            <h3 className="text-[14px] font-bold text-gray-900">Why our team matters</h3>
            <p className="mt-2 text-[12px] text-gray-600">A strong team means faster verification and responsible reporting at scale.</p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 p-5">
            <h3 className="text-[14px] font-bold text-gray-900">Cross-desk collaboration</h3>
            <p className="mt-2 text-[12px] text-gray-600">Editors, reporters and researchers work together from briefing to publication.</p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 p-5">
            <h3 className="text-[14px] font-bold text-gray-900">Audience-first storytelling</h3>
            <p className="mt-2 text-[12px] text-gray-600">We focus on clarity, trust, and impact across web and mobile readers.</p>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-10 md:py-14 border-b border-gray-100">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Editorial Leads</h2>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Featured</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {featured.map((member) => (
                <article key={member.id} className="rounded-2xl border border-gray-200 bg-linear-to-br from-white to-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <img src={member.photoUrl} alt={member.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/15" />
                    <div>
                      <h3 className="text-[16px] font-bold text-gray-900">{member.name}</h3>
                      <p className="text-[12px] text-gray-600">{member.role || "Contributor"}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">
                        {member.department?.name || "General Desk"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-[12px] text-gray-600 line-clamp-3">
                    {member.description || "Focused on verified reporting and meaningful public impact."}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {departmentStats.length > 0 && (
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="max-w-[1280px] mx-auto px-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Team by desk</h2>
            <div className="flex flex-wrap gap-2">
              {departmentStats.map(([name, count]) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] font-semibold text-gray-700"
                >
                  <span>{name}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary">{count}</span>
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {roster.map((member) => (
              <div key={member.id} className="group block rounded-3xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-4/5 rounded-2xl overflow-hidden mb-4 grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-duration-700" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                    <div>
                      <h3 className="text-xl font-bold text-white">{member.name}</h3>
                      <p className="text-sm text-gray-200">{member.role || "Contributor"}</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-[16px] font-bold text-gray-900">{member.name}</h3>
                <p className="text-[12px] text-gray-600">{member.role || "Contributor"}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">{member.department?.name || "General Desk"}</p>
                <p className="mt-2 text-[12px] text-gray-600 line-clamp-3">{member.description || "Focused on verified reporting and meaningful public impact."}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
