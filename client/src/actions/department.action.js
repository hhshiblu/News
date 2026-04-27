"use server";

import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function authFetch(path, options = {}) {
  const cookieStore = await cookies();
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });
}

export async function listDepartmentsAction() {
  try {
    const res = await authFetch("/admin/departments");
    const data = await res.json().catch(() => ({}));
    return { success: res.ok, data: data?.data || [], message: data?.message };
  } catch (error) {
    return { success: false, data: [], message: error.message };
  }
}

export async function createDepartmentAction(payload) {
  try {
    const res = await authFetch("/admin/departments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return { success: res.ok, data: data?.data || null, message: data?.message };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  }
}

export async function updateDepartmentAction(id, payload) {
  try {
    const res = await authFetch(`/admin/departments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return { success: res.ok, data: data?.data || null, message: data?.message };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  }
}

export async function deleteDepartmentAction(id) {
  try {
    const res = await authFetch(`/admin/departments/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    return { success: res.ok, message: data?.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
