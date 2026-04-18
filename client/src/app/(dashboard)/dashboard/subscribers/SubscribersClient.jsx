"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Calendar, Trash2, Send } from "lucide-react";
import { deleteNewsletterSubscriberAction } from "@/actions/admin-data.action";
import { formatAdminDateTime } from "@/lib/formatAdminDateTime";

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
  const selectAllRef = useRef(null);

  useEffect(() => {
    setRows(initialSubscribers);
  }, [initialSubscribers]);

  useEffect(() => {
    const el = selectAllRef.current;
    if (!el) return;
    el.indeterminate = selected.size > 0 && selected.size < rows.length;
  }, [selected, rows.length]);

  const selectedEmails = useMemo(
    () => rows.filter((r) => selected.has(r.id)).map((r) => r.email),
    [rows, selected]
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
    if (selected.size === rows.length) setSelected(new Set());
    else setSelected(new Set(rows.map((r) => r.id)));
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
    const results = await Promise.all(ids.map((id) => deleteNewsletterSubscriberAction(id)));
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

  return (
    <div className="space-y-5 animate-in fade-in duration-700 pb-20">
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary shrink-0" />
          Newsletter subscribers
        </h1>
        <p className="text-[13px] text-gray-500 font-medium mt-1">
          Export selections to your mail app, or remove addresses from the list.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-gray-200 bg-gray-50/80">
            <span className="text-[12px] font-semibold text-gray-600 mr-1">{selected.size} selected</span>
            <button
              type="button"
              onClick={onSendEmailSelected}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[12px] font-bold text-white shadow-sm hover:bg-primary-dark transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Send email
            </button>
            <button
              type="button"
              onClick={onDeleteSelected}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 py-2 text-[12px] font-bold text-rose-700 hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete selected
            </button>
          </div>
        )}

        {rows.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm font-semibold">No subscribers yet</div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm text-gray-600 border-collapse min-w-[520px]">
              <thead className="bg-[#fcfdfd] border-b border-gray-200 text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
                <tr>
                  <th className="w-10 px-3 py-3">
                    <span className="sr-only">Select</span>
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      checked={rows.length > 0 && selected.size === rows.length}
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
                {rows.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(sub.id)}
                        onChange={() => toggleOne(sub.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-3 py-3 font-semibold text-gray-900">{sub.email}</td>
                    <td className="px-3 py-3 font-medium text-gray-600">
                      <span className="inline-flex items-center gap-2">
                        <Calendar size={14} className="text-primary shrink-0" />
                        {formatAdminDateTime(sub.createdAt)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1">
                        <a
                          href={mailtoSingle(sub.email)}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-white hover:bg-primary-dark transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Send email
                        </a>
                        <button
                          type="button"
                          onClick={() => onDeleteOne(sub.id)}
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove subscriber"
                        >
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
}
