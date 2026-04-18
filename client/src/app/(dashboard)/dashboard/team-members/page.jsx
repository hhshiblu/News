"use client";

import { useEffect, useState } from "react";
import { ImagePlus, List, PlusCircle, X } from "lucide-react";
import { toast } from "sonner";
import {
  createTeamMemberAction,
  deleteTeamMemberAction,
  listTeamMembersAction,
  updateTeamMemberAction,
} from "@/actions/team-member.action";
import FormField from "@/components/ui/FormField";

const inputCls =
  "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

const INITIAL_FORM = {
  name: "",
  role: "",
  description: "",
  email: "",
  phone: "",
  department: "",
  experienceYears: 0,
  skills: "",
  priority: 0,
  active: true,
};

export default function TeamMembersPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const fetchItems = async () => {
    const res = await listTeamMembersAction();
    setItems(res.data || []);
  };

  useEffect(() => { fetchItems(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !imageFile) return toast.error("Team member image is required");
    setUploading(true);
    const fd = new FormData();
    fd.append("name", form.name || "");
    fd.append("role", form.role || "");
    fd.append("description", form.description || "");
    fd.append("email", form.email || "");
    fd.append("phone", form.phone || "");
    fd.append("department", form.department || "");
    fd.append("experienceYears", String(form.experienceYears || 0));
    fd.append("skills", form.skills || "");
    fd.append("priority", String(form.priority || 0));
    fd.append("active", form.active ? "true" : "false");
    if (imageFile) fd.append("image", imageFile);
    const res = editingId
      ? await updateTeamMemberAction(editingId, fd)
      : await createTeamMemberAction(fd);
    setUploading(false);
    if (!res.success) return toast.error(res.message || "Save failed");
    toast.success(editingId ? "Updated" : "Created");
    setForm(INITIAL_FORM);
    setEditingId(null);
    setImageFile(null);
    setShowForm(false);
    fetchItems();
  };

  const onDelete = async (id) => {
    const res = await deleteTeamMemberAction(id);
    if (!res.success) return toast.error("Delete failed");
    fetchItems();
  };

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-extrabold text-gray-900">Team Members</h1>
        <button
          type="button"
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingId(null);
              setForm(INITIAL_FORM);
              setImageFile(null);
            } else {
              setShowForm(true);
            }
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-[12px] font-bold text-white shadow-sm hover:bg-primary-dark transition-colors"
        >
          {showForm ? <List className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
          {showForm ? "Show List" : "Add Team Member"}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Full name" htmlFor="tm-name">
              <input id="tm-name" className={inputCls} placeholder="e.g. Jamil Rahman" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </FormField>
            <FormField label="Position / role" htmlFor="tm-role">
              <input id="tm-role" className={inputCls} placeholder="e.g. Senior reporter" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </FormField>
            <FormField label="Department" htmlFor="tm-dept">
              <input id="tm-dept" className={inputCls} placeholder="e.g. Investigative desk" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </FormField>
            <FormField label="Email" htmlFor="tm-email" hint="Optional — for internal contact only">
              <input id="tm-email" type="email" className={inputCls} placeholder="name@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </FormField>
            <FormField label="Phone" htmlFor="tm-phone">
              <input id="tm-phone" className={inputCls} placeholder="+880 …" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </FormField>
            <FormField label="Experience (years)" htmlFor="tm-exp">
              <input id="tm-exp" type="number" className={inputCls} min={0} value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) || 0 })} />
            </FormField>
            <FormField label="Skills" htmlFor="tm-skills" hint="Comma-separated">
              <input id="tm-skills" className={inputCls} placeholder="Fact-checking, data, video …" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
            </FormField>
            <FormField label="Priority" htmlFor="tm-pri" hint="Higher sorts first on the public team page">
              <input id="tm-pri" type="number" className={inputCls} value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) || 0 })} />
            </FormField>
          </div>
          <FormField label="Bio / description" htmlFor="tm-desc">
            <textarea id="tm-desc" className={`${inputCls} min-h-[96px] resize-y`} placeholder="Short bio shown on the team page" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </FormField>
          <FormField label="Photo" hint={editingId ? "Optional when editing — leave empty to keep current image" : "Required — JPG, PNG or WebP"}>
            <label className="block rounded-2xl border-2 border-dashed border-gray-300 p-5 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setImageFile(f);
                }}
              />
              <ImagePlus className="mx-auto mb-2 h-7 w-7 text-gray-500" />
              <p className="text-[13px] font-semibold text-gray-700">{uploading ? "Saving…" : "Click or drop image"}</p>
              <p className="text-[11px] text-gray-500 mt-1">{imageFile ? imageFile.name : "Max ~5MB"}</p>
            </label>
          </FormField>
          <label className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Active member (visible on site)
          </label>
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button type="submit" className="rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold text-white shadow-sm hover:bg-primary-dark transition-colors">
              {editingId ? "Update Member" : "Create Member"}
            </button>
            <button type="button" onClick={() => { setForm(INITIAL_FORM); setEditingId(null); setShowForm(false); setImageFile(null); }} className="rounded-xl border px-4 py-2.5 text-[13px] font-semibold text-gray-600 inline-flex items-center justify-center gap-2">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[860px] text-left">
            <thead className="bg-gray-50">
              <tr className="text-[11px] uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t text-[13px]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={it.photoUrl} alt={it.name} className="h-10 w-10 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-gray-900">{it.name}</p>
                        <p className="text-[11px] text-gray-500">{it.department || "Team"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-700">{it.role || "Contributor"}</p>
                    <p className="text-[11px] text-gray-500">{it.experienceYears ? `${it.experienceYears} years exp.` : "N/A"}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[260px]">{it.description || "No description added yet."}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <p>{it.email || "-"}</p>
                    <p>{it.phone || "-"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${it.active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                      {it.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(it.id);
                  setForm({
                    name: it.name,
                    role: it.role || "",
                    description: it.description || "",
                    email: it.email || "",
                    phone: it.phone || "",
                    department: it.department || "",
                    experienceYears: it.experienceYears || 0,
                    skills: it.skills || "",
                    priority: it.priority || 0,
                    active: it.active ?? true,
                  });
                }}
                className="px-2 py-1 text-[12px] border rounded-lg"
              >
                Edit
              </button>
              <button onClick={() => onDelete(it.id)} className="px-2 py-1 text-[12px] border rounded-lg text-rose-600">
                Delete
              </button>
            </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
