"use client";

import { useState, useRef } from "react";
import { Shield, Loader2, Save, X, UploadCloud, User, Mail, Lock, Briefcase, FileText } from "lucide-react";
import { toast } from "sonner";
import { createAdminUserAction } from "@/actions/admin-data.action";
import { getApiV1Base } from "@/lib/apiBaseUrl";
import { useRouter } from "next/navigation";

export default function AdminSettingsClient() {
  const router = useRouter();
  const fileRef = useRef(null);
  
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [position, setPosition] = useState("");
  const [preview, setPreview] = useState("");

  const upload = async (file) => {
    const fd = new FormData();
    fd.append("media", file);
    const res = await fetch(`${getApiV1Base()}/admin/upload`, {
      method: "POST",
      body: fd,
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) throw new Error(data.message || "Upload failed");
    return data.url;
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let avatar;
      const f = fileRef.current?.files?.[0];
      if (f) avatar = await upload(f);

      const body = {
        name: name.trim(),
        email: email.trim(),
        password,
        role: "ADMIN",
        bio: bio.trim() || undefined,
        position: position.trim() || undefined,
        ...(avatar ? { avatar } : {}),
      };

      const res = await createAdminUserAction(body);
      if (res.success) {
        toast.success("Administrator account provisioned successfully.");
        setShowForm(false);
        router.refresh();
        setName("");
        setEmail("");
        setPassword("");
        setBio("");
        setPosition("");
        setPreview("");
        if (fileRef.current) fileRef.current.value = "";
      } else {
        toast.error(res.message || "Failed to provision administrator.");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      
      {!showForm ? (
        <div className="w-full max-w-2xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="mx-auto w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl mb-6 relative">
                <div className="absolute inset-0 rounded-full border border-rose-100 animate-[spin_4s_linear_infinite]" />
                <Shield className="w-10 h-10 text-[#8B0000]" />
            </div>
            
            <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">System Settings</h1>
                <p className="text-sm font-semibold text-gray-500 max-w-md mx-auto leading-relaxed">
                    Manage top-level administrative access. Ensure you only grant these privileges to trusted personnel.
                </p>
            </div>

            <button
                onClick={() => setShowForm(true)}
                className="group relative inline-flex items-center justify-center gap-3 bg-[#8B0000] text-white px-8 py-4 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-rose-900 transition-all shadow-[0_0_40px_-10px_rgba(139,0,0,0.4)] hover:shadow-[0_0_60px_-15px_rgba(139,0,0,0.6)] cursor-pointer overflow-hidden mt-4"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-2">
                    <Shield size={16} /> Provision Administrator
                </span>
            </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="bg-[#8B0000] px-8 py-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Shield size={120} />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Create Administrator</h2>
                        <p className="text-xs font-bold text-white/70 uppercase tracking-widest mt-1.5">Full System Access Grant</p>
                    </div>
                    <button 
                        onClick={() => setShowForm(false)} 
                        className="p-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors cursor-pointer border border-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            <form onSubmit={submit} className="p-8 sm:p-10 space-y-8">
                {/* Photo Upload Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center relative">
                            {preview ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-8 h-8 text-gray-300" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => fileRef.current?.click()}>
                                <UploadCloud className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setPreview(URL.createObjectURL(file));
                            }}
                        />
                    </div>
                    <div className="text-center sm:text-left">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Profile Photo</h3>
                        <p className="text-xs text-gray-500 font-medium mt-1">Upload a professional headshot for the admin portal.</p>
                        <button type="button" onClick={() => fileRef.current?.click()} className="mt-3 text-xs font-bold text-[#8B0000] hover:text-rose-700 uppercase tracking-wide cursor-pointer bg-rose-50 px-3 py-1.5 rounded-lg transition-colors">
                            Browse Files
                        </button>
                    </div>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                            <User size={14} className="text-gray-300" /> Full Legal Name *
                        </label>
                        <input 
                            required 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]/30 transition-all placeholder:text-gray-300 placeholder:font-medium"
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                            <Briefcase size={14} className="text-gray-300" /> Official Position
                        </label>
                        <input 
                            value={position} 
                            onChange={(e) => setPosition(e.target.value)} 
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]/30 transition-all placeholder:text-gray-300 placeholder:font-medium"
                            placeholder="e.g. Chief Editor"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                            <Mail size={14} className="text-gray-300" /> Secure Email *
                        </label>
                        <input 
                            required 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]/30 transition-all placeholder:text-gray-300 placeholder:font-medium"
                            placeholder="admin@newsportal.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                            <Lock size={14} className="text-gray-300" /> Password *
                        </label>
                        <input 
                            required 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]/30 transition-all placeholder:text-gray-300 placeholder:font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                            <FileText size={14} className="text-gray-300" /> Executive Bio
                        </label>
                        <textarea 
                            value={bio} 
                            onChange={(e) => setBio(e.target.value)} 
                            rows={3} 
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]/30 transition-all resize-none placeholder:text-gray-300 placeholder:font-medium"
                            placeholder="Brief biography detailing credentials..."
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button 
                        type="button" 
                        onClick={() => setShowForm(false)} 
                        className="px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 bg-[#8B0000] text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-900 transition-all shadow-lg shadow-rose-900/20 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                        {loading ? "Provisioning..." : "Finalize Account"}
                    </button>
                </div>
            </form>
        </div>
      )}

    </div>
  );
}
