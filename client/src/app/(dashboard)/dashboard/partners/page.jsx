"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function PartnersPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", logoUrl: "", websiteUrl: "", priority: 0, active: true });
  const [editingId, setEditingId] = useState(null);

  const fetchItems = async () => {
    const res = await fetch(`${API_BASE}/admin/partners`, { credentials: "include" });
    const json = await res.json();
    setItems(json.data || []);
  };

  useEffect(() => { fetchItems(); }, []);

  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("media", file);
    const res = await fetch(`${API_BASE}/admin/upload`, { method: "POST", body: fd, credentials: "include" });
    const json = await res.json();
    return json?.url ? `http://localhost:5000${json.url}` : "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `${API_BASE}/admin/partners/${editingId}` : `${API_BASE}/admin/partners`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    if (!res.ok) return toast.error("Save failed");
    toast.success(editingId ? "Updated" : "Created");
    setForm({ name: "", logoUrl: "", websiteUrl: "", priority: 0, active: true });
    setEditingId(null);
    fetchItems();
  };

  const onDelete = async (id) => {
    const res = await fetch(`${API_BASE}/admin/partners/${id}`, { method: "DELETE", credentials: "include" });
    if (!res.ok) return toast.error("Delete failed");
    fetchItems();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-gray-900">Partners Management</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-white p-3 rounded-lg border">
        <input className="border rounded px-2 py-2 text-sm" placeholder="Company name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="border rounded px-2 py-2 text-sm" placeholder="Website URL" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} />
        <input type="number" className="border rounded px-2 py-2 text-sm" placeholder="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })} />
        <label className="border rounded px-2 py-2 text-sm flex items-center gap-2">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          Active
        </label>
        <input
          type="file"
          className="border rounded px-2 py-2 text-sm"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            const url = await uploadImage(f);
            setForm((prev) => ({ ...prev, logoUrl: url }));
          }}
        />
        <button className="md:col-span-5 bg-primary text-white rounded px-3 py-2 text-sm font-semibold">
          {editingId ? "Update Partner" : "Add Partner"}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((it) => (
          <div key={it.id} className="bg-white border rounded-lg p-3">
            <img src={it.logoUrl} alt={it.name} className="h-12 object-contain mb-2" />
            <p className="text-sm font-bold">{it.name}</p>
            <p className="text-xs text-gray-500">Priority: {it.priority} · {it.active ? "Active" : "Inactive"}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => {
                  setEditingId(it.id);
                  setForm({
                    name: it.name,
                    logoUrl: it.logoUrl,
                    websiteUrl: it.websiteUrl || "",
                    priority: it.priority,
                    active: it.active,
                  });
                }}
                className="px-2 py-1 text-xs border rounded"
              >
                Edit
              </button>
              <button onClick={() => onDelete(it.id)} className="px-2 py-1 text-xs border rounded text-rose-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
