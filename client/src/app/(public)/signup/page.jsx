"use client";

import { useState } from "react";
import { signupAction } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, User, ArrowRight, Loader2, PenTool } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await signupAction({ name, email, password });
        setLoading(false);
        
        if (res.success) {
            toast.success("Account created successfully! Welcome to the team.");
            router.push("/dashboard");
        } else {
            toast.error(res.message || "Failed to create account.");
        }
    };

    return (
        <div className="min-h-screen bg-[#001d1a] selection:bg-emerald-500/30 selection:text-emerald-500 flex items-center justify-center p-6 relative overflow-hidden">
            
            {/* Design Background Elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-900/40 blur-[100px] rounded-full translate-y-1/2 translate-x-1/4" />
            
            <div className="w-full max-w-lg animate-in fade-in zoom-in duration-700 relative z-10">
                
                {/* Brand Identity */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl mb-6 shadow-2xl shadow-emerald-500/10 group hover:scale-110 transition-transform cursor-pointer">
                        <PenTool className="w-10 h-10 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Join <span className="text-emerald-500">Editorial</span></h1>
                    <p className="text-emerald-100/40 text-[10px] font-black uppercase tracking-[0.4em] font-mono">Expert Content Creator Registration</p>
                </div>

                {/* Signup Card */}
                <div className="bg-white/3 backdrop-blur-2xl border border-white/10 p-10 rounded-[40px] shadow-2xl shadow-black/40">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest pl-2">Full Identity Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40 group-focus-within:text-emerald-400 transition-colors" />
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Journalist Name"
                                        required
                                        className="w-full bg-white/4 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all placeholder:text-emerald-500/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest pl-2">Professional Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40 group-focus-within:text-emerald-400 transition-colors" />
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="reporter@pulse.com"
                                        required
                                        className="w-full bg-white/4 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all placeholder:text-emerald-500/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest pl-2">Secure Passkey</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40 group-focus-within:text-emerald-400 transition-colors" />
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        required
                                        className="w-full bg-white/4 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all placeholder:text-emerald-500/10"
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full bg-linear-to-r from-emerald-600 to-emerald-500 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/40 hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>
                                    Initialize Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-emerald-100/40 text-xs font-bold">
                            Already have core access? {" "}
                            <Link href="/login" className="text-emerald-500 hover:text-emerald-400 underline underline-offset-4 decoration-emerald-500/40 font-black tracking-tight transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-emerald-100/10 text-[9px] font-black uppercase tracking-[0.3em]">
                    End-to-End Encryption Protocol Active
                </div>
            </div>
        </div>
    );
}
