import { getPublicPartnersAction } from "@/actions/public-extra.action";
import PartnerBrandCard from "@/components/partners/PartnerBrandCard";

export const metadata = {
  title: "Trusted Partners — LabourPulse",
  description: "Our active ecosystem partners and collaborators.",
};

export default async function PartnersPage() {
  const partners = await getPublicPartnersAction();
  return (
    <main className="mx-auto max-w-[1280px] space-y-8 px-4 py-12">
      <section className="rounded-3xl bg-gradient-to-r from-gray-900 to-gray-700 p-8 text-white md:p-12">
        <h1 className="mb-3 font-[Playfair_Display] text-3xl font-bold md:text-5xl">Trusted Partners</h1>
        <p className="max-w-2xl text-[13px] text-gray-200 md:text-[14px]">
          We collaborate with credible institutions, technology platforms, and knowledge networks to deliver better
          reporting quality and verified public-interest journalism.
        </p>
      </section>

      <section aria-label="Partners">
        <h2 className="mb-4 text-center text-[10px] font-black uppercase tracking-[0.22em] text-accent font-[Inter]">
          Trusted Partners
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <article
              key={partner.id}
              className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <PartnerBrandCard partner={partner} layout="grid" />
              <div>
                <h3 className="text-[14px] font-bold text-gray-900">{partner.name}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-gray-600">
                  {partner.description || "Ecosystem collaborator and verified media partner."}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
