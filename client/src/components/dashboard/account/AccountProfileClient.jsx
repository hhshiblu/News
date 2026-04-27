"use client";

import { useState, useRef } from "react";
import { User, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { patchMyProfileAction } from "@/actions/admin-data.action";
import { getApiV1Base, getApiStaticOrigin } from "@/lib/apiBaseUrl";
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
  const [name, setName] = useState(initialUser?.name || "");
  const [bio, setBio] = useState(initialUser?.bio || "");
  const [position, setPosition] = useState(initialUser?.position || "");
  const [pw, setPw] = useState("");
  const [socials, setSocials] = useState(() => safeSocials(initialUser?.socials));
  const [avatarPreview, setAvatarPreview] = useState(
    initialUser?.avatar ? `${getApiStaticOrigin()}${initialUser.avatar}` : ""
  );
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);

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

  const save = async (e) => {
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
      if (pw.trim()) payload.password = pw.trim();

      const res = await patchMyProfileAction(payload);
      if (res.success) {
        toast.success("Profile updated");
        setPw("");
        router.refresh();
      } else toast.error(res.message || "Failed");
    } catch (err) {
      toast.error(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 pb-16">
      <div>
        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <User className="h-5 w-5 text-primary" /> My account
        </h1>
        <p className="text-[12px] text-gray-500 mt-1">Update how you appear on articles and your author page.</p>
      </div>

      <form onSubmit={save} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-primary/40 transition-colors"
          >
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-gray-400 px-2 text-center">
                Photo
              </span>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setAvatarPreview(URL.createObjectURL(file));
            }} />
          </button>
          <div className="flex-1 space-y-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Profile photo</p>
            <p className="text-[11px] text-gray-400">Square image · click to replace</p>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase text-gray-500">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase text-gray-500">Role title / beat</label>
          <input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g. Senior correspondent"
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase text-gray-500">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-y min-h-[100px]"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {["twitter", "linkedin", "website"].map((k) => (
            <div key={k}>
              <label className="text-[10px] font-bold uppercase text-gray-500">{k}</label>
              <input
                value={socials[k] || ""}
                onChange={(e) => setSocials((s) => ({ ...s, [k]: e.target.value }))}
                placeholder="URL"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase text-gray-500">New password (optional)</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold !text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save
        </button>
      </form>
    </div>
  );
}
