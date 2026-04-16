"use client";

import { useState } from "react";
import { loginAction } from "@/actions/auth";
import { toast } from "sonner";
import { ShieldCheck, Mail, Lock, Activity, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await loginAction(email, password);
        setLoading(false);
        
        if (res.success) {
            toast.success("Welcome back to Editorial Hub!");
            window.location.assign("/admin");
        } else {
            toast.error(res.message || "Invalid credentials provided.");
        }
    };

    return (
        <div className="min-h-screen bg-[#001d1a] selection:bg-emerald-500/30 selection:text-emerald-500 flex items-center justify-center p-6 relative overflow-hidden">
            
            {/* Design Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-900/40 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4" />
            
            <div className="w-full max-w-lg animate-in fade-in zoom-in duration-1000 relative z-10">
                
                {/* Brand Identity */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl mb-6 shadow-2xl shadow-emerald-500/10 group hover:scale-110 transition-transform cursor-pointer">
                        <Activity className="w-10 h-10 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">LabourPulse <span className="text-emerald-500">CMS</span></h1>
                    <p className="text-emerald-100/40 text-xs font-bold uppercase tracking-[0.3em] font-mono italic">Expert Editorial Control Center</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-[40px] shadow-2xl shadow-black/40">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest pl-2">Security ID</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40 group-focus-within:text-emerald-400 transition-colors" />
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="curator@labourpulse.com"
                                        required
                                        className="w-full bg-white/[0.04] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all placeholder:text-emerald-500/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest pl-2">Private Key</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40 group-focus-within:text-emerald-400 transition-colors" />
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        required
                                        className="w-full bg-white/[0.04] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all placeholder:text-emerald-500/10"
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/40 hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>
                                    Establish Session <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-emerald-100/20 text-[10px] font-medium tracking-widest uppercase">Encryption Status: AES-256 Enabled</p>
                </div>
            </div>
        </div>
    );
}
