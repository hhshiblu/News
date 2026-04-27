"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Folder, Image as ImageIcon, Edit, Trash2, PlusCircle, AlertTriangle } from "lucide-react";
import { createCategoryAction, deleteCategoryAction } from "@/actions/category.action";
import { toast } from "sonner";
import DashboardSelect from "@/components/ui/DashboardSelect";
import ImageUploadPreview from "@/components/ui/ImageUploadPreview";

export default function CategoriesManagementClient({ initialCategories = [] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [modalParentId, setModalParentId] = useState("");
  const [categoryImageFile, setCategoryImageFile] = useState(null);

  const [isPending, startTransition] = useTransition();

  const openAddModal = (parentId = "") => {
    setModalParentId(parentId || "");
    setCategoryImageFile(null);
    setIsModalOpen(true);
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!categoryToDelete) return;
    startTransition(async () => {
      const res = await deleteCategoryAction(categoryToDelete.id);
      if (res.success) {
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
        toast.success("Category deleted successfully!");
        router.refresh();
      } else {
        toast.error(res.message || "Delete failed");
      }
    });
  };

  const parentSelectOptions = [
    { value: "", label: "— None (root level) —" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = String(new FormData(form).get("name") || "").trim();
    if (!name) {
      toast.error("Category name is required");
      return;
    }

    const fd = new FormData();
    fd.append("name", name);
    fd.append("parentId", modalParentId || "");
    if (categoryImageFile) fd.append("image", categoryImageFile);

    startTransition(async () => {
      try {
        const res = await createCategoryAction(fd);
        if (res.success) {
          toast.success("Category created and saved to database.");
          setIsModalOpen(false);
          setCategoryImageFile(null);
          setModalParentId("");
          router.refresh();
        } else {
          toast.error(res.message || "Failed to create category");
        }
      } catch (err) {
        toast.error("Category action crashed.");
      }
    });
  };

  return (
    <div className="relative space-y-6 text-gray-800">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Categories Tree</h1>
          <p className="mt-1 text-xs text-gray-500">Hierarchical distribution of the news vertical.</p>
        </div>
        <button
          type="button"
          onClick={() => openAddModal("")}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold tracking-wide !text-white shadow hover:bg-primary-dark"
        >
          <Folder className="h-3.5 w-3.5" /> Create Category
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="rounded-t-lg border-b border-gray-200 bg-gray-50/80 p-3.5">
          <div className="grid grid-cols-12 text-xs font-semibold tracking-wider text-gray-600">
            <div className="col-span-6 uppercase">Category Name</div>
            <div className="col-span-3 uppercase">Total Posts</div>
            <div className="col-span-3 text-right uppercase">Actions</div>
          </div>
        </div>

        <div className="space-y-3 p-4">
          {categories.map((parent) => (
            <div key={parent.id} className="relative">
              <div className="group grid grid-cols-12 items-center rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm transition-colors hover:bg-gray-50">
                <div className="col-span-6 flex items-center gap-3">
                  <div className="flex items-center justify-center rounded border border-emerald-200 bg-emerald-50 p-1.5 font-medium text-emerald-800">
                    {parent.imageUrl ? <ImageIcon className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{parent.name}</span>
                </div>
                <div className="col-span-3 flex items-center text-xs font-medium text-gray-600">
                  <span className="rounded-full border border-gray-200 bg-gray-100 px-3 py-0.5">0 posts</span>
                </div>
                <div className="col-span-3 flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => openAddModal(parent.id)}
                    className="cursor-pointer rounded border border-transparent p-1.5 text-emerald-600 transition-colors hover:border-emerald-200 hover:bg-emerald-100"
                    title="Add nested category"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer rounded border border-transparent p-1.5 text-blue-600 transition-colors hover:border-blue-200 hover:bg-blue-100"
                    title="Edit category"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openDeleteModal(parent)}
                    className="cursor-pointer rounded border border-transparent p-1.5 text-red-600 transition-colors hover:border-red-200 hover:bg-red-100"
                    title="Delete category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {parent.children && parent.children.length > 0 && (
                <div className="relative mt-2 ml-[19px] space-y-2 border-l-2 border-gray-200 pb-2 pl-6">
                  {parent.children.map((child) => (
                    <div
                      key={child.id}
                      className="group relative grid grid-cols-12 items-center rounded-lg border border-gray-200 bg-gray-50/50 p-2 transition-colors hover:bg-white"
                    >
                      <div className="absolute -left-[26px] top-1/2 w-6 border-t-2 border-gray-200" />
                      <div className="col-span-6 flex items-center gap-3">
                        <div className="flex items-center justify-center rounded border border-gray-300 bg-white p-1 text-gray-500">
                          <Folder className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[13px] font-medium text-gray-700">{child.name}</span>
                      </div>
                      <div className="col-span-3 flex items-center text-[11px] font-medium text-gray-600">
                        <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5">0 posts</span>
                      </div>
                      <div className="col-span-3 flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          className="cursor-pointer rounded border border-transparent p-1.5 text-blue-600 transition-colors hover:border-blue-200 hover:bg-blue-100"
                          title="Edit subcategory"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(child)}
                          className="cursor-pointer rounded border border-transparent p-1.5 text-red-600 transition-colors hover:border-red-200 hover:bg-red-100"
                          title="Delete subcategory"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
          <div className="animate-in fade-in zoom-in-95 relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl duration-200">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
              <h2 className="text-[15px] font-semibold text-gray-800">Add New Category</h2>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setCategoryImageFile(null);
                }}
                className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-gray-700">
                  Category Name
                </label>
                <input
                  name="name"
                  required
                  type="text"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Industry & Economy"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-gray-700">
                  Parent category (optional)
                </label>
                <DashboardSelect
                  aria-label="Parent category"
                  value={modalParentId}
                  onChange={(v) => setModalParentId(typeof v === "string" ? v : String(v))}
                  options={parentSelectOptions}
                />
                {modalParentId ? (
                  <p className="mt-1 text-[10px] font-medium text-emerald-600">Nesting under selected parent</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-gray-700">
                  Category image <span className="text-[10px] font-normal normal-case tracking-normal text-gray-400">(optional)</span>
                </label>
                <ImageUploadPreview
                  fullWidth
                  file={categoryImageFile}
                  onFileChange={(f) => setCategoryImageFile(f)}
                  emptyTitle="Add category image"
                  emptyHint="Stored under uploads/category · max 1 file"
                />
              </div>

              <div className="-mx-5 mt-6 flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCategoryImageFile(null);
                  }}
                  className="rounded border border-gray-300 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center rounded border border-primary bg-primary px-5 py-1.5 text-xs font-bold tracking-wide !text-white shadow transition-colors hover:bg-primary-dark disabled:opacity-50"
                >
                  {isPending ? "Saving…" : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-red-200 bg-red-100 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">Are you sure?</h3>
            <p className="mb-6 text-sm font-medium text-gray-500">
              You are about to permanently delete{" "}
              <strong className="font-semibold text-gray-800">{categoryToDelete?.name}</strong>. This act is absolutely
              irreversible.
            </p>
            <div className="flex w-full justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 rounded border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Abort
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 rounded bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Yes, Delete It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
