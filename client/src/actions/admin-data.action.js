"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function authFetch(path, options = {}) {
  const cookieStore = await cookies();
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });
}

export async function getAdminPostsAction(query = "") {
  try {
    const q = query ? `?${query}` : "";
    const res = await authFetch(`/admin/posts${q}`);
    if (!res.ok) return { posts: [], total: 0, totalPages: 1 };
    return await res.json();
  } catch (_) {
    return { posts: [], total: 0, totalPages: 1 };
  }
}

export async function getAdminPostByIdAction(id) {
  try {
    const res = await authFetch("/admin/posts?limit=250");
    if (!res.ok) return null;
    const data = await res.json();
    return (data.posts || []).find((post) => post.id === id) || null;
  } catch (_) {
    return null;
  }
}

export async function getAdminSubmissionsAction() {
  try {
    const res = await authFetch("/admin/submissions");
    if (!res.ok) return [];
    const data = await res.json();
    return data.submissions || [];
  } catch (_) {
    return [];
  }
}

export async function getAdminSubscribersAction() {
  try {
    const res = await authFetch("/admin/newsletter");
    if (!res.ok) return [];
    const data = await res.json();
    return data.subscribers || [];
  } catch (_) {
    return [];
  }
}

export async function deleteNewsletterSubscriberAction(id) {
  try {
    const res = await authFetch(`/admin/newsletter/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    return { success: res.ok, message: data?.message };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

export async function deleteAdminSubmissionAction(id) {
  try {
    const res = await authFetch(`/admin/submissions/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    return { success: res.ok, message: data?.message };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

/** statusFilter: ALL | ACTIVE | PENDING | BLOCKED */
export async function listAdminReportersAction(statusFilter = "ALL") {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("roleIn", "AUTHOR,REPORTER,RESEARCH_AUTHOR");
    if (statusFilter && statusFilter !== "ALL") {
      queryParams.append("status", statusFilter);
    }
    const res = await authFetch(`/admin/users?${queryParams.toString()}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return [];
    return data.data || [];
  } catch (_) {
    return [];
  }
}

export async function listAdminOnlyUsersAction(statusFilter = "ALL") {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("roleIn", "ADMIN");
    if (statusFilter && statusFilter !== "ALL") {
      queryParams.append("status", statusFilter);
    }
    const res = await authFetch(`/admin/users?${queryParams.toString()}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return [];
    return data.data || [];
  } catch (_) {
    return [];
  }
}

export async function patchAdminUserStatusAction(reporterId, newStatus) {
  try {
    const res = await authFetch(`/admin/users/${reporterId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await res.json().catch(() => ({}));
    return { success: res.ok, message: data?.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function patchMyProfileAction(payload) {
  try {
    const res = await authFetch("/admin/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) revalidatePath("/dashboard/account");
    return { success: res.ok, data: data.data, message: data?.message };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

export async function verifyMyPasswordAction(oldPassword) {
  try {
    const res = await authFetch("/admin/users/me/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword }),
    });
    const data = await res.json().catch(() => ({}));
    return { success: res.ok, match: data.match, message: data?.message };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

export async function createAdminUserAction(body) {
  try {
    const res = await authFetch("/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) revalidatePath("/dashboard/reporters");
    return { success: res.ok, data: data.data, message: data?.message };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

export async function getSiteConfigAction() {
  try {
    const res = await authFetch("/admin/site-config");
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return null;
    return data.data || null;
  } catch {
    return null;
  }
}

export async function patchSiteConfigAction(updates) {
  try {
    const res = await authFetch("/admin/site-config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) revalidatePath("/dashboard/settings");
    return { success: res.ok, data: data.data, message: data?.message };
  } catch (e) {
    return { success: false, message: e.message };
  }
}
