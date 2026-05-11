"use client";

import { useState, useMemo, useEffect } from "react";
import { UserCheck, UserX, Shield, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { patchAdminUserStatusAction } from "@/actions/admin-data.action";
import { useRouter } from "next/navigation";
import AdminTablePagination, { ADMIN_PAGE_SIZE } from "@/components/dashboard/AdminTablePagination";
const getAvatarUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return url.startsWith("/") ? url : "/" + url;
};

export default function UsersClient({ initialAdmins }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialAdmins);
  const [page, setPage] = useState(1);

  const pageUsers = useMemo(
    () => users.slice((page - 1) * ADMIN_PAGE_SIZE, page * ADMIN_PAGE_SIZE),
    [users, page]
  );

  useEffect(() => {
    const max = Math.max(1, Math.ceil(users.length / ADMIN_PAGE_SIZE));
    if (page > max) setPage(max);
  }, [users.length, page]);

  const updateStatus = async (userId, newStatus) => {
    try {
      const res = await patchAdminUserStatusAction(userId, newStatus);
      if (res.success) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)),
        );
        router.refresh();
        toast.success(`Admin status changed successfully!`);
      } else {
        toast.error(`Operation rejected: ${res.message}`);
      }
    } catch (e) {
      toast.error("Live patch operation failed.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 text-emerald-800 font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>{" "}
            ACTIVE
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 text-amber-800 font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>{" "}
            PENDING
          </span>
        );
      case "BLOCKED":
        return (
          <span className="inline-flex items-center gap-1.5 text-rose-800 font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>{" "}
            BLOCKED
          </span>
        );
      default:
        return (
          <span className="text-gray-500 font-bold tracking-wide">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" /> Administrators
          </h1>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase font-black tracking-widest text-gray-500">
              <tr>
                <th className="px-6 py-4"> Identity</th>
                <th className="px-6 py-4"> Role</th>
                <th className="px-6 py-4"> Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/50 transition-colors bg-white"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {user.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getAvatarUrl(user.avatar)}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center font-bold border border-rose-100 shadow-sm shrink-0 text-lg">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-black text-[15px] text-gray-900">
                          {user.name}
                        </span>
                        <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5 tracking-wide mt-0.5">
                          <Mail className="w-3.5 h-3.5" /> {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#8B0000] text-[10px] uppercase font-black tracking-widest flex items-center gap-1.5 w-max px-2.5 py-1.5 bg-rose-50 rounded-lg border border-rose-100">
                      <Shield className="w-3.5 h-3.5" /> {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[11px]">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-xs font-bold font-[Inter]">
                      {user.status === "PENDING" && (
                        <button
                          onClick={() => updateStatus(user.id, "ACTIVE")}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer text-[11px] uppercase tracking-wider"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Approve
                        </button>
                      )}
                      {user.status === "ACTIVE" && (
                        <button
                          onClick={() => updateStatus(user.id, "BLOCKED")}
                          className="px-4 py-2 bg-white text-rose-700 border border-rose-200 rounded-xl hover:bg-rose-50 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer text-[11px] uppercase tracking-wider"
                        >
                          <UserX className="w-3.5 h-3.5" /> Revoke Access
                        </button>
                      )}
                      {user.status === "BLOCKED" && (
                        <button
                          onClick={() => updateStatus(user.id, "ACTIVE")}
                          className="px-4 py-2 bg-white text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-50 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer text-[11px] uppercase tracking-wider"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Restore Access
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="py-12 text-center text-[13px] text-gray-500 font-bold uppercase tracking-wider"
                  >
                    No administrators found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AdminTablePagination
          page={page}
          totalItems={users.length}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
