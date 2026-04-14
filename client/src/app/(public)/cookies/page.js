import Link from "next/link";
import { Shield, Lock, Eye, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Cookie Policy — LabourPulse",
  description: "Transparency on how we use cookies and tracking technologies to improve your experience on LabourPulse.",
};

export default function CookiePolicyPage() {
  const cookieTypes = [
    {
      type: "Essential Cookies",
      purpose: "Necessary for the website to function (security, session management).",
      expiration: "Session based",
      icon: Lock,
    },
    {
      type: "Analytics Cookies",
      purpose: "Used to understand how visitors interact with our content.",
      expiration: "30 days to 2 years",
      icon: Eye,
    },
    {
      type: "Preference Cookies",
      purpose: "Remembers your settings like dark mode or language.",
      expiration: "1 year",
      icon: Shield,
    },
    {
      type: "Marketing Cookies",
      purpose: "Used to deliver relevant advertisements and measure campaign success.",
      expiration: "Up to 1 year",
      icon: AlertCircle,
    },
  ];

  return (
    <main className="bg-gray-50 min-h-screen py-20 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        {/* ── HEADER ── */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6 font-[Inter]">
            Legal Transparency
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-[Playfair_Display] mb-6">
            Cookie Policy
          </h1>
          <p className="text-gray-500 font-[Inter] mb-2 font-medium">Last updated: April 05, 2026</p>
          <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
        </div>

        {/* ── CONTENT BODY ── */}
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
          <div className="prose prose-gray max-w-none font-[Inter]">
            <section className="mb-12">
               <h2 className="text-2xl font-bold text-gray-900 font-[Playfair_Display] mb-4">How we use tracking technology</h2>
               <p className="text-gray-600 leading-relaxed mb-6">
                 LabourPulse uses cookies, web beacons, and other tracking technologies to enhance your browsing experience, 
                 provide personalized content, and analyze our website traffic. This policy explains what these 
                 technologies are and why we use them.
               </p>
            </section>

            <section className="mb-12">
               <h2 className="text-2xl font-bold text-gray-900 font-[Playfair_Display] mb-6">Types of Cookies</h2>
               <div className="grid gap-6">
                  {cookieTypes.map((cookie, i) => (
                    <div key={i} className="flex gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-primary/30 transition-all transition-colors transition-all duration-300">
                      <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-primary shadow-sm flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                        <cookie.icon size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">{cookie.type}</h4>
                        <p className="text-sm text-gray-600 mb-2 leading-relaxed">{cookie.purpose}</p>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Duration: {cookie.expiration}</span>
                      </div>
                    </div>
                  ))}
               </div>
            </section>

            <section className="mb-12">
               <h2 className="text-2xl font-bold text-gray-900 font-[Playfair_Display] mb-4">Your Control</h2>
               <p className="text-gray-600 leading-relaxed mb-6">
                 Most web browsers allow you to control cookies through their settings preferences. However, if you 
                 limit the ability of websites to set cookies, you may worsen your overall user experience, 
                 since it will no longer be personalized to you. It may also stop you from saving customized 
                 settings like login information.
               </p>
               <div className="flex flex-wrap gap-4 pt-4">
                  <button className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
                    Cookie Dashboard
                  </button>
                  <button className="px-8 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm tracking-wide transition-all hover:bg-gray-50">
                    Third Party Opt-Out
                  </button>
               </div>
            </section>

            <hr className="my-12 border-gray-100" />

            <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
               <div className="flex items-start gap-4">
                  <AlertCircle className="text-primary flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Updated Policy Statement</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      This policy is strictly enforced to comply with global data protection standards (GDPR, CCPA). 
                      If you have specific concerns about our data handling, please contact our 
                      <Link href="/contact" className="text-primary font-bold hover:underline ml-1">Data Protection Officer</Link>.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
