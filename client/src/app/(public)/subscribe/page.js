import Link from "next/link";
import { Check, Zap, Crown, Building2, HelpCircle, ChevronDown, CheckCircle2, Star } from "lucide-react";

export const metadata = {
  title: "Subscribe — LabourPulse Premium",
  description: "Unbiased journalism at your fingertips. Choose a plan that works for you.",
};

export default function SubscribePage() {
  const plans = [
    {
      name: "Digital Standard",
      price: "$9.99",
      period: "monthly",
      desc: "Full access to our digital archive and daily briefings on labour trends.",
      features: [
        "Unlimited article access",
        "Daily Brief newsletter",
        "Exclusive data insights",
        "No intrusive ads",
        "Mobile app access",
      ],
      cta: "Start Free Trial",
      icon: Zap,
      recommended: false,
    },
    {
      name: "Digital Premium",
      price: "$19.99",
      period: "monthly",
      desc: "Deep-dive investigative reports and early access to documentaries.",
      features: [
        "Everything in Digital Standard",
        "Investigative series access",
        "Monthly Q&A with Editors",
        "Early access to events",
        "Ad-free across all devices",
        "2 Guest passes per month",
      ],
      cta: "Go Premium",
      icon: Star,
      recommended: true,
    },
    {
      name: "Institutional",
      price: "$199",
      period: "yearly / per seat",
      desc: "For corporate, government, or academic license and data API access.",
      features: [
        "Everything in Premium",
        "Priority API access",
        "Bespoke industrial reports",
        "Team seat management",
        "Official research archive",
        "Dedicated account manager",
      ],
      cta: "Contact Enterprise",
      icon: Building2,
      recommended: false,
    },
  ];

  const faqs = [
    { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel your subscription at any time through our self-service dashboard or by contacting support." },
    { q: "Do you offer student discounts?", a: "We offer up to 50% discount for verified students and academic researchers. Please contact our student desk." },
    { q: "Is there a group discount for unions?", a: "We have specialized pricing tiers for labour unions and non-profit organizations. Reach out for a custom quote." },
    { q: "What's included in the basic trial?", a: "Our 7-day trial gives you full access to the Digital Standard plan so you can experience the quality of our journalism." },
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* ── HERO ── */}
      <section className="relative pt-24 pb-48 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-24" />
        <div className="max-w-[1280px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-10 max-w-fit mx-auto">
            <Crown size={14} /> LabourPulse Premium
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white font-[Playfair_Display] leading-tight mb-8">
             Unbiased Truth, <br />
             <span className="text-primary italic">Delivered Daily.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-[Inter] leading-relaxed mb-12">
            Support independent journalism and gain access to high-impact investigative reports, 
            exclusive industrial data, and the stories that matter most.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-black uppercase tracking-widest text-white/60">
             <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> No Hidden Fees</span>
             <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Cancel Anytime</span>
             <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Global Access</span>
          </div>
        </div>
      </section>

      {/* ── PRICING TABLES ── */}
      <section className="py-24 -mt-32 relative z-20">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div 
                key={i} 
                className={`group relative p-10 bg-white rounded-3xl border-2 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 ${
                  plan.recommended ? 'border-primary shadow-2xl scale-105' : 'border-gray-50'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-lg">
                    Editor's Choice
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-8">
                   <div className={`p-4 rounded-2xl ${plan.recommended ? 'bg-primary text-white' : 'bg-gray-50 text-gray-900 group-hover:bg-primary group-hover:text-white'} transition-all`}>
                      <plan.icon size={24} />
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{plan.period}</p>
                      <h3 className="text-3xl font-black text-gray-900 font-[Inter]">{plan.price}</h3>
                   </div>
                </div>

                <h4 className="text-2xl font-bold text-gray-900 font-[Playfair_Display] mb-4">{plan.name}</h4>
                <p className="text-gray-500 text-sm mb-10 leading-relaxed font-[Inter]">{plan.desc}</p>
                
                <div className="space-y-4 mb-12">
                   {plan.features.map((feature, j) => (
                     <div key={j} className="flex items-start gap-3">
                        <Check size={18} className="text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-gray-700 font-[Inter]">{feature}</span>
                     </div>
                   ))}
                </div>

                <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 ${
                  plan.recommended ? 'bg-primary text-white shadow-primary/25 hover:bg-primary-dark' : 'bg-gray-900 text-white hover:bg-black'
                }`}>
                   {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-black text-gray-900 font-[Playfair_Display] mb-4">Common Questions</h2>
             <p className="text-gray-500 font-[Inter]">Everything you need to know about our subscription models.</p>
          </div>
          <div className="space-y-6">
            {faqs.map((f, i) => (
              <div key={i} className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-primary/30 transition-all transition-colors transition-all duration-300">
                <div className="flex items-center justify-between cursor-pointer">
                   <h4 className="text-lg font-bold text-gray-900 font-[Playfair_Display]">{f.q}</h4>
                   <HelpCircle size={20} className="text-gray-200 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-gray-500 mt-4 leading-relaxed font-[Inter] text-sm opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all">
                   {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 text-center">
            <h2 className="text-4xl font-black text-gray-900 font-[Playfair_Display] mb-8">Invest in Investigative Truth.</h2>
            <div className="flex items-center justify-center gap-8 mb-12 grayscale opacity-40">
               {[ "Global Industrial Alliance", "Journalism Watchdog", "Truth In Media", "Press Academy" ].map(brand => (
                 <span key={brand} className="text-[14px] font-black uppercase tracking-widest">{brand}</span>
               ))}
            </div>
            <Link href="/contact" className="text-primary font-black border-b-4 border-primary pb-1 group text-lg inline-flex items-center gap-2">
              Gift a subscription <ChevronDown className="-rotate-90 group-hover:translate-x-2 transition-transform" />
            </Link>
        </div>
      </section>
    </main>
  );
}
