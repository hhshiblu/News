"use client";

import { useState, useRef } from "react";
import { Settings, UserPlus, Shield, X, Loader2, Save, Building2 } from "lucide-react";
import { toast } from "sonner";
import { createAdminUserAction, patchSiteConfigAction } from "@/actions/admin-data.action";
import { getApiV1Base } from "@/lib/apiBaseUrl";
import { useRouter } from "next/navigation";

function StaffModal({ kind, open, onClose }) {
  const router = useRouter();
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState(kind === "admin" ? "ADMIN" : "AUTHOR");
  const [preview, setPreview] = useState("");
  const [socials, setSocials] = useState({ twitter: "", linkedin: "", website: "" });

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

      const body =
        kind === "admin"
          ? {
              name: name.trim(),
              email: email.trim(),
              password,
              role: "ADMIN",
              bio: bio.trim() || undefined,
              position: position.trim() || undefined,
              ...(avatar ? { avatar } : {}),
            }
          : (() => {
              const cleaned = {};
              Object.entries(socials).forEach(([k, v]) => {
                const t = String(v || "").trim();
                if (t) cleaned[k] = t;
              });
              return {
                name: name.trim(),
                email: email.trim(),
                password,
                role,
                bio: bio.trim() || undefined,
                position: position.trim() || undefined,
                socials: Object.keys(cleaned).length ? cleaned : undefined,
                ...(avatar ? { avatar } : {}),
              };
            })();

      const res = await createAdminUserAction(body);
      if (res.success) {
        toast.success(kind === "admin" ? "Admin invited" : "Staff user created");
        onClose();
        router.refresh();
        setName("");
        setEmail("");
        setPassword("");
        setBio("");
        setPosition("");
        setPreview("");
        fileRef.current && (fileRef.current.value = "");
      } else toast.error(res.message || "Failed");
    } catch (err) {
      toast.error(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-[#fdfcfb] px-5 py-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            {kind === "admin" ? <Shield className="h-4 w-4 text-primary" /> : <UserPlus className="h-4 w-4 text-emerald-600" />}
            {kind === "admin" ? "Add administrator" : "Add author / staff"}
          </h3>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 p-5">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-[10px] font-semibold text-gray-400"
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="h-full w-full object-cover" />
              ) : (
                "Photo"
              )}
            </button>
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
            {kind === "staff" && (
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase text-gray-500">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="AUTHOR">Author</option>
                  <option value="REPORTER">Reporter</option>
                  <option value="RESEARCH_AUTHOR">Research author</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase text-gray-500">Full name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Email</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Password</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase text-gray-500">Position / title</label>
              <input value={position} onChange={(e) => setPosition(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase text-gray-500">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
            </div>
            {kind === "staff" && (
              <div className="sm:col-span-2 grid gap-2 sm:grid-cols-3">
                {["twitter", "linkedin", "website"].map((k) => (
                  <div key={k}>
                    <label className="text-[10px] font-bold uppercase text-gray-500">{k}</label>
                    <input
                      value={socials[k]}
                      onChange={(e) => setSocials((s) => ({ ...s, [k]: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-2 py-1.5 text-xs"
                      placeholder="URL"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold !text-white hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminSettingsClient({ initialSite }) {
  const router = useRouter();
  const [siteTitle, setSiteTitle] = useState(initialSite?.siteTitle || "LabourPulse");
  const [tagline, setTagline] = useState(initialSite?.tagline || "");
  const [contactEmail, setContactEmail] = useState(initialSite?.contactEmail || "");
  const [footerNote, setFooterNote] = useState(initialSite?.footerNote || "");
  const [saving, setSaving] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const saveSite = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await patchSiteConfigAction({
      siteTitle: siteTitle.trim(),
      tagline: tagline.trim() || null,
      contactEmail: contactEmail.trim() || null,
      footerNote: footerNote.trim() || null,
    });
    setSaving(false);
    if (res.success) {
      toast.success("Site settings saved");
      router.refresh();
    } else toast.error(res.message || "Failed");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-16">
      <div>
        <h1 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Settings className="h-5 w-5 text-primary" /> Settings
        </h1>
        <p className="mt-1 text-[12px] text-gray-500">Site branding and staff accounts.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStaffOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[12px] font-bold text-emerald-900 hover:bg-emerald-100"
        >
          <UserPlus className="h-4 w-4" /> Add author / reporter
        </button>
        <button
          type="button"
          onClick={() => setAdminOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-[12px] font-bold text-primary hover:bg-primary/10"
        >
          <Shield className="h-4 w-4" /> Add administrator
        </button>
      </div>

      <form onSubmit={saveSite} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Building2 className="h-4 w-4 text-gray-500" />
          <h2 className="text-sm font-bold text-gray-800">Site</h2>
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase text-gray-500">Site title</label>
          <input value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase text-gray-500">Tagline</label>
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase text-gray-500">Public contact email</label>
          <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase text-gray-500">Footer note</label>
          <textarea value={footerNote} onChange={(e) => setFooterNote(e.target.value)} rows={4} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold !text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save site settings
        </button>
      </form>

      <StaffModal kind="staff" open={staffOpen} onClose={() => setStaffOpen(false)} />
      <StaffModal kind="admin" open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}
