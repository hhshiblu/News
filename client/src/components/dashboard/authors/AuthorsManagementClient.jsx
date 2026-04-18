"use client";

import { useEffect, useState, useMemo } from "react";
import AdminTablePagination, { ADMIN_PAGE_SIZE } from "@/components/dashboard/AdminTablePagination";
import {
  Check,
  X,
  Users,
  Mail,
  RefreshCw,
  Edit,
  Eye,
  Activity,
  AlertCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { patchAdminUserStatusAction } from "@/actions/admin-data.action";
import DashboardSelect from "@/components/ui/DashboardSelect";

export default function AuthorsManagementClient({ initialAuthors = [], statusFilter = "ALL" }) {
  const [authors, setAuthors] = useState(initialAuthors);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [pendingStatus, setPendingStatus] = useState(statusFilter);
  const [listPage, setListPage] = useState(1);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setAuthors(initialAuthors);
    setListPage(1);
  }, [initialAuthors]);

  useEffect(() => {
    setPendingStatus(statusFilter);
  }, [statusFilter]);

  const applyFilter = () => {
    const q = pendingStatus === "ALL" ? "" : `?status=${pendingStatus}`;
    router.push(`${pathname}${q}`);
  };

  const updateStatus = async (authorId, newStatus) => {
    const res = await patchAdminUserStatusAction(authorId, newStatus);
    if (res.success) {
      setAuthors((prev) => prev.map((u) => (u.id === authorId ? { ...u, status: newStatus } : u)));
      toast.success("Author status updated");
      router.refresh();
    } else {
      toast.error(res.message || "Update failed");
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "REPORTER":
        return (
          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-semibold text-[10px] tracking-wide">
            REPORTER
          </span>
        );
      case "RESEARCH_AUTHOR":
        return (
          <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-700 font-semibold text-[10px] tracking-wide">
            RESEARCH AUTHOR
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> ACTIVE
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 text-amber-600 font-bold text-[11px] uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> PENDING
          </span>
        );
      case "BLOCKED":
        return (
          <span className="inline-flex items-center gap-1.5 text-red-700 font-bold text-[11px] uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> BLOCKED
          </span>
        );
      default:
        return null;
    }
  };

  const activeCount = useMemo(() => authors.filter((a) => a.status === "ACTIVE").length, [authors]);
  const pendingCount = useMemo(() => authors.filter((a) => a.status === "PENDING").length, [authors]);
  const blockedCount = useMemo(() => authors.filter((a) => a.status === "BLOCKED").length, [authors]);

  const pageAuthors = useMemo(
    () => authors.slice((listPage - 1) * ADMIN_PAGE_SIZE, listPage * ADMIN_PAGE_SIZE),
    [authors, listPage]
  );

  useEffect(() => {
    const max = Math.max(1, Math.ceil(authors.length / ADMIN_PAGE_SIZE));
    if (listPage > max) setListPage(max);
  }, [authors.length, listPage]);

  return (
    <div className="space-y-6 text-gray-800">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Edit className="w-5 h-5 text-emerald-500" /> Account Moderation Hub
          </h1>
          <p className="text-[13px] text-gray-500 font-medium mt-1">
            Review pending reporters, block malicious writers, and approve research analysts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-[3px] border-l-blue-600">
          <div className="bg-blue-50 p-2.5 rounded-full text-blue-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1">Total</p>
            <p className="text-2xl font-black text-gray-900 leading-none">{authors.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-[3px] border-l-emerald-600">
          <div className="bg-emerald-50 p-2.5 rounded-full text-emerald-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1">Active</p>
            <p className="text-2xl font-black text-gray-900 leading-none">{activeCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-[3px] border-l-amber-500">
          <div className="bg-amber-50 p-2.5 rounded-full text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1">Pending</p>
            <p className="text-2xl font-black text-gray-900 leading-none">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-[3px] border-l-red-600">
          <div className="bg-red-50 p-2.5 rounded-full text-red-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1">Blocked</p>
            <p className="text-2xl font-black text-gray-900">{blockedCount}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50/50 px-2 py-3 sm:px-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">Filter by status</p>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1 sm:flex-initial sm:min-w-[11rem]">
              <span className="sr-only">Status</span>
              <DashboardSelect
                aria-label="Filter authors by status"
                value={pendingStatus}
                onChange={setPendingStatus}
                options={[
                  { value: "ALL", label: "All matches" },
                  { value: "ACTIVE", label: "Active" },
                  { value: "PENDING", label: "Pending reviews" },
                  { value: "BLOCKED", label: "Blocked" },
                ]}
              />
            </div>
            <button
              type="button"
              onClick={applyFilter}
              className="shrink-0 rounded-xl bg-primary px-5 py-2.5 text-[12px] font-bold text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="-mx-0 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-[#fcfdfd] border-b border-gray-200 text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
              <tr>
                <th className="px-3 sm:px-4 py-3">Identity</th>
                <th className="px-3 sm:px-4 py-3">Role</th>
                <th className="px-3 sm:px-4 py-3">Status</th>
                <th className="px-3 sm:px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageAuthors.map((author) => (
                <tr key={author.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold border shrink-0">
                        {author.name.charAt(0)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm text-gray-800 truncate">{author.name}</span>
                        <span className="text-[10px] font-medium text-gray-500 flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 shrink-0" /> {author.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">{getRoleBadge(author.role)}</td>
                  <td className="px-3 sm:px-4 py-3 text-xs">{getStatusBadge(author.status)}</td>
                  <td className="px-3 sm:px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs font-medium flex-wrap">
                      <button
                        type="button"
                        onClick={() => setSelectedAuthor(author)}
                        className="p-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition-colors cursor-pointer"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {author.status === "PENDING" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(author.id, "ACTIVE")}
                          className="p-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all cursor-pointer"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {author.status === "ACTIVE" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(author.id, "BLOCKED")}
                          className="p-1.5 bg-red-50 text-red-700 border border-red-200 rounded-xl hover:bg-red-100 transition-all cursor-pointer"
                          title="Suspend"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      {author.status === "BLOCKED" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(author.id, "ACTIVE")}
                          className="p-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all cursor-pointer"
                          title="Restore"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {authors.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-sm font-medium text-gray-500">
                    No authors found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AdminTablePagination page={listPage} totalItems={authors.length} onPageChange={setListPage} />
      </div>

      {selectedAuthor && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full sm:max-w-md max-h-[92vh] sm:max-h-[90vh] overflow-hidden border border-gray-200 flex flex-col animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex justify-between items-start p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-full bg-gray-200 border border-gray-300 text-gray-700 flex items-center justify-center font-bold text-lg shrink-0">
                  {selectedAuthor.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 truncate">{selectedAuthor.name}</h2>
                  <p className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5 mt-0.5 truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0" /> {selectedAuthor.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAuthor(null)}
                className="text-gray-400 hover:bg-gray-200 p-1.5 rounded transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
                  <div>{getStatusBadge(selectedAuthor.status)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Role</p>
                  <div>{getRoleBadge(selectedAuthor.role)}</div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Biography</p>
                <p className="text-sm font-medium text-gray-800 bg-gray-50 p-3 rounded border border-gray-100 leading-relaxed">
                  {selectedAuthor.bio || "No biography attached."}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">User ID</p>
                <div className="text-[11px] font-mono font-medium text-gray-600 bg-gray-100 px-3 py-2 rounded border border-gray-200 break-all">
                  {selectedAuthor.id}
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedAuthor(null)}
                className="w-full sm:w-auto rounded-xl bg-primary px-4 py-2.5 text-xs font-bold !text-white hover:bg-primary-dark transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
