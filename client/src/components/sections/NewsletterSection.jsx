"use client";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if(!email) return;
    setLoading(true);
    try {
        const res = await fetch(`${API_BASE}/public/newsletter/subscribe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });
        const data = await res.json().catch(() => ({}));
        if(res.ok) {
            toast.success("Successfully subscribed to the Daily Digest!");
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
    <section className="bg-primary py-14 px-4 text-center">
      <div className="max-w-[580px] mx-auto">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Mail size={18} className="text-white/70" />
          <p className="text-white/70 text-[11px] font-bold tracking-[0.25em] uppercase font-[Inter]">
            LabourPulse Daily Digest
          </p>
        </div>
        <h2 className="!text-white text-3xl md:text-4xl font-bold font-[Playfair_Display] mb-3 leading-tight">
          Stay Informed.
        </h2>
        <p className="text-white/75 text-[14px] mb-8 font-[Inter] leading-relaxed max-w-[420px] mx-auto">
          Get Bangladesh's top labour, economy, and politics stories delivered to your inbox every morning — free.
        </p>

        {/* Input row — white background */}
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-0 max-w-[460px] mx-auto shadow-2xl">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={loading}
            className="flex-1 px-5 py-3.5 text-[14px] text-gray-800 placeholder:text-gray-400 bg-white outline-none font-[Inter] border-0 rounded-none disabled:opacity-50"
            required
          />
          <button type="submit" disabled={loading} className="bg-gray-900 hover:bg-black !text-white px-7 py-3.5 text-[11px] font-black tracking-[0.2em] uppercase transition-colors font-[Inter] whitespace-nowrap border-0 disabled:opacity-50">
            {loading ? "Please Wait..." : "Subscribe →"}
          </button>
        </form>

        <p className="text-white/40 text-[11px] mt-4 font-[Inter]">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
