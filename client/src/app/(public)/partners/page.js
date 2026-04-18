import { getPublicPartnersAction } from "@/actions/public-extra.action";

export const metadata = {
  title: "Trusted Partners — LabourPulse",
  description: "Our active ecosystem partners and collaborators.",
};

export default async function PartnersPage() {
  const partners = await getPublicPartnersAction();
  return (
    <main className="max-w-[1280px] mx-auto px-4 py-12 space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-gray-900 to-gray-700 text-white p-8 md:p-12">
        <h1 className="text-3xl md:text-5xl font-bold font-[Playfair_Display] mb-3">Trusted Partners</h1>
        <p className="text-[13px] md:text-[14px] text-gray-200 max-w-2xl">
          We collaborate with credible institutions, technology platforms, and knowledge networks
          to deliver better reporting quality and verified public-interest journalism.
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-4">
        <div className="ticker-track">
          {[...partners, ...partners].map((partner, idx) => (
            <a
              key={`${partner.id}-${idx}`}
              href={partner.websiteUrl || "#"}
              target={partner.websiteUrl ? "_blank" : undefined}
              rel={partner.websiteUrl ? "noopener noreferrer" : undefined}
              className="group relative h-24 w-[180px] rounded-xl border border-gray-100 bg-white p-3 mx-1.5 shrink-0 flex items-center justify-center overflow-hidden"
            >
              <img src={partner.logoUrl} alt={partner.name} className="max-h-12 object-contain" />
              <div className="absolute inset-0 bg-black/60 text-white text-[12px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-center px-2">
                {partner.name}
              </div>
            </a>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {partners.map((partner) => (
          <a
            key={partner.id}
            href={partner.websiteUrl || "#"}
            target={partner.websiteUrl ? "_blank" : undefined}
            rel={partner.websiteUrl ? "noopener noreferrer" : undefined}
            className="rounded-2xl border border-gray-100 bg-white p-4 hover:shadow-md transition-shadow"
          >
            <img src={partner.logoUrl} alt={partner.name} className="h-10 object-contain mb-3" />
            <h3 className="text-[14px] font-bold text-gray-900">{partner.name}</h3>
            <p className="text-[12px] text-gray-600 mt-1">{partner.description || "Ecosystem collaborator and verified media partner."}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
