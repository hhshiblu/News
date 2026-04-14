import Link from "next/link";
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, Award, Zap, Globe } from "lucide-react";

export const metadata = {
  title: "Careers — Join Our Team at LabourPulse",
  description: "Explore opportunities to join Bangladesh's leading independent news platform. We're looking for journalists, developers, and analysts.",
};

export default function CareersPage() {
  const jobs = [
    {
      title: "Senior Investigative Journalist",
      dept: "Editorial",
      location: "Dhaka (On-site)",
      type: "Full-time",
      desc: "Lead deep-dive investigations into industrial safety and labour policy.",
    },
    {
      title: "Full-Stack Engineer (Next.js)",
      dept: "Product & Tech",
      location: "Remote / Hybrid",
      type: "Full-time",
      desc: "Scale our news delivery platform and implement premium features.",
    },
    {
      title: "Data Analyst",
      dept: "Economic Desk",
      location: "Dhaka / London",
      type: "Remote Available",
      desc: "Analyze global trade data and supply chain trends for our daily briefings.",
    },
    {
      title: "Social Media Strategist",
      dept: "Growth",
      location: "Dhaka",
      type: "Contract",
      desc: "Shape our digital presence and engage with our 2M+ monthly readers.",
    },
  ];

  return (
    <main className="bg-white">
      {/* ── HERO SECTION ── */}
      <section className="relative pt-24 pb-32 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />
        <div className="max-w-[1280px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <Zap size={14} /> Join the Global Pulse
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white font-[Playfair_Display] leading-tight mb-8">
            The Future of <span className="text-primary italic">Truth</span> <br /> 
            Needs Your Voice
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-[Inter] leading-relaxed mb-12">
            At LabourPulse, we don't just report the news—we explain the forces shaping the global economy. 
            Join a mission-driven team of 150+ journalists and innovators.
          </p>
          <a href="#openings" className="px-12 py-5 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl transition-all shadow-xl shadow-primary/25 uppercase tracking-widest text-xs">
            View Open Positions
          </a>
        </div>
      </section>

      {/* ── WHY WORK HERE ── */}
      <section className="py-24 border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Globe, title: "Global Impact", desc: "Your work reaches millions of decision-makers and workers across every continent." },
              { icon: Award, title: "Award-Winning Culture", desc: "Recognized for excellence in investigative journalism and workplace diversity." },
              { icon: CheckCircle2, title: "Radical Transparency", desc: "We operate with total editorial independence and support investigative freedom." },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                   <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-[Playfair_Display]">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed font-[Inter] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPEN POSITIONS ── */}
      <section id="openings" className="py-24 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="mb-8 md:mb-0">
               <h2 className="text-4xl font-black text-gray-900 font-[Playfair_Display] mb-4">Open Roles</h2>
               <p className="text-gray-500 font-[Inter]">Help us build the most trusted labour news platform in the world.</p>
            </div>
            <div className="flex gap-4">
               <select className="bg-white border border-gray-200 px-6 py-3 rounded-xl font-bold text-sm font-[Inter] outline-none focus:border-primary transition-all appearance-none">
                 <option>All Departments</option>
                 <option>Editorial</option>
                 <option>Technology</option>
                 <option>Design</option>
               </select>
            </div>
          </div>

          <div className="grid gap-6">
            {jobs.map((job, i) => (
              <div key={i} className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-primary hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {job.dept}
                    </span>
                    <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                      <Clock size={12} /> {job.type}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors font-[Playfair_Display]">
                    {job.title}
                  </h3>
                  <p className="text-gray-500 text-sm max-w-xl font-[Inter]">{job.desc}</p>
                </div>
                
                <div className="flex flex-col md:items-end gap-6">
                   <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                      <MapPin size={16} className="text-primary" /> {job.location}
                   </div>
                   <button className="flex items-center gap-3 text-primary font-black uppercase tracking-widest text-xs group/btn">
                     Apply Now <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                   </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
             <p className="text-gray-400 font-bold font-[Inter] pb-6">Don't see a role that fits? Use your initiative.</p>
             <Link href="/contact" className="text-gray-900 border-b-2 border-primary pb-1 font-black uppercase tracking-widest text-xs hover:text-primary transition-colors">
               Send Spontaneous Application
             </Link>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-24 bg-white relative overflow-hidden">
         <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full" />
         <div className="max-w-[1280px] mx-auto px-4 relative z-10 text-center">
            <h2 className="text-3xl font-black text-gray-900 font-[Playfair_Display] mb-16">The Pulse Experience</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
               {[
                 "Remote Freedom", "Continuous Learning", "Equity & Ownership", "Comprehensive Health",
                 "Global Mobility", "Radical Autonomy", "Parental Support", "Public Transit Stipends"
               ].map((benefit, i) => (
                 <div key={i} className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mb-4" />
                    <span className="font-bold text-gray-700 tracking-tight">{benefit}</span>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </main>
  );
}
