"use server";

import { getApiV1Base } from "@/lib/apiBaseUrl";

export async function getPublicTeamMembersAction() {
  try {
    const res = await fetch(`${getApiV1Base()}/public/team-members`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (_) {
    return [];
  }
}

export async function getPublicPartnersAction() {
  try {
    const res = await fetch(`${getApiV1Base()}/public/partners`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (_) {
    return [];
  }
}

export async function getPublicCategoryBySlugAction(slug) {
  try {
    const res = await fetch(`${getApiV1Base()}/public/categories/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (_) {
    return null;
  }
}
export async function getPublicStoriesAction(query = "") {
  try {
    const q = query ? `?${query}` : "";
    const res = await fetch(`${getApiV1Base()}/public/stories${q}`, { cache: "no-store" });
    if (!res.ok) return { stories: [], total: 0, totalPages: 1 };
    return await res.json();
  } catch (_) {
    return { stories: [], total: 0, totalPages: 1 };
  }
}

export async function getPublicStoryBySlugAction(slug) {
  try {
    const res = await fetch(`${getApiV1Base()}/public/stories/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (_) {
    return null;
  }
}
