import { FileText, Scale, CheckCircle, AlertTriangle, ShieldCheck, Globe } from "lucide-react";

export const metadata = {
  title: "Terms of Use — LabourPulse",
  description: "Read the terms and conditions for using the LabourPulse platform.",
};

export default function TermsPage() {
  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms" },
    { id: "content", title: "2. Intellectual Property" },
    { id: "usage", title: "3. User Conduct" },
    { id: "subscriptions", title: "4. Billing & Subscriptions" },
    { id: "liability", title: "5. Limitation of Liability" },
    { id: "governing-law", title: "6. Governing Law" },
  ];

  return (
    <main className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[#00a651] font-bold text-[10px] uppercase tracking-widest mb-3 font-[Inter]">
            <Scale size={14} />
            Legal Agreement
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-[Playfair_Display] text-gray-900 mb-4">Terms of Use</h1>
          <p className="text-gray-500 text-[12px] font-[Inter]">Last Updated: April 5, 2026</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* TOC Sidebar */}
          <aside className="lg:w-1/4">
            <div className="sticky top-24 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-[14px] font-bold text-gray-900 mb-3 font-[Playfair_Display] border-b pb-2">Sections</h3>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a 
                    key={s.id} 
                    href={`#${s.id}`}
                    className="block text-[12px] text-gray-500 hover:text-[#00a651] transition-colors py-1.5 font-[Inter] border-l-2 border-transparent hover:border-[#00a651] pl-3 hover:translate-x-1 transition-all"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Policy Content */}
          <article className="lg:w-3/4 bg-white p-4 md:p-10 rounded-2xl border border-gray-100 shadow-sm article-body">
            <section id="acceptance" className="mb-10 scroll-mt-24">
              <h2 className="text-[16px] font-bold text-gray-900 mb-4 font-[Playfair_Display]">1. Acceptance of Terms</h2>
              <p className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-[Inter]">
                By accessing and using LabourPulse, you accept and agree to be bound by the terms and provision of this agreement. 
                In addition, when using these particular services, you shall be subject to any posted guidelines or rules 
                applicable to such services.
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 flex gap-3 text-[12px] italic text-gray-600 font-[Inter]">
                <CheckCircle size={16} className="text-[#00a651] flex-shrink-0" />
                Any participation in this service will constitute acceptance of this agreement.
              </div>
            </section>

            <section id="content" className="mb-10 scroll-mt-24">
              <h2 className="text-[16px] font-bold text-gray-900 mb-4 font-[Playfair_Display]">2. Intellectual Property</h2>
              <p className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-[Inter]">
                The site and its original content, features, and functionality are owned by LabourPulse and are protected 
                by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary 
                rights laws.
              </p>
              <p className="mt-3 text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-[Inter]">
                You may not reproduce, distribute, or create derivative works from any part of LabourPulse without 
                explicit written permission from the editorial board.
              </p>
            </section>

            <section id="usage" className="mb-10 scroll-mt-24">
              <h2 className="text-[16px] font-bold text-gray-900 mb-4 font-[Playfair_Display]">3. User Conduct</h2>
              <p className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-[Inter]">You agree not to use the site for any purpose that is unlawful or prohibited by these Terms. You may not:</p>
              <ul className="text-[13px] md:text-[14px] text-gray-600 space-y-2 mt-3 list-disc pl-5">
                <li>Engage in any "scraping" or automated data collection.</li>
                <li>Attempt to gain unreporterized access to any portion of the site.</li>
                <li>Post or transmit any content that is defamatory, offensive, or infringing.</li>
                <li>Use the site in any manner that could disable, overburden, or impair the site's functionality.</li>
              </ul>
            </section>

            <section id="subscriptions" className="mb-10 scroll-mt-24">
              <h2 className="text-[16px] font-bold text-gray-900 mb-4 font-[Playfair_Display]">4. Billing & Subscriptions</h2>
              <p className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-[Inter]">
                LabourPulse offers premium subscription plans. By subscribing, you agree to pay the fees indicated 
                for that service. Payments will be charged on a pre-pay basis on the day you sign up and will cover 
                the use of that service for the period indicated.
              </p>
              <p className="mt-3 text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-[Inter]">
                Subscriptions will automatically renew unless cancelled by the user through the account dashboard.
              </p>
            </section>

            <section id="liability" className="mb-10 scroll-mt-24">
              <h2 className="text-[16px] font-bold text-gray-900 mb-4 font-[Playfair_Display]">5. Limitation of Liability</h2>
              <div className="p-5 bg-red-50 rounded-xl border border-red-100 mb-6">
                <p className="text-[12px] text-red-900 font-[Inter] leading-relaxed m-0">
                  <AlertTriangle size={14} className="inline mr-2 mb-1" />
                  LabourPulse and its components are offered for informational purposes only; THIS SITE SHALL NOT BE 
                  RESPONSIBLE OR LIABLE FOR THE ACCURACY, USEFULNESS OR AVAILABILITY OF ANY INFORMATION TRANSMITTED 
                  OR MADE AVAILABLE VIA THE SITE.
                </p>
              </div>
            </section>

            <section id="governing-law" className="mb-10 scroll-mt-24">
              <h2 className="text-[16px] font-bold text-gray-900 mb-4 font-[Playfair_Display]">6. Governing Law</h2>
              <p className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-[Inter]">
                These terms and conditions are governed by and construed in accordance with the laws of Bangladesh 
                and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center text-center">
              <ShieldCheck className="text-gray-300 mb-3" size={40} />
              <h4 className="text-[14px] font-bold text-gray-900 mb-2">Editor's Pledge</h4>
              <p className="text-[12px] text-gray-500 font-[Inter] leading-relaxed max-w-lg">
                We are committed to quality journalism and transparent legal practices. 
                Thank you for being part of the LabourPulse community.
              </p>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
