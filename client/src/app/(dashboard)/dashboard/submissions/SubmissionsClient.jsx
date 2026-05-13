"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Folder,
  Calendar,
  Download,
  UserCircle,
  Eye,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteAdminSubmissionAction } from "@/actions/admin-data.action";
import { formatAdminDateTime } from "@/lib/formatAdminDateTime";
import AdminTablePagination, {
  ADMIN_PAGE_SIZE,
} from "@/components/dashboard/AdminTablePagination";
import { getApiV1Base, getClientSiteOrigin } from "@/lib/apiBaseUrl";

export default function SubmissionsClient({ initialSubmissions }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [selected, setSelected] = useState(() => new Set());
  const [viewModalData, setViewModalData] = useState(null);
  const [page, setPage] = useState(1);
  const selectAllRef = useRef(null);
  const router = useRouter();

  const displayRows = useMemo(
    () =>
      submissions.slice((page - 1) * ADMIN_PAGE_SIZE, page * ADMIN_PAGE_SIZE),
    [submissions, page],
  );

  useEffect(() => {
    setSubmissions(initialSubmissions);
    setPage(1);
    setSelected(new Set());
  }, [initialSubmissions]);

  useEffect(() => {
    const max = Math.max(1, Math.ceil(submissions.length / ADMIN_PAGE_SIZE));
    if (page > max) setPage(max);
  }, [submissions.length, page]);

  useEffect(() => {
    const el = selectAllRef.current;
    if (!el) return;
    const ids = displayRows.map((r) => r.id);
    const n = ids.filter((id) => selected.has(id)).length;
    el.indeterminate = n > 0 && n < ids.length;
  }, [selected, displayRows]);

  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    const ids = displayRows.map((r) => r.id);
    const allOnPage = ids.length > 0 && ids.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPage) ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    });
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
    const results = await Promise.all(
      ids.map((id) => deleteAdminSubmissionAction(id)),
    );
    const failed = results.filter((r) => !r.success).length;
    if (failed) toast.error(`${failed} could not be deleted`);
    else toast.success("Selected submissions removed");
    const okIds = new Set(ids.filter((_, i) => results[i].success));
    setSubmissions((prev) => prev.filter((s) => !okIds.has(s.id)));
    setSelected(new Set());
    if (viewModalData && okIds.has(viewModalData.id)) setViewModalData(null);
    router.refresh();
  };

  const allOnPageSelected =
    displayRows.length > 0 && displayRows.every((r) => selected.has(r.id));

  return (
    <div className="animate-in fade-in space-y-5 pb-20 duration-700">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900">
          <Folder className="h-5 w-5 shrink-0 text-primary" />
          Public submissions
        </h1>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50/80 px-3 py-2.5 sm:px-4">
            <span className="mr-1 text-[12px] font-semibold text-gray-600">
              {selected.size} selected
            </span>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[12px] font-bold !text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete selected
            </button>
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="py-16 text-center text-sm font-semibold text-gray-400">
            No submissions yet
          </div>
        ) : (
          <>
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm text-gray-600">
                <thead className="border-b border-gray-200 bg-[#fcfdfd] text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="w-10 px-3 py-3">
                      <span className="sr-only">Select</span>
                      <input
                        ref={selectAllRef}
                        type="checkbox"
                        checked={allOnPageSelected}
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
                  {displayRows.map((sub) => (
                    <tr
                      key={sub.id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(sub.id)}
                          onChange={() => toggleOne(sub.id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 font-medium text-gray-700">
                        {formatAdminDateTime(sub.createdAt)}
                      </td>
                      <td className="max-w-[200px] truncate px-3 py-3 font-semibold text-gray-900">
                        {sub.title || "Untitled"}
                      </td>
                      <td className="max-w-[150px] truncate px-3 py-3 font-medium text-gray-700">
                        <span className="inline-flex items-center gap-2">
                          <UserCircle
                            size={14}
                            className="shrink-0 text-primary"
                          />
                          {sub.senderName || "Anonymous"}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-semibold">
                        {sub.images && sub.images.length > 0 ? (
                          <span className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                            {sub.images.length} files
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setViewModalData(sub)}
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-primary/5 hover:text-primary"
                            title="View"
                            aria-label="View submission"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(sub.id)}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                            title="Delete"
                            aria-label="Delete submission"
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
            <AdminTablePagination
              page={page}
              totalItems={submissions.length}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {viewModalData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-gray-900/60 p-4 backdrop-blur-sm">
          <div className="relative my-8 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 p-5 md:p-6">
              <div className="min-w-0 pr-4">
                <h2 className="truncate text-lg font-bold text-gray-900">
                  {viewModalData.title || "Submission"}
                </h2>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Sender: {viewModalData.senderName || "Anonymous"}{" "}
                  {viewModalData.senderEmail &&
                    `(${viewModalData.senderEmail})`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewModalData(null)}
                className="shrink-0 rounded-full bg-gray-50 p-2 text-gray-500 transition-colors hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="custom-scrollbar flex-1 overflow-y-auto p-5 md:p-6">
              <div className="mb-6 whitespace-pre-wrap rounded-xl border border-gray-100 bg-gray-50 p-5 text-sm leading-relaxed text-gray-700">
                {viewModalData.content}
              </div>

              {viewModalData.images && viewModalData.images.length > 0 && (
                <div>
                  <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Attachments ({viewModalData.images.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {viewModalData.images.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm"
                      >
                        <img
                          src={`${getClientSiteOrigin()}${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                        <a
                          href={`${getApiV1Base()}/admin/submissions/download?file=${encodeURIComponent(imgUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-gray-900/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Download className="h-10 w-10 rounded-full bg-white/20 p-2 text-white" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                              Download
                            </span>
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
