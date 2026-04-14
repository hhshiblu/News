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
    <main className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-4 font-[Inter]">
            <Scale size={16} />
            Legal Agreement
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-[Playfair_Display] text-gray-900 mb-6">Terms of Use</h1>
          <p className="text-gray-500 font-[Inter]">Last Updated: April 5, 2026</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* TOC Sidebar */}
          <aside className="lg:w-1/4">
            <div className="sticky top-24 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 font-[Playfair_Display] border-b pb-2">Sections</h3>
              <nav className="space-y-2">
                {sections.map((s) => (
                  <a 
                    key={s.id} 
                    href={`#${s.id}`}
                    className="block text-sm text-gray-500 hover:text-primary transition-colors py-1.5 font-[Inter] border-l-2 border-transparent hover:border-primary pl-3 hover:translate-x-1 transition-all"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Policy Content */}
          <article className="lg:w-3/4 bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm article-body">
            <section id="acceptance" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-[Playfair_Display]">1. Acceptance of Terms</h2>
              <p>
                By accessing and using LabourPulse, you accept and agree to be bound by the terms and provision of this agreement. 
                In addition, when using these particular services, you shall be subject to any posted guidelines or rules 
                applicable to such services.
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 flex gap-3 text-sm italic text-gray-600 font-[Inter]">
                <CheckCircle size={18} className="text-primary flex-shrink-0" />
                Any participation in this service will constitute acceptance of this agreement.
              </div>
            </section>

            <section id="content" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-[Playfair_Display]">2. Intellectual Property</h2>
              <p>
                The site and its original content, features, and functionality are owned by LabourPulse and are protected 
                by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary 
                rights laws.
              </p>
              <p>
                You may not reproduce, distribute, or create derivative works from any part of LabourPulse without 
                explicit written permission from the editorial board.
              </p>
            </section>

            <section id="usage" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-[Playfair_Display]">3. User Conduct</h2>
              <p>You agree not to use the site for any purpose that is unlawful or prohibited by these Terms. You may not:</p>
              <ul>
                <li>Engage in any "scraping" or automated data collection.</li>
                <li>Attempt to gain unauthorized access to any portion of the site.</li>
                <li>Post or transmit any content that is defamatory, offensive, or infringing.</li>
                <li>Use the site in any manner that could disable, overburden, or impair the site's functionality.</li>
              </ul>
            </section>

            <section id="subscriptions" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-[Playfair_Display]">4. Billing & Subscriptions</h2>
              <p>
                LabourPulse offers premium subscription plans. By subscribing, you agree to pay the fees indicated 
                for that service. Payments will be charged on a pre-pay basis on the day you sign up and will cover 
                the use of that service for the period indicated.
              </p>
              <p>
                Subscriptions will automatically renew unless cancelled by the user through the account dashboard.
              </p>
            </section>

            <section id="liability" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-[Playfair_Display]">5. Limitation of Liability</h2>
              <div className="p-6 bg-red-50 rounded-2xl border border-red-100 mb-6">
                <p className="text-sm text-red-900 font-[Inter] leading-relaxed m-0">
                  <AlertTriangle size={16} className="inline mr-2 mb-1" />
                  LabourPulse and its components are offered for informational purposes only; THIS SITE SHALL NOT BE 
                  RESPONSIBLE OR LIABLE FOR THE ACCURACY, USEFULNESS OR AVAILABILITY OF ANY INFORMATION TRANSMITTED 
                  OR MADE AVAILABLE VIA THE SITE.
                </p>
              </div>
            </section>

            <section id="governing-law" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-[Playfair_Display]">6. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of Bangladesh 
                and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <div className="mt-16 p-8 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
              <ShieldCheck className="text-gray-300 mb-4" size={48} />
              <h4 className="font-bold text-gray-900 mb-2">Editor's Pledge</h4>
              <p className="text-sm text-gray-500 font-[Inter] leading-relaxed max-w-lg">
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
