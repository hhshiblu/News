"use client";
import { useState, useEffect } from "react";
import { Mail, Trash2, Eye, EyeOff, AlertTriangle, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getApiV1Base } from "@/lib/apiBaseUrl";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const limit = 15;

  const fetchMessages = async (p = 1) => {
    try {
      const res = await fetch(`${getApiV1Base()}/admin/contact-messages?page=${p}&limit=${limit}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.data || []);
        setTotal(data.total || 0);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
      }
    } catch {
      toast.error("Failed to load messages.");
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${getApiV1Base()}/admin/contact-messages/${id}/read`, { method: "PATCH", credentials: "include" });
      if (res.ok) {
        setMessages(msgs => msgs.map(m => m.id === id ? { ...m, read: true } : m));
        if (selectedMessage?.id === id) setSelectedMessage(prev => ({ ...prev, read: true }));
      }
    } catch {
      toast.error("Failed to mark as read.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${getApiV1Base()}/admin/contact-messages/${deleteTarget.id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        toast.success("Message deleted.");
        setDeleteTarget(null);
        if (selectedMessage?.id === deleteTarget.id) setSelectedMessage(null);
        fetchMessages(page);
      } else {
        toast.error("Failed to delete.");
      }
    } catch {
      toast.error("Network error.");
    }
  };

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) markAsRead(msg.id);
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
      " · " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-5 text-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Contact Messages</h1>
          <p className="text-xs text-gray-500 mt-1">
            {total} total message{total !== 1 ? "s" : ""}{unreadCount > 0 ? ` · ${unreadCount} unread` : ""}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="p-4 border-b border-gray-200 bg-gray-50/80 rounded-t-lg">
            <div className="grid grid-cols-12 text-[11px] font-semibold text-gray-500 tracking-wider">
              <div className="col-span-1 uppercase text-center">Status</div>
              <div className="col-span-2 uppercase">Name</div>
              <div className="col-span-3 uppercase">Email</div>
              <div className="col-span-2 uppercase">Subject</div>
              <div className="col-span-2 uppercase">Date</div>
              <div className="col-span-2 text-right uppercase">Actions</div>
            </div>
          </div>

          <div className="p-3 space-y-1.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`group grid grid-cols-12 items-center rounded-lg p-2.5 cursor-pointer transition-colors border ${
                  msg.read 
                    ? "bg-white border-gray-100 hover:bg-gray-50" 
                    : "bg-blue-50/40 border-blue-100 hover:bg-blue-50/60"
                }`}
              >
                <div className="col-span-1 flex justify-center">
                  {!msg.read ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-300" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                  )}
                </div>
                <div className="col-span-2">
                  <span className={`text-sm ${msg.read ? "text-gray-700" : "text-gray-900 font-bold"}`}>
                    {msg.name}
                  </span>
                </div>
                <div className="col-span-3">
                  <span className="text-xs text-gray-500 font-mono">{msg.email}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                    {msg.subject}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[11px] text-gray-400">{formatDate(msg.createdAt)}</span>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); openMessage(msg); }}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded border border-transparent hover:border-blue-200 transition-colors cursor-pointer"
                    title="View Message"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(msg); }}
                    className="p-1.5 text-red-600 hover:bg-red-100 rounded border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-10 text-sm text-gray-500 font-medium">
                No contact messages yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => fetchMessages(page - 1)}
            disabled={page <= 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-gray-600 px-3">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => fetchMessages(page + 1)}
            disabled={page >= totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* View Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-[14px] font-bold text-gray-900">{selectedMessage.name}</h2>
                  <p className="text-[11px] text-gray-500">{selectedMessage.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:bg-gray-200 p-1.5 rounded transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</span>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{selectedMessage.subject}</p>
              </div>
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message</span>
                <p className="text-[13px] text-gray-700 leading-relaxed mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {selectedMessage.message}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-[10px] text-gray-400">{formatDate(selectedMessage.createdAt)}</span>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  target="_blank"
                  className="px-4 py-1.5 bg-primary !text-white text-[11px] font-bold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 border border-red-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Message?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Delete message from <strong className="text-gray-800">{deleteTarget.name}</strong>?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium text-sm rounded transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 border border-red-600 !text-white font-medium text-sm rounded shadow-sm transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
