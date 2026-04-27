"use client";

import { useEffect, useState, useMemo } from "react";
import { List, PlusCircle, X, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  createDepartmentAction,
  deleteDepartmentAction,
  listDepartmentsAction,
  updateDepartmentAction,
} from "@/actions/department.action";
import FormField from "@/components/ui/FormField";
import AdminTablePagination, { ADMIN_PAGE_SIZE } from "@/components/dashboard/AdminTablePagination";

const inputCls =
  "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

const INITIAL_FORM = { name: "" };

export default function DepartmentsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [listPage, setListPage] = useState(1);

  const fetchItems = async () => {
    const res = await listDepartmentsAction();
    setItems(res.data || []);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const pageItems = useMemo(
    () => items.slice((listPage - 1) * ADMIN_PAGE_SIZE, listPage * ADMIN_PAGE_SIZE),
    [items, listPage]
  );

  useEffect(() => {
    const max = Math.max(1, Math.ceil(items.length / ADMIN_PAGE_SIZE));
    if (listPage > max) setListPage(max);
  }, [items.length, listPage]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const name = (form.name || "").trim();
    if (!name) return toast.error("Department name is required");
    setSaving(true);
    const res = editingId
      ? await updateDepartmentAction(editingId, { name })
      : await createDepartmentAction({ name });
    setSaving(false);
    if (!res.success) return toast.error(res.message || "Save failed");
    toast.success(editingId ? "Department updated" : "Department created");
    setForm(INITIAL_FORM);
    setEditingId(null);
    setShowForm(false);
    setListPage(1);
    fetchItems();
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this department? Team members linked to it will have no department.")) return;
    const res = await deleteDepartmentAction(id);
    if (!res.success) return toast.error(res.message || "Delete failed");
    toast.success("Department deleted");
    fetchItems();
  };

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-extrabold text-gray-900">Departments</h1>
        <button
          type="button"
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingId(null);
              setForm(INITIAL_FORM);
            } else {
              setShowForm(true);
            }
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-[12px] font-bold !text-white shadow-sm hover:bg-primary-dark transition-colors"
        >
          {showForm ? <List className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
          {showForm ? "Show List" : "Add Department"}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
          <FormField label="Department name" htmlFor="dept-name">
            <input
              id="dept-name"
              className={inputCls}
              placeholder="e.g. Editorial"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </FormField>
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold !text-white shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {saving ? "Saving…" : editingId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(INITIAL_FORM);
                setEditingId(null);
                setShowForm(false);
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
            <table className="w-full min-w-[480px] text-left">
              <thead className="bg-gray-50">
                <tr className="text-[11px] uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3">Name</th>
                  <th className="w-[1%] whitespace-nowrap px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((it) => (
                  <tr key={it.id} className="border-t text-[13px]">
                    <td className="px-4 py-3 font-semibold text-gray-900">{it.name}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowForm(true);
                            setEditingId(it.id);
                            setForm({ name: it.name || "" });
                          }}
                          className="inline-flex rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary"
                          title="Edit"
                          aria-label={`Edit ${it.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(it.id)}
                          className="inline-flex rounded-lg border border-rose-200 p-2 text-rose-600 transition-colors hover:bg-rose-50"
                          title="Delete"
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
          <AdminTablePagination page={listPage} totalItems={items.length} onPageChange={setListPage} />
        </div>
      )}
    </div>
  );
}
