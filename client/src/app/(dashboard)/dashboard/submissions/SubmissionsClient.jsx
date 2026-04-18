"use client";

import { useEffect, useRef, useState } from "react";
import { Folder, Calendar, Download, UserCircle, Eye, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteAdminSubmissionAction } from "@/actions/admin-data.action";
import { formatAdminDateTime } from "@/lib/formatAdminDateTime";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const API_ORIGIN = API_BASE.replace(/\/api\/v1\/?$/, "") || "http://localhost:5000";

export default function SubmissionsClient({ initialSubmissions }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [selected, setSelected] = useState(() => new Set());
  const [viewModalData, setViewModalData] = useState(null);
  const selectAllRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setSubmissions(initialSubmissions);
  }, [initialSubmissions]);

  useEffect(() => {
    const el = selectAllRef.current;
    if (!el) return;
    el.indeterminate = selected.size > 0 && selected.size < submissions.length;
  }, [selected, submissions.length]);

  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === submissions.length) setSelected(new Set());
    else setSelected(new Set(submissions.map((s) => s.id)));
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this submission?")) return;
    const res = await deleteAdminSubmissionAction(id);
    if (!res.success) {
      toast.error(res.message || "Failed to delete");
      return;
    }
    setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (viewModalData?.id === id) setViewModalData(null);
    toast.success("Submission deleted");
    router.refresh();
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} submission(s)?`)) return;
    const ids = [...selected];
    const results = await Promise.all(ids.map((id) => deleteAdminSubmissionAction(id)));
    const failed = results.filter((r) => !r.success).length;
    if (failed) toast.error(`${failed} could not be deleted`);
    else toast.success("Selected submissions removed");
    const okIds = new Set(ids.filter((_, i) => results[i].success));
    setSubmissions((prev) => prev.filter((s) => !okIds.has(s.id)));
    setSelected(new Set());
    if (viewModalData && okIds.has(viewModalData.id)) setViewModalData(null);
    router.refresh();
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-700 pb-20">
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Folder className="w-5 h-5 text-primary shrink-0" />
          Public submissions
        </h1>
        <p className="text-[13px] text-gray-500 font-medium mt-1">
          Tips and story leads sent from the public contact flow.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-gray-200 bg-gray-50/80">
            <span className="text-[12px] font-semibold text-gray-600 mr-1">{selected.size} selected</span>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[12px] font-bold text-white shadow-sm hover:bg-primary-dark transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete selected
            </button>
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm font-semibold">No submissions yet</div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm text-gray-600 border-collapse min-w-[720px]">
              <thead className="bg-[#fcfdfd] border-b border-gray-200 text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
                <tr>
                  <th className="w-10 px-3 py-3">
                    <span className="sr-only">Select</span>
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      checked={submissions.length > 0 && selected.size === submissions.length}
                      onChange={toggleAll}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Topic</th>
                  <th className="px-3 py-3">Sender</th>
                  <th className="px-3 py-3">Evidence</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(sub.id)}
                        onChange={() => toggleOne(sub.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-3 py-3 font-medium whitespace-nowrap text-gray-700">
                      {formatAdminDateTime(sub.createdAt)}
                    </td>
                    <td className="px-3 py-3 font-semibold text-gray-900 max-w-[200px] truncate">
                      {sub.title || "Untitled"}
                    </td>
                    <td className="px-3 py-3 max-w-[150px] truncate font-medium text-gray-700">
                      <span className="inline-flex items-center gap-2">
                        <UserCircle size={14} className="text-primary shrink-0" />
                        {sub.senderName || "Anonymous"}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-semibold">
                      {sub.images && sub.images.length > 0 ? (
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-[10px] font-bold border border-emerald-100">
                          {sub.images.length} files
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setViewModalData(sub)}
                          className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(sub.id)}
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
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

      {viewModalData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl relative animate-in fade-in zoom-in-95 my-8 flex flex-col max-h-[90vh]">
            <div className="p-5 md:p-6 flex items-center justify-between border-b border-gray-100 shrink-0">
              <div className="min-w-0 pr-4">
                <h2 className="text-lg font-bold text-gray-900 truncate">{viewModalData.title || "Submission"}</h2>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mt-1">
                  Sender: {viewModalData.senderName || "Anonymous"}{" "}
                  {viewModalData.senderEmail && `(${viewModalData.senderEmail})`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewModalData(null)}
                className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-6 whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
                {viewModalData.content}
              </div>

              {viewModalData.images && viewModalData.images.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-3">
                    Attachments ({viewModalData.images.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {viewModalData.images.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100"
                      >
                        <img
                          src={`${API_ORIGIN}${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <a
                          href={`${API_BASE}/admin/submissions/download?file=${encodeURIComponent(imgUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Download className="text-white bg-white/20 p-2 rounded-full w-10 h-10" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white">Download</span>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
