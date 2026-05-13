/**
 * Build the `Cookie` header for server-side fetch() to the API.
 * `ReadonlyRequestCookies` does not implement a useful `.toString()` for HTTP.
 */
export function cookieStoreToHeader(cookieStore) {
  if (!cookieStore || typeof cookieStore.getAll !== "function") return "";
  const all = cookieStore.getAll();
  if (!all.length) return "";
  return all.map((c) => `${c.name}=${c.value}`).join("; ");
}
