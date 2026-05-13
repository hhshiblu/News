"use client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { getPublicApiBase } from "@/lib/apiBaseUrl";
import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, MapPin } from "lucide-react";
const SocialIcons = {
  Facebook: () => (
    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  Twitter: () => (
    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Youtube: () => (
    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  Instagram: () => (
    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  )
};

const footerAbout = "LabourPulse is Bangladesh’s premier independent digital news platform focusing on labour rights, economic justice, and sustainable development. Award-winning journalism since 2010.";

const footerLinks = {
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Our Team", href: "/team" },
    ]
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ]
  }
};

const footerContact = {
  address: "Level 4, LabourPulse Tower, 12 Kazi Nazrul Islam Avenue, Kawran Bazar, Dhaka 1215, Bangladesh",
  phone: "+880 2 5555 1234",
  email: "editor@labourpulse.com"
};

function footerCategoryHref(category) {
  if (category.children?.length) {
    return `/${category.slug}/${category.children[0].slug}`;
  }
  return `/${category.slug}`;
}

export default function Footer({ navigationCategories = [] }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if(!email) return;
    setLoading(true);
    try {
        const res = await fetch(`${getPublicApiBase()}/newsletter/subscribe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });
        const data = await res.json().catch(() => ({}));
        if(res.ok) {
            toast.success("Successfully subscribed to the Daily Briefing!");
            setEmail("");
        } else {
            toast.error(data.message || "Failed to subscribe.");
        }
    } catch(err) {
        toast.error("Network error subscribing.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <footer className="bg-bg-charcoal text-white font-[Inter]">
      <div className="max-w-[1280px] mx-auto px-4 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand & About Column (lg: 4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="mb-6 flex items-center justify-center md:justify-start">
              <span className="bg-primary text-white font-bold text-2xl px-3 py-1 font-[Playfair_Display]">The Labour</span>
              <span className="font-bold text-2xl pl-2 font-[Playfair_Display]">Pulse</span>
            </Link>
            <p className="text-gray-400 text-[14px] leading-relaxed mb-8 md:pr-4">
              {footerAbout}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-white" aria-label="Facebook">
                <SocialIcons.Facebook />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-white" aria-label="Twitter">
                <SocialIcons.Twitter />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-white" aria-label="YouTube">
                <SocialIcons.Youtube />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-white" aria-label="Instagram">
                <SocialIcons.Instagram />
              </a>
            </div>
          </div>

          {/* Sections Column (lg: 3 cols) */}
          <div className="lg:col-span-3 text-center md:text-left">
            <h3 className="text-[14px] font-bold uppercase tracking-widest mb-6 opacity-60">Sections</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              {navigationCategories.length === 0 ? (
                <li className="col-span-full text-[13px] text-gray-500 leading-relaxed">
                  Section links appear here after categories are added in the dashboard.
                </li>
              ) : (
                navigationCategories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={footerCategoryHref(category)}
                      className="text-[14px] font-semibold text-gray-300 hover:text-primary transition-colors hover-translate"
                    >
                      {category.label}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Company & Legal Column (lg: 2 cols) */}
          <div className="lg:col-span-2 text-center md:text-left">
            <h3 className="text-[14px] font-bold uppercase tracking-widest mb-6 opacity-60">{footerLinks.company.title}</h3>
            <ul className="space-y-3 mb-8">
              {footerLinks.company.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[14px] text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h3 className="text-[14px] font-bold uppercase tracking-widest mb-6 opacity-60">{footerLinks.legal.title}</h3>
            <ul className="space-y-3">
              {footerLinks.legal.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[14px] text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Subscribe Column (lg: 3 cols) */}
          <div className="lg:col-span-3 text-center md:text-left">
            <h3 className="text-[14px] font-bold uppercase tracking-widest mb-6 text-gray-500">Stay Connected</h3>
            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl mb-8">
              <p className="text-[13px] font-bold mb-3 text-white">Daily Briefing</p>
              <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">The essential stories for industrial & economic leaders, delivered to your inbox.</p>
              <form className="space-y-3" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com" 
                  className="w-full bg-gray-950 border border-gray-800 text-white text-[12px] px-4 py-2.5 outline-none focus:border-primary transition-all rounded-xl"
                  required
                />
                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white py-2.5 font-black text-[11px] transition-all rounded-xl uppercase tracking-widest shadow-lg shadow-primary/20">
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3">
               <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">Connect:</span>
               <div className="flex gap-3">
                  <a href="#" className="text-gray-500 hover:text-white transition-colors"><SocialIcons.Facebook /></a>
                  <a href="#" className="text-gray-500 hover:text-white transition-colors"><SocialIcons.Twitter /></a>
                  <a href="#" className="text-gray-500 hover:text-white transition-colors"><SocialIcons.Youtube /></a>
               </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-900 bg-black/40">
        <div className="max-w-[1280px] mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
             <p className="text-[11px] text-gray-600 uppercase tracking-widest font-black">
                &copy; {new Date().getFullYear()} LabourPulse Media
             </p>
             <div className="flex gap-4">
                <Link href="/terms" className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors">Terms</Link>
                <Link href="/privacy" className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors">Privacy</Link>
             </div>
          </div>
          <p className="text-[11px] font-bold text-gray-700 flex items-center justify-center md:justify-end gap-1.5 uppercase tracking-tighter w-full md:w-auto mt-4 md:mt-0">
            PROUDLY DEVELOPED IN DHAKA
          </p>
        </div>
      </div>
    </footer>
  );
}
