"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Calendar, Trash2, Send, Download } from "lucide-react";
import { deleteNewsletterSubscriberAction } from "@/actions/admin-data.action";
import { formatAdminDateTime } from "@/lib/formatAdminDateTime";
import AdminTablePagination, {
  ADMIN_PAGE_SIZE,
} from "@/components/dashboard/AdminTablePagination";

const MAIL_SUBJECT = "LabourPulse";

function mailtoSingle(email) {
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(MAIL_SUBJECT)}`;
}

function mailtoBulk(emails) {
  if (emails.length === 0) return "";
  const q = new URLSearchParams();
  q.set("subject", MAIL_SUBJECT);
  q.set("bcc", emails.join(","));
  return `mailto:?${q.toString()}`;
}

export default function SubscribersClient({ initialSubscribers = [] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialSubscribers);
  const [selected, setSelected] = useState(() => new Set());
  const [page, setPage] = useState(1);
  const selectAllRef = useRef(null);

  const displayRows = useMemo(
    () => rows.slice((page - 1) * ADMIN_PAGE_SIZE, page * ADMIN_PAGE_SIZE),
    [rows, page],
  );

  useEffect(() => {
    setRows(initialSubscribers);
    setPage(1);
    setSelected(new Set());
  }, [initialSubscribers]);

  useEffect(() => {
    const max = Math.max(1, Math.ceil(rows.length / ADMIN_PAGE_SIZE));
    if (page > max) setPage(max);
  }, [rows.length, page]);

  useEffect(() => {
    const el = selectAllRef.current;
    if (!el) return;
    const ids = displayRows.map((r) => r.id);
    const n = ids.filter((id) => selected.has(id)).length;
    el.indeterminate = n > 0 && n < ids.length;
  }, [selected, displayRows]);

  const selectedEmails = useMemo(
    () => rows.filter((r) => selected.has(r.id)).map((r) => r.email),
    [rows, selected],
  );

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

  const onDeleteOne = async (id) => {
    if (!confirm("Remove this subscriber from the list?")) return;
    const res = await deleteNewsletterSubscriberAction(id);
    if (!res.success) {
      toast.error(res.message || "Could not delete");
      return;
    }
    toast.success("Subscriber removed");
    setRows((prev) => prev.filter((r) => r.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    router.refresh();
  };

  const onDeleteSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Remove ${selected.size} subscriber(s)?`)) return;
    const ids = [...selected];
    const results = await Promise.all(
      ids.map((id) => deleteNewsletterSubscriberAction(id)),
    );
    const failed = results.filter((r) => !r.success).length;
    if (failed) toast.error(`${failed} delete(s) failed`);
    else toast.success("Selected subscribers removed");
    setRows((prev) => prev.filter((r) => !selected.has(r.id)));
    setSelected(new Set());
    router.refresh();
  };

  const onSendEmailSelected = () => {
    if (selectedEmails.length === 0) {
      toast.error("Select at least one subscriber");
      return;
    }
    window.location.href = mailtoBulk(selectedEmails);
  };

  const allOnPageSelected =
    displayRows.length > 0 && displayRows.every((r) => selected.has(r.id));

  const onExportCSV = () => {
    if (displayRows.length === 0) {
      toast.error("No subscribers to export on this page");
      return;
    }
    
    const header = "Email,Subscribed Date\n";
    const csvContent = displayRows.map(sub => {
      const emailStr = `"${sub.email.replace(/"/g, '""')}"`;
      const dateStr = `"${formatAdminDateTime(sub.createdAt).replace(/"/g, '""')}"`;
      return `${emailStr},${dateStr}`;
    }).join("\n");
    
    const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `subscribers_page_${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-in fade-in space-y-5 pb-20 duration-700">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900">
          <Mail className="h-5 w-5 shrink-0 text-primary" />
          Subscribers
        </h1>
        <button
          type="button"
          onClick={onExportCSV}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-[12px] font-bold !text-white shadow-sm hover:bg-primary-dark transition-colors"
        >
          <Download className="h-4 w-4" />
          Export Page
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50/80 px-3 py-2.5 sm:px-4">
            <span className="mr-1 text-[12px] font-semibold text-gray-600">
              {selected.size} selected
            </span>
            <button
              type="button"
              onClick={onSendEmailSelected}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[12px] font-bold !text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              <Send className="h-3.5 w-3.5" />
              Send email
            </button>
            <button
              type="button"
              onClick={onDeleteSelected}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 py-2 text-[12px] font-bold text-rose-700 transition-colors hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete selected
            </button>
          </div>
        )}

        {rows.length === 0 ? (
          <div className="py-16 text-center text-sm font-semibold text-gray-400">
            No subscribers yet
          </div>
        ) : (
          <>
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm text-gray-600">
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
                    <th className="px-3 py-3">Email</th>
                    <th className="px-3 py-3">Subscribed</th>
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
                      <td className="px-3 py-3 font-semibold text-gray-900">
                        {sub.email}
                      </td>
                      <td className="px-3 py-3 font-medium text-gray-600">
                        <span className="inline-flex items-center gap-2">
                          <Calendar
                            size={14}
                            className="shrink-0 text-primary"
                          />
                          {formatAdminDateTime(sub.createdAt)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <a
                            href={mailtoSingle(sub.email)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex rounded-lg bg-primary p-2 !text-white transition-colors hover:bg-primary-dark"
                            title="Send email"
                            aria-label={`Send email to ${sub.email}`}
                          >
                            <Send className="h-4 w-4" />
                          </a>
                          <button
                            type="button"
                            onClick={() => onDeleteOne(sub.id)}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                            title="Remove subscriber"
                            aria-label="Remove subscriber"
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
              page={page}
              totalItems={rows.length}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
