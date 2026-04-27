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
    <div className="relative min-h-screen overflow-hidden bg-[#0c0e11] font-[Inter]">
      {/* Ambient layers */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(196, 30, 58, 0.45), transparent),
            radial-gradient(ellipse 60% 40% at 100% 100%, rgba(30, 91, 138, 0.18), transparent)
          `,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-14 sm:px-8">
        {/* Company masthead */}
        <header className="mb-10 text-center sm:mb-12">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
              aria-hidden
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/55">
              Secure workspace
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.42em] text-primary-light/90"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              LabourPulse
            </p>
            <h1 className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 pt-2">
              <span
                className="rounded-sm bg-primary px-3 py-1 text-3xl font-bold tracking-tight text-white shadow-lg shadow-primary/35 sm:text-4xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Labour
              </span>
              <span
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Pulse
              </span>
            </h1>
            <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
          </div>
        </header>

        {/* Form card */}
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-px shadow-[0_24px_80px_-12px_rgba(0,0,0,0.65)] backdrop-blur-xl">
          <div className="rounded-[1.65rem] bg-[#faf9f7] px-6 py-8 sm:px-8 sm:py-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="login-email"
                  className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    aria-hidden
                  />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organisation.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-gray-200/90 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-gray-900 shadow-inner shadow-gray-100/80 outline-none transition-all placeholder:text-gray-400 focus:border-primary/35 focus:ring-[3px] focus:ring-primary/12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="login-password"
                  className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    aria-hidden
                  />
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-gray-200/90 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-gray-900 shadow-inner shadow-gray-100/80 outline-none transition-all placeholder:text-gray-400 focus:border-primary/35 focus:ring-[3px] focus:ring-primary/12"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold !text-white shadow-[0_8px_30px_-6px_rgba(196,30,58,0.55)] transition-all hover:bg-primary-dark hover:shadow-[0_12px_36px_-6px_rgba(196,30,58,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9f7] disabled:pointer-events-none disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <>
                    Enter dashboard
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 border-t border-gray-200/80 pt-8 text-center text-[12px] text-gray-500">
              Need an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-primary transition-colors hover:text-primary-dark hover:underline underline-offset-4"
              >
                Register
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-10 text-center text-[10px] tracking-wide text-white/25">
          © LabourPulse · Editorial systems
        </p>
      </div>
    </div>
  );
}
