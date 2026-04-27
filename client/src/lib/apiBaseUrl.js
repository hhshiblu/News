export function getApiV1Base() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
}

/** Static files (e.g. /uploads) are served from the same host as the API without /api/v1. */
export function getApiStaticOrigin() {
  return getApiV1Base().replace(/\/api\/v1\/?$/, "");
}
