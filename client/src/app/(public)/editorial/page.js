import Link from "next/link";
import Image from "next/image";
import { Award, ShieldCheck, CheckCircle2, MessageSquare, AlertCircle, FileText, Scale, Fingerprint } from "lucide-react";
import { getNewsFeed } from "@/actions/public";

export const metadata = {
  title: "Editorial Policy — LabourPulse Standards",
  description: "Transparency in our journalistic standards, fact-checking, and correction policy.",
};

export default async function EditorialPolicyPage() {
  const pillars = [
    { title: "Accuracy", icon: CheckCircle2, desc: "We prioritize truth above all else, ensuring every fact is multi-sourced and verified." },
    { title: "Independence", icon: ShieldCheck, desc: "Our newsroom is strictly separated from commercial, political, or advertiser interests." },
    { title: "Fairness", icon: Scale, desc: "We provide diverse perspectives and right of reply to those mentioned in our reporting." },
    { title: "Privacy", icon: Fingerprint, desc: "Rigorous protection for anonymous whistleblowers and industrial informants." },
  ];

  const opinionRes = await getNewsFeed({ isOpinion: true, limit: 8 });
  const opinionPosts = opinionRes?.posts || [];

  return (
    <main className="bg-white min-h-screen">
      {/* ── HERO SECTION ── */}
      <section className="relative pt-24 pb-32 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="max-w-[1280px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <Award size={14} /> Our Journalistic Code
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white font-[Playfair_Display] leading-tight mb-8">
            The Integrity of <span className="text-primary italic">Every Word</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-[Inter] leading-relaxed mb-12">
            LabourPulse is dedicated to the highest standards of independent, high-impact journalism. 
            We believe that a well-informed public is essential to a healthy industrial society.
          </p>
        </div>
      </section>

      {/* ── CORE PILLARS ── */}
      <section className="py-24 border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {pillars.map((pillar, i) => (
              <div key={i} className="group">
                <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                   <pillar.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-[Playfair_Display]">{pillar.title}</h3>
                <p className="text-gray-500 leading-relaxed font-[Inter] text-sm">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DETAILED POLICIES ── */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Main Policy Content (A-Z style sections) */}
            <div className="lg:w-2/3 space-y-16">
              <section className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
                 <h3 className="text-2xl font-bold text-gray-900 font-[Playfair_Display] mb-6 flex items-center gap-3">
                   <CheckCircle2 className="text-primary" /> Fact-Checking Process
                 </h3>
                 <p className="text-gray-600 font-[Inter] leading-relaxed mb-6">
                   Every article published on LabourPulse undergoes a rigorous three-step verification process. 
                   We require a minimum of two independent sources for any controversial or investigative claim. 
                   Our internal team of researchers verifies technical data, legal filings, and industrial reports 
                   before publication.
                 </p>
              </section>

              <section className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
                 <h3 className="text-2xl font-bold text-gray-900 font-[Playfair_Display] mb-6 flex items-center gap-3">
                   <AlertCircle className="text-primary" /> Corrections Policy
                 </h3>
                 <p className="text-gray-600 font-[Inter] leading-relaxed mb-6">
                   LabourPulse is committed to correcting any errors quickly and transparently. 
                   If you believe we have made a mistake, please contact our editorial board. 
                   All significant corrections are clearly marked at the top of the article with a 
                   dedicated "Correction" note explaining the change and the reason for it.
                 </p>
                 <Link href="/contact" className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
                    Submit a Correction
                 </Link>
              </section>

              <section className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
                 <h3 className="text-2xl font-bold text-gray-900 font-[Playfair_Display] mb-6 flex items-center gap-3">
                   <Fingerprint className="text-primary" /> Protecting Sources
                 </h3>
                 <p className="text-gray-600 font-[Inter] leading-relaxed mb-6">
                   In situations where industrial informants or whistleblowers fear retaliation, 
                   we offer the option of anonymity. This is a privilege we grant only after 
                   verifying the source's identity and confirming through our legal department 
                   that the information is in the public interest.
                 </p>
              </section>
            </div>

            {/* Sidebar Resources */}
            <div className="lg:w-1/3">
              <div className="sticky top-24 space-y-8">
                 <div className="p-8 bg-primary rounded-3xl text-white shadow-2xl">
                    <h4 className="text-xl font-bold font-[Playfair_Display] mb-4">Editorial Inquiries</h4>
                    <p className="text-sm opacity-80 mb-6 font-[Inter] leading-relaxed">
                      For questions regarding our editorial board, syndication, or investigative methods.
                    </p>
                    <a href="mailto:editor@labourpulse.com" className="w-full py-4 bg-white text-primary font-black rounded-xl text-xs uppercase tracking-widest block text-center shadow-lg transition-transform hover:scale-[1.02]">
                      Email Editorial Board
                    </a>
                 </div>

                 <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50">
                    <h4 className="text-lg font-bold text-gray-900 font-[Playfair_Display] mb-4">Official Reports</h4>
                    <div className="space-y-4">
                       {[
                         "Transparency Report 2025",
                         "Diversity & Exclusion Data",
                         "Syndication Guidelines",
                         "Press Kit & Logos"
                       ].map(doc => (
                         <div key={doc} className="flex items-center justify-between py-2 border-b border-gray-50 group hover:border-primary transition-colors cursor-pointer">
                            <span className="text-sm font-bold text-gray-500 group-hover:text-primary transition-colors">{doc}</span>
                            <FileText size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ETHICS CALLOUT ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
           <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-8 border border-gray-100">
             <MessageSquare className="text-primary" size={32} />
           </div>
           <h2 className="text-4xl font-black text-gray-900 font-[Playfair_Display] mb-6">Transparency built into <br /> our everyday culture.</h2>
           <p className="text-gray-500 text-xl mb-12 font-[Inter]">We don't just write policies—we live by them. Every editorial meeting begins with a review of our core pillars.</p>
           <Link href="/team" className="px-10 py-4 border-2 border-gray-900 text-gray-900 font-black rounded-2xl hover:bg-gray-900 hover:text-white transition-all uppercase tracking-widest text-xs">
             Learn about our Team
           </Link>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50/40 py-20">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="mb-8 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-gray-900 font-[Playfair_Display]">Latest Opinions</h2>
            <Link href="/opinion" className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary-dark">
              View all
            </Link>
          </div>
          {opinionPosts.length === 0 ? (
            <p className="text-sm text-gray-500">No opinion articles yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {opinionPosts.map((p) => (
                <Link key={p.id} href={`/news/${p.slug}`} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all">
                  <div className="relative aspect-16/10 bg-gray-100">
                    {p.featuredImage ? (
                      <Image src={p.featuredImage} alt={p.title} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Opinion</p>
                    <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-3">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
