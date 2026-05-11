"use client";
import { useState, useEffect } from "react";
import { X, Tag, Edit, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function TagsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [tagToEdit, setTagToEdit] = useState(null);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [tags, setTags] = useState([]);

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/v1/admin/tags", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setTags(data.data || []);
      }
    } catch (e) {
      toast.error("Failed to load tags.");
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const openDeleteModal = (tag) => {
    setTagToDelete(tag);
    setIsDeleteModalOpen(true);
  };

  const openEditModal = (tag) => {
    setTagToEdit(tag);
    setIsEditModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!tagToDelete) return;
    try {
      const res = await fetch(`/api/v1/admin/tags/${tagToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setTags(tags.filter((t) => t.id !== tagToDelete.id));
        setIsDeleteModalOpen(false);
        toast.success("Meta tag completely purged and unbound!");
      } else {
        toast.error("Database connection refused purge request.");
      }
    } catch (e) {
      toast.error("Unknown endpoint delete failure.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = new FormData(e.target).get("name");
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    try {
      const res = await fetch(`/api/v1/admin/tags`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ name, slug }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Generic Tag synced successfully.");
        setIsModalOpen(false);
        fetchTags();
      } else {
        toast.error("Database schema violation checking tags.");
      }
    } catch (e) {
      toast.error("Network upload tag failed.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!tagToEdit) return;

    const name = new FormData(e.target).get("name");
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    try {
      const res = await fetch(`/api/v1/admin/tags/${tagToEdit.id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ name, slug }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Meta Tag mapping dynamically updated.");
        setIsEditModalOpen(false);
        fetchTags();
      } else {
        toast.error("Tag update failed to persist onto Prisma.");
      }
    } catch (e) {
      toast.error("Network failure editing tags.");
    }
  };

  return (
    <div className="space-y-6 relative text-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Tags Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Global tags to apply across breaking and hot news types.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary !text-white px-4 py-1.5 text-xs rounded shadow hover:bg-primary-dark font-medium tracking-wide flex items-center gap-2 cursor-pointer"
        >
          <Tag className="w-3.5 h-3.5" /> Create Meta Tag
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="p-4 border-b border-gray-200 bg-gray-50/80 rounded-t-lg">
            <div className="grid grid-cols-12 text-[11px] font-semibold text-gray-500 tracking-wider">
              <div className="col-span-4 uppercase">Tag Name</div>
              <div className="col-span-4 uppercase">URL Slug</div>
              <div className="col-span-2 uppercase text-center">Linked Posts</div>
              <div className="col-span-2 text-right uppercase">Actions</div>
            </div>
          </div>

          <div className="p-4 space-y-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="group grid grid-cols-12 items-center bg-white border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="col-span-4 flex items-center gap-3">
                <div className="bg-purple-50 text-purple-700 border border-purple-200 p-1.5 rounded flex items-center justify-center font-medium">
                  <Tag className="w-3.5 h-3.5 text-purple-700" />
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {tag.name}
                </span>
              </div>
              <div className="col-span-4 text-xs text-gray-600 font-mono font-medium bg-gray-100 px-2.5 py-0.5 rounded border border-gray-200 w-fit">
                /{tag.slug}
              </div>
              <div className="col-span-2 flex items-center justify-center text-[11px] font-semibold text-gray-600">
                <span className="bg-white px-3 py-0.5 rounded-full border border-gray-300">
                  {tag._count?.posts || 0}
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-end gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(tag)}
                  className="p-1.5 text-blue-600 hover:bg-blue-100 rounded border border-transparent hover:border-blue-200 transition-colors cursor-pointer"
                  title="Edit Tag"
                >
                  <Edit className="w-4 h-4 text-primary" />
                </button>
                <button
                  onClick={() => openDeleteModal(tag)}
                  className="p-1.5 text-red-600 hover:bg-red-100 rounded border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                  title="Delete Tag"
                >
                  <Trash2 className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>
          ))}
          {tags.length === 0 && (
            <div className="text-center py-6 text-sm text-gray-500 font-medium">
              No tags initialized inside Database.
            </div>
          )}
        </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-[15px] font-semibold text-gray-800">
                Assign New Tag
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:bg-gray-200 p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-widest mb-1.5">
                  Tag Name
                </label>
                <input
                  name="name"
                  required
                  type="text"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-[#00453e] font-medium text-gray-800 focus:ring-1 focus:ring-[#00453e] bg-white"
                  placeholder="e.g. Breaking News"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-gray-200 bg-gray-50 -mx-5 py-4 px-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-800 transition-colors shadow-sm rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00453e] text-white px-5 py-1.5 text-xs rounded border border-[#00453e] shadow flex items-center justify-center font-medium tracking-wide hover:bg-[#00453e]/90 cursor-pointer"
                >
                  Create Generic Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-[15px] font-semibold text-gray-800">
                Edit Active Tag
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:bg-gray-200 p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-widest mb-1.5">
                  Tag Name
                </label>
                <input
                  name="name"
                  required
                  type="text"
                  defaultValue={tagToEdit?.name}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-[#00453e] font-medium text-gray-800 focus:ring-1 focus:ring-[#00453e] bg-white"
                  placeholder="e.g. Breaking News"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-gray-200 bg-gray-50 -mx-5 py-4 px-5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-800 transition-colors shadow-sm rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary !text-white px-5 py-1.5 text-xs rounded border border-primary shadow flex items-center justify-center font-medium tracking-wide hover:bg-primary-dark cursor-pointer"
                >
                  Update Generic Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-sm p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 border border-red-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Meta Tag?
            </h3>
            <p className="text-sm text-gray-500 font-medium mb-6">
              Are you want to delete{" "}
              <strong className="font-semibold text-gray-800">
                {tagToDelete?.name}
              </strong>
            </p>
            <div className="flex gap-3 justify-center w-full">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium text-sm rounded transition-colors shadow-sm cursor-pointer"
              >
                Abort
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 border border-red-600 !text-white font-medium text-sm rounded shadow-sm transition-colors cursor-pointer"
              >
                Yes, Purge It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
