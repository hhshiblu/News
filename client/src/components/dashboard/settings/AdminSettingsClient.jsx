"use client";

import { useState, useRef } from "react";
import {
  Shield,
  Loader2,
  Save,
  X,
  UploadCloud,
  User,
  Mail,
  Lock,
  Briefcase,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  createAdminUserAction,
  patchMyProfileAction,
  verifyMyPasswordAction,
} from "@/actions/admin-data.action";
import { getApiV1Base } from "@/lib/apiBaseUrl";
import { useRouter } from "next/navigation";

const getAvatarUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return url.startsWith("/") ? url : "/" + url;
};

export default function AdminSettingsClient({ initialSite, user }) {
  const router = useRouter();
  const fileRef = useRef(null);
  const infoFileRef = useRef(null);

  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(false);

  // === Add Admin State ===
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    position: "",
  });
  const [adminPreview, setAdminPreview] = useState("");

  // === Info State ===
  const [infoForm, setInfoForm] = useState({
    name: user?.name || "",
    position: user?.position || "",
    bio: user?.bio || "",
  });
  const [infoPreview, setInfoPreview] = useState("");

  // === Password State ===
  const [passStep, setPassStep] = useState(1);
  const [passForm, setPassForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // === Email State ===
  const [emailStep, setEmailStep] = useState(1);
  const [emailForm, setEmailForm] = useState({ oldPassword: "", newEmail: "" });

  const closeModal = () => {
    setActiveModal(null);
    setLoading(false);
    // Reset steps
    setPassStep(1);
    setEmailStep(1);
    setPassForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setEmailForm({ oldPassword: "", newEmail: "" });
    setAdminForm({ name: "", email: "", password: "", bio: "", position: "" });
    setAdminPreview("");
  };

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

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let avatar;
      const f = infoFileRef.current?.files?.[0];
      if (f) avatar = await upload(f);

      const payload = { ...infoForm };
      if (avatar) payload.avatar = avatar;

      const res = await patchMyProfileAction(payload);
      if (res.success) {
        toast.success("Profile updated successfully!");
        closeModal();
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update profile.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPasswordForEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await verifyMyPasswordAction(emailForm.oldPassword);
    setLoading(false);
    if (res.success && res.match) {
      setEmailStep(2);
    } else {
      toast.error(res.message || "Incorrect password.");
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!emailForm.newEmail) return toast.error("New email required");
    setLoading(true);
    const res = await patchMyProfileAction({
      email: emailForm.newEmail,
      oldPassword: emailForm.oldPassword,
    });
    setLoading(false);
    if (res.success) {
      toast.success("Email updated successfully!");
      closeModal();
      router.refresh();
    } else {
      toast.error(res.message || "Failed to update email.");
    }
  };

  const handleVerifyPasswordForPass = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await verifyMyPasswordAction(passForm.oldPassword);
    setLoading(false);
    if (res.success && res.match) {
      setPassStep(2);
    } else {
      toast.error(res.message || "Incorrect password.");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      return toast.error("New passwords do not match.");
    }
    setLoading(true);
    const res = await patchMyProfileAction({
      password: passForm.newPassword,
      oldPassword: passForm.oldPassword,
    });
    setLoading(false);
    if (res.success) {
      toast.success("Password updated successfully!");
      closeModal();
    } else {
      toast.error(res.message || "Failed to update password.");
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let avatar;
      const f = fileRef.current?.files?.[0];
      if (f) avatar = await upload(f);

      const body = {
        name: adminForm.name.trim(),
        email: adminForm.email.trim(),
        password: adminForm.password,
        role: "ADMIN",
        bio: adminForm.bio.trim() || undefined,
        position: adminForm.position.trim() || undefined,
        ...(avatar ? { avatar } : {}),
      };

      const res = await createAdminUserAction(body);
      if (res.success) {
        toast.success("Administrator account provisioned successfully.");
        closeModal();
        router.refresh();
      } else {
        toast.error(res.message || "Failed to provision administrator.");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 pb-10">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" /> Settings
          </h1>
        </div>
        <button
          onClick={() => setActiveModal("add_admin")}
          className="inline-flex items-center gap-2 bg-primary !text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[11px] hover:bg-primary-dark transition-all shadow-md shadow-primary/10 cursor-pointer"
        >
          <Shield size={14} /> Add New Admin
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          <div className="relative shrink-0">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getAvatarUrl(user.avatar)}
                alt={user.name}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-2xl border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-4xl text-gray-300 font-bold uppercase">
                {user.name.charAt(0)}
              </div>
            )}
            <div
              className="absolute -bottom-3 -right-3 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white shadow-sm"
              title="Active Account"
            >
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 text-[10px] font-black uppercase tracking-widest mb-2 border border-rose-100">
                <Shield className="w-3 h-3" /> {user.role}
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                {user.name}
              </h2>
              {user.position && (
                <p className="text-sm font-bold text-gray-500 mt-1">
                  {user.position}
                </p>
              )}
            </div>
            {user.bio && (
              <p className="text-[13px] text-gray-600 leading-relaxed max-w-2xl bg-gray-50 p-4 rounded-2xl border border-gray-100 mx-auto sm:mx-0">
                {user.bio}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <Mail className="w-3.5 h-3.5 text-gray-400" /> {user.email}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-8 border-t border-gray-100">
          <button
            onClick={() => setActiveModal("info")}
            className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3.5 rounded-xl font-bold text-xs transition-colors border border-gray-200 cursor-pointer"
          >
            <User className="w-4 h-4" /> Update Info
          </button>
          <button
            onClick={() => setActiveModal("email")}
            className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3.5 rounded-xl font-bold text-xs transition-colors border border-gray-200 cursor-pointer"
          >
            <Mail className="w-4 h-4" /> Change Email
          </button>
          <button
            onClick={() => setActiveModal("password")}
            className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3.5 rounded-xl font-bold text-xs transition-colors border border-gray-200 cursor-pointer"
          >
            <Lock className="w-4 h-4" /> Change Password
          </button>
        </div>
      </div>

      {/* MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
                {activeModal === "info" && (
                  <>
                    <User className="w-5 h-5 text-primary" /> Update Information
                  </>
                )}
                {activeModal === "email" && (
                  <>
                    <Mail className="w-5 h-5 text-primary" /> Update Email
                    Address
                  </>
                )}
                {activeModal === "password" && (
                  <>
                    <Lock className="w-5 h-5 text-primary" /> Change Password
                  </>
                )}
                {activeModal === "add_admin" && (
                  <>
                    <Shield className="w-5 h-5 text-primary" /> Provision
                    Administrator
                  </>
                )}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: UPDATE INFO */}
            {activeModal === "info" && (
              <form
                onSubmit={handleUpdateInfo}
                className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
                    {infoPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={infoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getAvatarUrl(user.avatar)}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-300" />
                    )}
                    <div
                      className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      onClick={() => infoFileRef.current?.click()}
                    >
                      <UploadCloud className="w-5 h-5 text-white" />
                    </div>
                    <input
                      ref={infoFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setInfoPreview(URL.createObjectURL(file));
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      Profile Picture
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Click the image to upload a new avatar.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    required
                    value={infoForm.name}
                    onChange={(e) =>
                      setInfoForm({ ...infoForm, name: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Official Position
                  </label>
                  <input
                    value={infoForm.position}
                    onChange={(e) =>
                      setInfoForm({ ...infoForm, position: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="e.g. Lead Editor"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    value={infoForm.bio}
                    onChange={(e) =>
                      setInfoForm({ ...infoForm, bio: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    placeholder="Short biography..."
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary !text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {/* Modal Body: UPDATE EMAIL */}
            {activeModal === "email" && (
              <div className="p-6">
                {emailStep === 1 ? (
                  <form
                    onSubmit={handleVerifyPasswordForEmail}
                    className="space-y-5"
                  >
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 text-amber-800 text-[13px]">
                      <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                      <p>
                        please verify your current password before changing your
                        email address.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={emailForm.oldPassword}
                        onChange={(e) =>
                          setEmailForm({
                            ...emailForm,
                            oldPassword: e.target.value,
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary !text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {loading ? "Verifying..." : "Verify & Continue"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form
                    onSubmit={handleUpdateEmail}
                    className="space-y-5 animate-in slide-in-from-right-4"
                  >
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        New Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={emailForm.newEmail}
                        onChange={(e) =>
                          setEmailForm({
                            ...emailForm,
                            newEmail: e.target.value,
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="new@example.com"
                      />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEmailStep(1)}
                        className="bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary !text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {loading ? "Updating..." : "Update Email"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Modal Body: CHANGE PASSWORD */}
            {activeModal === "password" && (
              <div className="p-6">
                {passStep === 1 ? (
                  <form
                    onSubmit={handleVerifyPasswordForPass}
                    className="space-y-5"
                  >
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passForm.oldPassword}
                        onChange={(e) =>
                          setPassForm({
                            ...passForm,
                            oldPassword: e.target.value,
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary !text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {loading ? "Verifying..." : "Verify & Continue"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form
                    onSubmit={handleUpdatePassword}
                    className="space-y-5 animate-in slide-in-from-right-4"
                  >
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passForm.newPassword}
                        onChange={(e) =>
                          setPassForm({
                            ...passForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passForm.confirmPassword}
                        onChange={(e) =>
                          setPassForm({
                            ...passForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setPassStep(1)}
                        className="bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary !text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {loading ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Modal Body: ADD ADMIN */}
            {activeModal === "add_admin" && (
              <form
                onSubmit={handleAddAdmin}
                className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
                    {adminPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={adminPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-300" />
                    )}
                    <div
                      className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      onClick={() => fileRef.current?.click()}
                    >
                      <UploadCloud className="w-5 h-5 text-white" />
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setAdminPreview(URL.createObjectURL(file));
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      Profile Picture
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Optional headshot.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      required
                      value={adminForm.name}
                      onChange={(e) =>
                        setAdminForm({ ...adminForm, name: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Official Position
                    </label>
                    <input
                      value={adminForm.position}
                      onChange={(e) =>
                        setAdminForm({ ...adminForm, position: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={adminForm.email}
                      onChange={(e) =>
                        setAdminForm({ ...adminForm, email: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={adminForm.password}
                      onChange={(e) =>
                        setAdminForm({ ...adminForm, password: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Bio
                  </label>
                  <textarea
                    rows={2}
                    value={adminForm.bio}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, bio: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#8B0000] !text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-rose-900 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Provisioning..." : "Create Admin"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
