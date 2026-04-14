"use client";
import { useState } from "react";
import { Twitter, Facebook, Linkedin, Link2, Mail, Check } from "lucide-react";

export default function ShareButtons({ title, url, variant = "horizontal" }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buttons = [
    {
      label: "Twitter / X",
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-black hover:text-white",
    },
    {
      label: "Facebook",
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-[#1877F2] hover:text-white",
    },
    {
      label: "LinkedIn",
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-[#0A66C2] hover:text-white",
    },
    {
      label: "Email",
      icon: <Mail size={16} />,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-gray-600 hover:text-white",
    },
  ];

  if (variant === "sticky") {
    return (
      <div className="hidden xl:flex flex-col gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-[Inter] text-center writing-mode-vertical">SHARE</span>
        {buttons.map((btn) => (
          <a
            key={btn.label}
            href={btn.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${btn.label}`}
            className={`w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-500 transition-all duration-200 ${btn.color}`}
          >
            {btn.icon}
          </a>
        ))}
        <button
          onClick={handleCopy}
          aria-label="Copy link"
          className={`w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-500 transition-all duration-200 ${copied ? "bg-green-500 text-white border-green-500" : "hover:bg-gray-100"}`}
        >
          {copied ? <Check size={14} /> : <Link2 size={14} />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 font-[Inter] mr-1">Share:</span>
      {buttons.map((btn) => (
        <a
          key={btn.label}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${btn.label}`}
          className={`w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 transition-all duration-200 ${btn.color}`}
        >
          {btn.icon}
        </a>
      ))}
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className={`h-8 px-3 flex items-center gap-1.5 border text-[11px] font-medium transition-all ${copied ? "bg-green-500 text-white border-green-500" : "border-gray-200 text-gray-500 hover:bg-gray-100"} font-[Inter]`}
      >
        {copied ? <><Check size={12} /> Copied!</> : <><Link2 size={12} /> Copy Link</>}
      </button>
    </div>
  );
}
