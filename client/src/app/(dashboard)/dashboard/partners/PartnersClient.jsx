"use client";

import { useEffect, useState, useMemo } from "react";
import { List, PlusCircle, X, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  createPartnerAction,
  deletePartnerAction,
  listPartnersAction,
  updatePartnerAction,
} from "@/actions/partner.action";
import FormField from "@/components/ui/FormField";
import ImageUploadPreview from "@/components/ui/ImageUploadPreview";
import AdminTablePagination, {
  ADMIN_PAGE_SIZE,
} from "@/components/dashboard/AdminTablePagination";

const inputCls =
  "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";
const numCls = `${inputCls} input-no-spinner`;

const INITIAL_FORM = {
  name: "",
  websiteUrl: "",
  description: "",
  industry: "",
  contactEmail: "",
  contactPhone: "",
  address: "",
  priority: 0,
  active: true,
};

export default function PartnersClient({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState(null);
  const [listPage, setListPage] = useState(1);

  const fetchItems = async () => {
    const res = await listPartnersAction();
    setItems(res.data || []);
  };

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const pageItems = useMemo(
    () =>
      items.slice((listPage - 1) * ADMIN_PAGE_SIZE, listPage * ADMIN_PAGE_SIZE),
    [items, listPage],
  );

  useEffect(() => {
    const max = Math.max(1, Math.ceil(items.length / ADMIN_PAGE_SIZE));
    if (listPage > max) setListPage(max);
  }, [items.length, listPage]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !imageFile)
      return toast.error("Partner logo is required");
    const fd = new FormData();
    fd.append("name", form.name || "");
    fd.append("websiteUrl", form.websiteUrl || "");
    fd.append("description", form.description || "");
    fd.append("industry", form.industry || "");
    fd.append("contactEmail", form.contactEmail || "");
    fd.append("contactPhone", form.contactPhone || "");
    fd.append("address", form.address || "");
    fd.append("priority", String(form.priority || 0));
    fd.append("active", form.active ? "true" : "false");
    if (imageFile) fd.append("image", imageFile);
    const res = editingId
      ? await updatePartnerAction(editingId, fd)
      : await createPartnerAction(fd);
    if (!res.success) return toast.error(res.message || "Save failed");
    toast.success(editingId ? "Updated" : "Created");
    setForm(INITIAL_FORM);
    setImageFile(null);
    setExistingLogoUrl(null);
    setEditingId(null);
    setShowForm(false);
    setListPage(1);
    fetchItems();
  };

  const onDelete = async (id) => {
    if (!confirm("Remove this partner?")) return;
    const res = await deletePartnerAction(id);
    if (!res.success) return toast.error(res.message || "Delete failed");
    toast.success("Partner deleted");
    fetchItems();
  };

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-extrabold text-gray-900">Partners</h1>
        <button
          type="button"
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingId(null);
              setForm(INITIAL_FORM);
              setImageFile(null);
              setExistingLogoUrl(null);
            } else {
              setShowForm(true);
            }
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-[12px] font-bold !text-white shadow-sm hover:bg-primary-dark transition-colors"
        >
          {showForm ? (
            <List className="h-4 w-4" />
          ) : (
            <PlusCircle className="h-4 w-4" />
          )}
          {showForm ? "Show List" : "Add Partner"}
        </button>
      </div>

      {showForm ? (
        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Company name" htmlFor="pt-name">
              <input
                id="pt-name"
                className={inputCls}
                placeholder="Official partner name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </FormField>
            <FormField label="Industry" htmlFor="pt-ind">
              <input
                id="pt-ind"
                className={inputCls}
                placeholder="e.g. Media, NGO, Tech"
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
              />
            </FormField>
            <FormField label="Website URL" htmlFor="pt-web">
              <input
                id="pt-web"
                className={inputCls}
                placeholder="https://…"
                value={form.websiteUrl}
                onChange={(e) =>
                  setForm({ ...form, websiteUrl: e.target.value })
                }
              />
            </FormField>
            <FormField label="Contact email" htmlFor="pt-mail">
              <input
                id="pt-mail"
                type="email"
                className={inputCls}
                placeholder="contact@partner.com"
                value={form.contactEmail}
                onChange={(e) =>
                  setForm({ ...form, contactEmail: e.target.value })
                }
              />
            </FormField>
            <FormField label="Contact phone" htmlFor="pt-phone">
              <input
                id="pt-phone"
                className={inputCls}
                placeholder="+880 …"
                value={form.contactPhone}
                onChange={(e) =>
                  setForm({ ...form, contactPhone: e.target.value })
                }
              />
            </FormField>
            <FormField
              label="Priority"
              htmlFor="pt-pri"
              hint="Higher appears first in sliders"
            >
              <input
                id="pt-pri"
                type="number"
                className={numCls}
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: Number(e.target.value) || 0 })
                }
              />
            </FormField>
          </div>
          <FormField label="Short description" htmlFor="pt-desc">
            <textarea
              id="pt-desc"
              className={`${inputCls} min-h-[88px] resize-y`}
              placeholder="One or two lines for cards and partner page"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </FormField>
          <FormField label="Address" htmlFor="pt-addr">
            <textarea
              id="pt-addr"
              className={`${inputCls} min-h-[72px] resize-y`}
              placeholder="Optional office address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </FormField>

          <FormField
            label="Logo"
            hint={
              editingId
                ? "Optional — click image to replace; max 1 file"
                : "Required — max 1 image"
            }
          >
            <ImageUploadPreview
              file={imageFile}
              onFileChange={(f) => setImageFile(f)}
              existingUrl={!imageFile ? existingLogoUrl : null}
              emptyTitle="Upload partner logo"
              emptyHint="PNG, JPG or WebP · transparent PNG looks best"
            />
          </FormField>
          <label className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary focus:ring-primary"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Active
          </label>
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold !text-white shadow-sm hover:bg-primary-dark transition-colors"
            >
              {editingId ? "Update Partner" : "Create Partner"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(INITIAL_FORM);
                setEditingId(null);
                setShowForm(false);
                setImageFile(null);
                setExistingLogoUrl(null);
              }}
              className="rounded-xl border px-4 py-2.5 text-[13px] font-semibold text-gray-600 inline-flex items-center justify-center gap-2"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-gray-50">
                <tr className="text-[11px] uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3">Partner</th>
                  <th className="px-4 py-3">Industry</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="w-[1%] whitespace-nowrap px-4 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((it) => (
                  <tr key={it.id} className="border-t text-[13px]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={it.logoUrl}
                          alt={it.name}
                          className="h-10 w-14 rounded-md border bg-gray-50 object-contain p-1"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{it.name}</p>
                          <p className="text-[11px] text-gray-500">
                            Priority {it.priority || 0}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {it.industry || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <p>{it.contactEmail || "-"}</p>
                      <p>{it.contactPhone || "-"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-semibold ${it.active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                      >
                        {it.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowForm(true);
                            setEditingId(it.id);
                            setImageFile(null);
                            setExistingLogoUrl(it.logoUrl || null);
                            setForm({
                              name: it.name,
                              websiteUrl: it.websiteUrl || "",
                              description: it.description || "",
                              industry: it.industry || "",
                              contactEmail: it.contactEmail || "",
                              contactPhone: it.contactPhone || "",
                              address: it.address || "",
                              priority: it.priority || 0,
                              active: it.active ?? true,
                            });
                          }}
                          className="inline-flex rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary"
                          title="Edit partner"
                          aria-label={`Edit ${it.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(it.id)}
                          className="inline-flex rounded-lg border border-rose-200 p-2 text-rose-600 transition-colors hover:bg-rose-50"
                          title="Delete partner"
                          aria-label={`Delete ${it.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminTablePagination
            page={listPage}
            totalItems={items.length}
            onPageChange={setListPage}
          />
        </div>
      )}
    </div>
  );
}
