"use client";
import { Mail, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getPublicApiBase } from "@/lib/apiBaseUrl";

export default function NewsletterBox({ variant = "sidebar" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
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
            toast.success("Successfully subscribed!");
            setEmail("");
        } else {
            toast.error(data.message || "Failed to subscribe.");
        }
    } catch(err) {
        toast.error("Network error.");
    } finally {
        setLoading(false);
    }
  };

  if (variant === "inline") {
    return (
      <div className="bg-gray-100 p-8 border-l-4 border-primary rounded shadow-sm my-10 max-w-[800px] flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1">
          <h3 className="text-xl font-bold font-[Playfair_Display] text-gray-900 mb-2">
            Stay Updated with Our Daily Pulse
          </h3>
          <p className="text-[14px] text-gray-600 font-[Inter]">
            Join 50,000+ professionals receiving the latest labour and economic news in their inbox.
          </p>
        </div>
        <div className="w-full md:w-auto shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2 w-full">
            <input 
              type="email" 
              placeholder="Enter email" 
              className="bg-white border text-[14px] px-4 py-2 outline-none focus:ring-1 focus:ring-primary h-11 w-full md:w-60"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={loading} className="bg-primary hover:bg-[#8B0000] text-white px-6 font-bold h-11 transition-colors whitespace-nowrap disabled:opacity-50">
              {loading ? "..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 text-white text-center">
      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Mail size={24} className="text-primary" />
      </div>
      <h4 className="text-[16px] font-bold font-[Playfair_Display] mb-2 uppercase tracking-wide">
        Daily Briefing
      </h4>
      <p className="text-[13px] text-gray-400 font-[Inter] mb-5">
        Get the morning’s essential labour rights and economic news.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input 
          type="email" 
          placeholder="Email address" 
          className="w-full bg-gray-800 border border-gray-700 text-white text-[13px] px-3 py-2.5 rounded-sm outline-none focus:border-primary transition-colors"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-[#8B0000] text-white py-2.5 font-bold text-[13px] transition-colors rounded-sm uppercase tracking-widest disabled:opacity-50">
          {loading ? "..." : "Get Access"}
        </button>
      </form>
    </div>
  );
}
