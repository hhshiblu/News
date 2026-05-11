"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import AdminTablePagination, {
  ADMIN_PAGE_SIZE,
} from "@/components/dashboard/AdminTablePagination";
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
  UserPlus,
  Loader2,
  Save,
  ImagePlus,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import {
  createAdminUserAction,
  patchAdminUserStatusAction,
} from "@/actions/admin-data.action";
import DashboardSelect from "@/components/ui/DashboardSelect";
import { getApiV1Base } from "@/lib/apiBaseUrl";

const getAvatarUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return url.startsWith("/") ? url : "/" + url;
};

const ROLE_STYLE = {
  ADMIN: "bg-gray-900 text-white border-gray-900",
  REPORTER: "bg-blue-50 border-blue-200 text-blue-700",
  RESEARCH_AUTHOR: "bg-teal-50 border-teal-200 text-teal-800",
};

function RoleBadge({ role }) {
  const k = role || "";
  const LABELS = {
    ADMIN: "Admin",
    REPORTER: "Reporter",
    RESEARCH_AUTHOR: "Research reporter",
  };
  const label = LABELS[k] || (k ? String(k).replace(/_/g, " ") : "—");
  const cls = ROLE_STYLE[k] || "bg-gray-50 border-gray-200 text-gray-700";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border font-semibold text-[10px] tracking-wide ${cls}`}
    >
      {label}
    </span>
  );
}

export default function ReportersManagementClient({
  initialReporters = [],
  statusFilter = "ALL",
}) {
  const [reporters, setReporters] = useState(initialReporters);
  const [selectedReporter, setSelectedReporter] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newReporter, setNewReporter] = useState({
    name: "",
    email: "",
    password: "",
    role: "REPORTER",
    position: "",
    bio: "",
    twitter: "",
    linkedin: "",
    website: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const avatarInputRef = useRef(null);
  const [pendingStatus, setPendingStatus] = useState(statusFilter);
  const [listPage, setListPage] = useState(1);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setReporters(initialReporters);
    setListPage(1);
  }, [initialReporters]);

  useEffect(() => {
    setPendingStatus(statusFilter);
  }, [statusFilter]);

  const applyFilter = () => {
    const q = pendingStatus === "ALL" ? "" : `?status=${pendingStatus}`;
    router.push(`${pathname}${q}`);
  };

  const updateStatus = async (reporterId, newStatus) => {
    const res = await patchAdminUserStatusAction(reporterId, newStatus);
    if (res.success) {
      setReporters((prev) =>
        prev.map((u) =>
          u.id === reporterId ? { ...u, status: newStatus } : u,
        ),
      );
      toast.success("Reporter status updated");
      router.refresh();
    } else {
      toast.error(res.message || "Update failed");
    }
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setCreating(false);
    setAvatarPreview("");
    setNewReporter({
      name: "",
      email: "",
      password: "",
      role: "REPORTER",
      position: "",
      bio: "",
      twitter: "",
      linkedin: "",
      website: "",
    });
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const uploadAvatar = async (file) => {
    const fd = new FormData();
    fd.append("media", file);
    const res = await fetch(`${getApiV1Base()}/admin/upload`, {
      method: "POST",
      body: fd,
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url)
      throw new Error(data.message || "Avatar upload failed");
    return data.url;
  };

  const submitNewReporter = async (e) => {
    e.preventDefault();
    const file = avatarInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Reporter photo is required");
      return;
    }
    setCreating(true);
    try {
      const avatar = await uploadAvatar(file);
      const socials = {};
      if (newReporter.twitter.trim())
        socials.twitter = newReporter.twitter.trim();
      if (newReporter.linkedin.trim())
        socials.linkedin = newReporter.linkedin.trim();
      if (newReporter.website.trim())
        socials.website = newReporter.website.trim();

      const payload = {
        name: newReporter.name.trim(),
        email: newReporter.email.trim(),
        password: newReporter.password,
        role: newReporter.role,
        avatar,
        position: newReporter.position.trim() || undefined,
        bio: newReporter.bio.trim() || undefined,
        socials: Object.keys(socials).length ? socials : undefined,
      };
      const res = await createAdminUserAction(payload);
      if (!res.success)
        throw new Error(res.message || "Create reporter failed");
      toast.success("Reporter created successfully");
      closeAddModal();
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Failed to create reporter");
    } finally {
      setCreating(false);
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
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />{" "}
            PENDING
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

  const activeCount = useMemo(
    () => reporters.filter((a) => a.status === "ACTIVE").length,
    [reporters],
  );
  const pendingCount = useMemo(
    () => reporters.filter((a) => a.status === "PENDING").length,
    [reporters],
  );
  const blockedCount = useMemo(
    () => reporters.filter((a) => a.status === "BLOCKED").length,
    [reporters],
  );

  const pageReporters = useMemo(
    () =>
      reporters.slice(
        (listPage - 1) * ADMIN_PAGE_SIZE,
        listPage * ADMIN_PAGE_SIZE,
      ),
    [reporters, listPage],
  );

  useEffect(() => {
    const max = Math.max(1, Math.ceil(reporters.length / ADMIN_PAGE_SIZE));
    if (listPage > max) setListPage(max);
  }, [reporters.length, listPage]);

  return (
    <div className="space-y-6 text-gray-800">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Edit className="w-5 h-5 text-emerald-500" /> Reporters
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[12px] font-bold !text-white shadow-sm transition-colors hover:bg-primary-dark"
        >
          <UserPlus className="h-4 w-4 text-white" /> Add New
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-[3px] border-l-blue-600">
          <div className="bg-blue-50 p-2.5 rounded-full text-blue-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1">
              Total
            </p>
            <p className="text-2xl font-black text-gray-900 leading-none">
              {reporters.length}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-[3px] border-l-emerald-600">
          <div className="bg-emerald-50 p-2.5 rounded-full text-emerald-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1">
              Active
            </p>
            <p className="text-2xl font-black text-gray-900 leading-none">
              {activeCount}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-[3px] border-l-amber-500">
          <div className="bg-amber-50 p-2.5 rounded-full text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1">
              Pending
            </p>
            <p className="text-2xl font-black text-gray-900 leading-none">
              {pendingCount}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-[3px] border-l-red-600">
          <div className="bg-red-50 p-2.5 rounded-full text-red-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1">
              Blocked
            </p>
            <p className="text-2xl font-black text-gray-900">{blockedCount}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50/50 px-2 py-3 sm:px-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Filter by status
          </p>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1 sm:flex-initial sm:min-w-44">
              <span className="sr-only">Status</span>
              <DashboardSelect
                aria-label="Filter reporters by status"
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
              className="shrink-0 rounded-xl bg-primary px-5 py-2.5 text-[12px] font-bold !text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="mx-0 overflow-x-auto">
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
              {pageReporters.map((reporter) => (
                <tr
                  key={reporter.id}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-3">
                      {reporter.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getAvatarUrl(reporter.avatar)}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover border border-gray-100 shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold border shrink-0">
                          {reporter.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm text-gray-800 truncate">
                          {reporter.name}
                        </span>
                        <span className="text-[10px] font-medium text-gray-500 flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 shrink-0" /> {reporter.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                    <RoleBadge role={reporter.role} />
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-xs">
                    {getStatusBadge(reporter.status)}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs font-medium flex-wrap">
                      <button
                        type="button"
                        onClick={() => setSelectedReporter(reporter)}
                        className="p-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition-colors cursor-pointer"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {reporter.status === "PENDING" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(reporter.id, "ACTIVE")}
                          className="p-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all cursor-pointer"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {reporter.status === "ACTIVE" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(reporter.id, "BLOCKED")}
                          className="p-1.5 bg-red-50 text-red-700 border border-red-200 rounded-xl hover:bg-red-100 transition-all cursor-pointer"
                          title="Suspend"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      {reporter.status === "BLOCKED" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(reporter.id, "ACTIVE")}
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
              {reporters.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="py-8 text-center text-sm font-medium text-gray-500"
                  >
                    No reporters found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AdminTablePagination
          page={listPage}
          totalItems={reporters.length}
          onPageChange={setListPage}
        />
      </div>

      {selectedReporter && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full sm:max-w-md max-h-[92vh] sm:max-h-[90vh] overflow-hidden border border-gray-200 flex flex-col animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex justify-between items-start p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                {selectedReporter.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getAvatarUrl(selectedReporter.avatar)}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover border border-gray-200 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 border border-gray-300 text-gray-700 flex items-center justify-center font-bold text-lg shrink-0">
                    {selectedReporter.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 truncate">
                    {selectedReporter.name}
                  </h2>
                  <p className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5 mt-0.5 truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0" />{" "}
                    {selectedReporter.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReporter(null)}
                className="text-gray-400 hover:bg-gray-200 p-1.5 rounded transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                    Status
                  </p>
                  <div>{getStatusBadge(selectedReporter.status)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                    Role
                  </p>
                  <RoleBadge role={selectedReporter.role} />
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 col-span-2 sm:col-span-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                    Total Posts
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {selectedReporter._count?.posts ??
                      selectedReporter.posts?.length ??
                      0}
                  </p>
                </div>
              </div>
              {selectedReporter.position ? (
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    Role title
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {selectedReporter.position}
                  </p>
                </div>
              ) : null}
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  Joined
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {selectedReporter.createdAt
                    ? new Date(selectedReporter.createdAt).toLocaleString()
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  Biography
                </p>
                <p className="text-sm font-medium text-gray-800 bg-gray-50 p-3 rounded border border-gray-100 leading-relaxed">
                  {selectedReporter.bio || "No biography attached."}
                </p>
              </div>
              {selectedReporter.socials &&
              typeof selectedReporter.socials === "object" &&
              Object.values(selectedReporter.socials).some(Boolean) ? (
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Social
                  </p>
                  <ul className="space-y-1 text-[12px]">
                    {Object.entries(selectedReporter.socials).map(
                      ([key, val]) =>
                        val ? (
                          <li key={key}>
                            <span className="font-semibold text-gray-600">
                              {key}:{" "}
                            </span>
                            <span className="break-all text-gray-800">
                              {String(val)}
                            </span>
                          </li>
                        ) : null,
                    )}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedReporter(null)}
                className="w-full sm:w-auto rounded-xl bg-primary px-4 py-2.5 text-xs font-bold !text-white hover:bg-primary-dark transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 p-0 sm:p-4 backdrop-blur-sm">
          <div className="w-full sm:max-w-2xl max-h-[94vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur">
              <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-primary" /> Add New Reporter
              </h3>
              <button
                type="button"
                onClick={closeAddModal}
                className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form
              onSubmit={submitNewReporter}
              className="space-y-4 px-4 py-4 sm:px-5 sm:py-5"
            >
              <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-3">
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Reporter photo (required)
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-white"
                  >
                    {avatarPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarPreview}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-500">
                        <ImagePlus className="h-5 w-5" />
                      </div>
                    )}
                  </button>
                  <div className="text-[12px] text-gray-600">
                    <p className="font-semibold text-gray-800">
                      Click the box to upload avatar
                    </p>
                    <p>JPG, PNG, WEBP supported.</p>
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setAvatarPreview(file ? URL.createObjectURL(file) : "");
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Full name
                  </span>
                  <input
                    required
                    value={newReporter.name}
                    onChange={(e) =>
                      setNewReporter((s) => ({ ...s, name: e.target.value }))
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Email
                  </span>
                  <input
                    required
                    type="email"
                    value={newReporter.email}
                    onChange={(e) =>
                      setNewReporter((s) => ({ ...s, email: e.target.value }))
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Password
                  </span>
                  <input
                    required
                    type="password"
                    value={newReporter.password}
                    onChange={(e) =>
                      setNewReporter((s) => ({
                        ...s,
                        password: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Role
                  </span>
                  <DashboardSelect
                    fullWidth
                    value={newReporter.role}
                    onChange={(val) =>
                      setNewReporter((s) => ({ ...s, role: val }))
                    }
                    options={[{ value: "REPORTER", label: "Reporter" }]}
                  />
                </label>
                <label>
                  <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Position
                  </span>
                  <input
                    value={newReporter.position}
                    onChange={(e) =>
                      setNewReporter((s) => ({
                        ...s,
                        position: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Bio
                  </span>
                  <textarea
                    rows={3}
                    value={newReporter.bio}
                    onChange={(e) =>
                      setNewReporter((s) => ({ ...s, bio: e.target.value }))
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Twitter
                  </span>
                  <input
                    value={newReporter.twitter}
                    onChange={(e) =>
                      setNewReporter((s) => ({ ...s, twitter: e.target.value }))
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-500">
                    LinkedIn
                  </span>
                  <input
                    value={newReporter.linkedin}
                    onChange={(e) =>
                      setNewReporter((s) => ({
                        ...s,
                        linkedin: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Website
                  </span>
                  <input
                    value={newReporter.website}
                    onChange={(e) =>
                      setNewReporter((s) => ({ ...s, website: e.target.value }))
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold !text-white hover:bg-primary-dark disabled:opacity-60"
                >
                  {creating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 text-white" />
                  )}
                  Create Reporter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
