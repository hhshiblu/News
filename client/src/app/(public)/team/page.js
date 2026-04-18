import { getPublicTeamMembersAction } from "@/actions/public-extra.action";

export const metadata = { title: "Our Team — LabourPulse", description: "Meet the LabourPulse team." };

export default async function TeamPage() {
  const teamMembers = await getPublicTeamMembersAction();
  return (
    <main className="bg-white min-h-screen">
      <section className="py-16 md:py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-center">
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

      <section className="py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="group block rounded-3xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                    <div>
                      <h3 className="text-xl font-bold text-white">{member.name}</h3>
                      <p className="text-sm text-gray-200">{member.role || "Contributor"}</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-[16px] font-bold text-gray-900">{member.name}</h3>
                <p className="text-[12px] text-gray-600">{member.role || "Contributor"}</p>
                <p className="mt-2 text-[12px] text-gray-600 line-clamp-3">{member.description || "Focused on verified reporting and meaningful public impact."}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
