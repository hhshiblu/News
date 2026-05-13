"use server";

import { cookies } from "next/headers";
import { getApiV1Base } from "@/lib/apiBaseUrl";
import { cookieStoreToHeader } from "@/lib/cookieHeader";

export async function getMe() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${getApiV1Base()}/admin/auth/me`, {
      headers: {
        Cookie: cookieStoreToHeader(cookieStore),
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}
