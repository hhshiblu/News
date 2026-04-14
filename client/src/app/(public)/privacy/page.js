import { Shield, Lock, Eye, Save, Globe, Info } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — LabourPulse",
  description: "Learn how we protect your data and privacy at LabourPulse.",
};

export default function PrivacyPage() {
  const sections = [
    { id: "introduction", title: "1. Introduction" },
    { id: "data-collection", title: "2. Data We Collect" },
    { id: "use-of-data", title: "3. How We Use Data" },
    { id: "cookies", title: "4. Cookies Policy" },
    { id: "third-parties", title: "5. Third Party Sharing" },
    { id: "your-rights", title: "6. Your Rights" },
    { id: "updates", title: "7. Policy Updates" },
  ];

  return (
    <main className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-4 font-[Inter]">
            <Shield size={16} />
            Transparency Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-[Playfair_Display] text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-500 font-[Inter]">Last Updated: April 5, 2026</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* TOC Sidebar */}
          <aside className="lg:w-1/4">
            <div className="sticky top-24 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 font-[Playfair_Display] border-b pb-2">Contents</h3>
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
              <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-xs text-gray-600 font-[Inter] mb-2 font-medium flex items-center gap-1.5">
                  <Info size={14} className="text-primary" />
                  Have Questions?
                </p>
                <a href="/contact" className="text-xs text-primary font-bold hover:underline">Contact our DPO</a>
              </div>
            </div>
          </aside>

          {/* Policy Content */}
          <article className="lg:w-3/4 bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm article-body">
            <section id="introduction" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-[Playfair_Display]">1. Introduction</h2>
              <p>
                Welcome to LabourPulse. We value your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you as to how we look after your personal data when you visit our website 
                (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section id="data-collection" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-[Playfair_Display]">2. Data We Collect</h2>
              <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul>
                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
              </ul>
            </section>

            <section id="use-of-data" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-[Playfair_Display]">3. How We Use Data</h2>
              <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
              <ul>
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal or regulatory obligation.</li>
              </ul>
            </section>

            <section id="cookies" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-[Playfair_Display]">4. Cookies Policy</h2>
              <p>
                You can set your browser to refuse all or some browser cookies, or to alert you when websites set or 
                access cookies. If you disable or refuse cookies, please note that some parts of this website may 
                become inaccessible or not function properly.
              </p>
              <p>
                We use cookies to personalize content and ads, to provide social media features and to analyze our traffic.
              </p>
            </section>

            <section id="third-parties" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-[Playfair_Display]">5. Third Party Sharing</h2>
              <p>
                We do not sell your personal data. We may share your data with selected third parties including 
                service providers who provide IT and system administration services, and professional advisers.
              </p>
            </section>

            <section id="your-rights" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-[Playfair_Display]">6. Your Rights</h2>
              <p>
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, 
                including the right to request access, correction, erasure, restriction, transfer, to object to processing, 
                to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
              </p>
            </section>

            <div className="mt-16 p-8 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
              <Globe className="text-gray-300 mb-4" size={48} />
              <h4 className="font-bold text-gray-900 mb-2">Global Data Protection Compliance</h4>
              <p className="text-sm text-gray-500 font-[Inter] leading-relaxed max-w-lg">
                LabourPulse is committed to GDPR, CCPA, and other global data protection standards. 
                We believe privacy is a fundamental human right.
              </p>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
