const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const metadata = {
  title: "Trusted Partners — LabourPulse",
  description: "Our active ecosystem partners and collaborators.",
};

async function getPartners() {
  try {
    const res = await fetch(`${API_BASE}/public/partners`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (_) {
    return [];
  }
}

export default async function PartnersPage() {
  const partners = await getPartners();
  return (
    <main className="max-w-[1280px] mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-[Playfair_Display] text-gray-900 mb-8">Trusted Partners</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {partners.map((partner) => (
          <a
            key={partner.id}
            href={partner.websiteUrl || "#"}
            target={partner.websiteUrl ? "_blank" : undefined}
            rel={partner.websiteUrl ? "noopener noreferrer" : undefined}
            className="group relative h-28 rounded-xl border border-gray-100 bg-white p-4 flex items-center justify-center overflow-hidden"
          >
            <img src={partner.logoUrl} alt={partner.name} className="max-h-14 object-contain" />
            <div className="absolute inset-0 bg-black/60 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-center px-2">
              {partner.name}
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
