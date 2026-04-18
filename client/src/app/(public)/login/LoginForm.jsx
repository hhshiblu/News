"use client";

import { useState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await loginAction(email, password);
    setLoading(false);

    if (res.success) {
      toast.success("Signed in successfully.");
      window.location.assign("/dashboard");
    } else {
      toast.error(res.message || "Invalid credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] font-[Inter] flex flex-col">
      <header className="border-b border-gray-200/80 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded">
            <span
              className="bg-primary text-white font-bold text-base sm:text-lg px-2 py-0.5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Labour
            </span>
            <span className="text-gray-900 font-bold text-base sm:text-lg pl-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Pulse
            </span>
          </Link>
          <Link
            href="/"
            className="text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-primary transition-colors"
          >
            ← Home
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
          <div className="mb-8 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary mb-2">Editorial access</p>
            <h1
              className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Sign in to the hub
            </h1>
            <p className="mt-2 text-sm text-gray-500 font-medium leading-relaxed">
              Authors and admins use this page to reach the dashboard. The public site has no login entry.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="login-email" className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/80 py-3.5 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="login-password" className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/80 py-3.5 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold !text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-55"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <>
                    Continue to dashboard
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-[11px] text-gray-400">
            Need an account?{" "}
            <Link href="/signup" className="font-bold text-primary hover:text-primary-dark hover:underline underline-offset-2">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
