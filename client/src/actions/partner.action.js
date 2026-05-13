"use server";

import { cookies } from "next/headers";
import { getApiV1Base } from "@/lib/apiBaseUrl";
import { cookieStoreToHeader } from "@/lib/cookieHeader";

async function authFetch(path, options = {}) {
  const cookieStore = await cookies();
  return fetch(`${getApiV1Base()}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Cookie: cookieStoreToHeader(cookieStore),
    },
    cache: "no-store",
  });
}

export async function listPartnersAction() {
  try {
    const res = await authFetch("/admin/partners");
    const data = await res.json().catch(() => ({}));
    return { success: res.ok, data: data?.data || [], message: data?.message };
  } catch (error) {
    return { success: false, data: [], message: error.message };
  }
}

export async function createPartnerAction(formData) {
  try {
    const res = await authFetch("/admin/partners", {
      method: "POST",
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    return { success: res.ok, data: data?.data || null, message: data?.message };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  }
}

export async function updatePartnerAction(id, formData) {
  try {
    const res = await authFetch(`/admin/partners/${id}`, {
      method: "PATCH",
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    return { success: res.ok, data: data?.data || null, message: data?.message };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  }
}

export async function deletePartnerAction(id) {
  try {
    const res = await authFetch(`/admin/partners/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    return { success: res.ok, message: data?.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
