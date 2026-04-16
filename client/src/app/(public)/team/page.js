const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const metadata = { title: "Our Team — LabourPulse", description: "Meet the LabourPulse team." };

async function getTeamMembers() {
  try {
    const res = await fetch(`${API_BASE}/public/team-members`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (_) {
    return [];
  }
}

export default async function TeamPage() {
  const teamMembers = await getTeamMembers();
  return (
    <main className="bg-white min-h-screen">
      <section className="py-16 bg-gray-900 text-white text-center">
        <div className="max-w-[1280px] mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-[Playfair_Display] mb-6">The Faces of Truth</h1>
        </div>
      </section>
      <section className="py-14">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member) => (
              <a key={member.id} href={member.profileUrl || "#"} className="group block">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-6 shadow-xl grayscale hover:grayscale-0 transition-all duration-700">
                  <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                    <div>
                      <h3 className="text-xl font-bold text-white">{member.name}</h3>
                      <p className="text-sm text-gray-200">{member.role || "Contributor"}</p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
