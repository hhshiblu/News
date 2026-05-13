"use server";

import { cookies } from "next/headers";
import { getApiV1Base } from "@/lib/apiBaseUrl";
import { cookieStoreToHeader } from "@/lib/cookieHeader";

async function authFetch(path, options = {}) {
  const cookieStore = await cookies();
  return fetch(`${getApiV1Base()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Cookie: cookieStoreToHeader(cookieStore),
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
