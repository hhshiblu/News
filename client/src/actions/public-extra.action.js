"use server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function getPublicTeamMembersAction() {
  try {
    const res = await fetch(`${API_BASE}/public/team-members`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (_) {
    return [];
  }
}

export async function getPublicPartnersAction() {
  try {
    const res = await fetch(`${API_BASE}/public/partners`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (_) {
    return [];
  }
}

export async function getPublicCategoryBySlugAction(slug) {
  try {
    const res = await fetch(`${API_BASE}/public/categories/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (_) {
    return null;
  }
}
