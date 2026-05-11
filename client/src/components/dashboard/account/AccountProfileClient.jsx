"use client";

import { useState, useRef } from "react";
import { User, Save, Loader2, Edit3, Lock, ShieldCheck, Mail, Globe, AtSign, Link, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { patchMyProfileAction, verifyMyPasswordAction } from "@/actions/admin-data.action";
import { getApiV1Base } from "@/lib/apiBaseUrl";
import { useRouter } from "next/navigation";

function safeSocials(s) {
  if (!s || typeof s !== "object") return { twitter: "", linkedin: "", website: "" };
  return {
    twitter: s.twitter || s.Twitter || "",
    linkedin: s.linkedin || s.LinkedIn || "",
    website: s.website || s.web || "",
  };
}

export default function AccountProfileClient({ initialUser }) {
  const router = useRouter();
  
  // State for View/Edit modes
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Profile Form State
  const [name, setName] = useState(initialUser?.name || "");
  const [bio, setBio] = useState(initialUser?.bio || "");
  const [position, setPosition] = useState(initialUser?.position || "");
  const [socials, setSocials] = useState(() => safeSocials(initialUser?.socials));
  const [avatarPreview, setAvatarPreview] = useState(
    initialUser?.avatar ? (initialUser.avatar.startsWith("http") ? initialUser.avatar : (initialUser.avatar.startsWith("/") ? initialUser.avatar : "/" + initialUser.avatar)) : ""
  );
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Password Modal State
  const [pwStep, setPwStep] = useState(1);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const uploadAvatar = async (file) => {
    const fd = new FormData();
    fd.append("media", file);
    const res = await fetch(`${getApiV1Base()}/admin/upload`, {
      method: "POST",
      body: fd,
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.url) throw new Error(data?.message || "Upload failed");
    return data.url;
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let avatarUrl = initialUser?.avatar || undefined;
      const f = fileRef.current?.files?.[0];
      if (f) {
        avatarUrl = await uploadAvatar(f);
      }
      const payload = {
        name: name.trim(),
        bio: bio.trim() || null,
        position: position.trim() || null,
        socials: {
          twitter: socials.twitter.trim() || undefined,
          linkedin: socials.linkedin.trim() || undefined,
          website: socials.website.trim() || undefined,
        },
      };
      if (avatarUrl) payload.avatar = avatarUrl;

      const res = await patchMyProfileAction(payload);
      if (res.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        router.refresh();
      } else toast.error(res.message || "Failed to update profile");
    } catch (err) {
      toast.error(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOldPassword = async (e) => {
      e.preventDefault();
      if(!oldPassword) return toast.error("Please enter your current password.");
      setPwLoading(true);
      try {
          const res = await verifyMyPasswordAction(oldPassword);
          if(res.success && res.match) {
              setPwStep(2);
          } else {
              toast.error(res.message || "Incorrect current password.");
          }
      } catch(err) {
          toast.error("Failed to verify password.");
      } finally {
          setPwLoading(false);
      }
  };

  const handleUpdatePassword = async (e) => {
      e.preventDefault();
      if(newPassword !== confirmPassword) {
          return toast.error("New passwords do not match.");
      }
      if(newPassword.length < 6) {
          return toast.error("Password must be at least 6 characters.");
      }
      setPwLoading(true);
      try {
          const payload = { oldPassword, password: newPassword };
          const res = await patchMyProfileAction(payload);
          if(res.success) {
              toast.success("Password updated securely!");
              setIsPasswordModalOpen(false);
              setPwStep(1);
              setOldPassword("");
              setNewPassword("");
              setConfirmPassword("");
          } else {
              toast.error(res.message || "Failed to update password.");
          }
      } catch(err) {
          toast.error("Error updating password.");
      } finally {
          setPwLoading(false);
      }
  };

  const closePasswordModal = () => {
      setIsPasswordModalOpen(false);
      setPwStep(1);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
  };

  return (
    <div className="mx-auto max-w-2xl pb-16 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-lg font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
            <User className="h-5 w-5 text-primary" /> Profile Settings
          </h1>
          <p className="text-[12px] text-gray-500 font-medium mt-1">Manage your public persona and account security.</p>
        </div>
        {!isEditing && (
            <div className="flex items-center gap-3">
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-[#8B0000] text-white font-bold text-[11px] rounded-lg hover:bg-[#6b0000] transition-colors shadow-sm uppercase tracking-wider flex items-center gap-1.5">
                    <Edit3 size={14} /> Update Bio
                </button>
                <button onClick={() => setIsPasswordModalOpen(true)} className="px-4 py-2 bg-rose-50 text-[#8B0000] font-bold text-[11px] rounded-lg hover:bg-rose-100 transition-colors shadow-sm uppercase tracking-wider flex items-center gap-1.5 border border-rose-100">
                    <Lock size={14} /> Security
                </button>
            </div>
        )}
      </div>

      {/* View Mode */}
      {!isEditing && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-gray-900 to-gray-800 relative">
                <div className="absolute -bottom-10 left-6">
                    <div className="h-20 w-20 rounded-2xl border-4 border-white bg-gray-100 overflow-hidden shadow-sm">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                <User size={32} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="pt-14 px-6 pb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">{name || "Anonymous User"}</h2>
                        <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wide mt-1">{position || "Staff Member"}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest rounded-md flex items-center gap-1">
                        <CheckCircle size={12} /> {initialUser?.status || "Active"}
                    </span>
                </div>

                <div className="mt-6">
                    <h3 className="text-[11px] font-bold uppercase text-gray-400 mb-2 tracking-wider">Biography</h3>
                    {bio ? (
                        <p className="text-[13px] text-gray-700 leading-relaxed font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">
                            {bio}
                        </p>
                    ) : (
                        <p className="text-[12px] text-gray-400 italic">No biography provided yet.</p>
                    )}
                </div>

                <div className="mt-6">
                    <h3 className="text-[11px] font-bold uppercase text-gray-400 mb-3 tracking-wider">Contact & Socials</h3>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-[12px] font-semibold text-gray-600">{initialUser?.email || "No email"}</span>
                        </div>
                        {socials.twitter && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/50 rounded-lg border border-blue-100">
                                <AtSign className="w-3.5 h-3.5 text-blue-400" />
                                <span className="text-[12px] font-semibold text-blue-600">{socials.twitter}</span>
                            </div>
                        )}
                        {socials.linkedin && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 rounded-lg border border-indigo-100">
                                <Link className="w-3.5 h-3.5 text-indigo-400" />
                                <span className="text-[12px] font-semibold text-indigo-600">{socials.linkedin}</span>
                            </div>
                        )}
                        {socials.website && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                <Globe className="w-3.5 h-3.5 text-gray-500" />
                                <span className="text-[12px] font-semibold text-gray-700">{socials.website}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Edit Form Mode */}
      {isEditing && (
          <form onSubmit={saveProfile} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 className="text-[14px] font-black uppercase text-gray-800 tracking-tight">Edit Profile</h2>
                <button type="button" onClick={() => setIsEditing(false)} className="text-[11px] font-bold text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                    Cancel
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-gray-400 transition-colors group"
              >
                {avatarPreview ? (
                  <>
                    <img src={avatarPreview} alt="" className="h-full w-full object-cover group-hover:opacity-50 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 className="w-6 h-6 text-gray-900" />
                    </div>
                  </>
                ) : (
                  <span className="flex flex-col items-center justify-center h-full w-full text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 text-center">
                    <User className="w-6 h-6 mb-1 opacity-50" />
                    Photo
                  </span>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setAvatarPreview(URL.createObjectURL(file));
                }} />
              </button>
              <div className="flex-1 space-y-1 min-w-0 pt-2">
                <p className="text-[12px] font-black uppercase tracking-wider text-gray-700">Display Picture</p>
                <p className="text-[11px] font-medium text-gray-400">Square image recommended. Click the box to upload.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
                <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Full Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-[13px] font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
                    required
                />
                </div>

                <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Role title / beat</label>
                <input
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. Senior correspondent"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-[13px] font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
                />
                </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Bio (Max 190 chars)</label>
              <textarea
                value={bio}
                maxLength={190}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[13px] font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all resize-none"
              />
            </div>

            <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3 block">Social Links</label>
                <div className="grid gap-4 sm:grid-cols-3">
                {["twitter", "linkedin", "website"].map((k) => (
                    <div key={k} className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            {k === 'twitter' && <AtSign className="w-3.5 h-3.5 text-gray-400" />}
                            {k === 'linkedin' && <Link className="w-3.5 h-3.5 text-gray-400" />}
                            {k === 'website' && <Globe className="w-3.5 h-3.5 text-gray-400" />}
                        </div>
                        <input
                            value={socials[k] || ""}
                            onChange={(e) => setSocials((s) => ({ ...s, [k]: e.target.value }))}
                            placeholder={`${k}.com/...`}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2.5 text-[12px] font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
                        />
                    </div>
                ))}
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B0000] px-6 py-2.5 text-[12px] font-bold uppercase tracking-widest !text-white hover:bg-[#6b0000] disabled:opacity-50 transition-colors shadow-sm"
                >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Profile
                </button>
            </div>
          </form>
      )}

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                      <h3 className="text-[13px] font-black uppercase tracking-tight text-gray-900 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-rose-600" /> Security Settings
                      </h3>
                      <button onClick={closePasswordModal} className="text-gray-400 hover:text-gray-900 transition-colors">
                          <X className="w-5 h-5" />
                      </button>
                  </div>

                  <div className="p-6">
                      {pwStep === 1 ? (
                          <form onSubmit={handleVerifyOldPassword} className="space-y-5">
                              <div className="text-center space-y-2 mb-6">
                                  <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600 mb-3">
                                      <Lock className="w-6 h-6" />
                                  </div>
                                  <h4 className="text-[15px] font-bold text-gray-900 tracking-tight">Verify Identity</h4>
                                  <p className="text-[12px] font-medium text-gray-500">Please enter your current password to continue.</p>
                              </div>

                              <div>
                                  <input 
                                      type="password"
                                      value={oldPassword}
                                      onChange={e => setOldPassword(e.target.value)}
                                      placeholder="Current Password"
                                      autoFocus
                                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[13px] font-medium text-gray-900 text-center focus:bg-white focus:ring-2 focus:ring-rose-600/20 focus:border-rose-600 outline-none transition-all"
                                  />
                              </div>

                              <button
                                  type="submit"
                                  disabled={pwLoading || !oldPassword}
                                  className="w-full py-3 bg-[#8B0000] text-white rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-[#6b0000] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                              >
                                  {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Password"}
                              </button>
                          </form>
                      ) : (
                          <form onSubmit={handleUpdatePassword} className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                              <div className="text-center space-y-2 mb-6">
                                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-3">
                                      <CheckCircle className="w-6 h-6" />
                                  </div>
                                  <h4 className="text-[15px] font-bold text-gray-900 tracking-tight">Identity Verified</h4>
                                  <p className="text-[12px] font-medium text-gray-500">You may now set a new secure password.</p>
                              </div>

                              <div className="space-y-4">
                                  <div>
                                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">New Password</label>
                                      <input 
                                          type="password"
                                          value={newPassword}
                                          onChange={e => setNewPassword(e.target.value)}
                                          placeholder="At least 6 characters"
                                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-[13px] font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none transition-all"
                                      />
                                  </div>
                                  <div>
                                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Confirm Password</label>
                                      <input 
                                          type="password"
                                          value={confirmPassword}
                                          onChange={e => setConfirmPassword(e.target.value)}
                                          placeholder="Match new password"
                                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-[13px] font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none transition-all"
                                      />
                                  </div>
                              </div>

                              <button
                                  type="submit"
                                  disabled={pwLoading || !newPassword || !confirmPassword}
                                  className="w-full py-3 bg-[#8B0000] text-white rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-[#6b0000] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                              >
                                  {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Securely"}
                              </button>
                          </form>
                      )}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}
