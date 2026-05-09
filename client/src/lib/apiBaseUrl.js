export function getApiV1Base() {
  if (typeof window !== "undefined") {
    // Client-side: use relative path, Next.js rewrites proxy it to backend
    return "/api/v1";
  }
  // Server-side: use internal backend URL for Docker, fallback to localhost
  const base = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return base.endsWith("/api/v1") ? base : `${base}/api/v1`;
}

export function getApiStaticOrigin() {
  if (typeof window !== "undefined") {
    return "";
  }
  const base = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return base.replace(/\/api\/v1\/?$/, "");
}

/** Safely resolve image URLs, turning relative paths into absolute backend URLs. */
export function getImageUrl(path) {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) return path;
  
  // Next.js Image component handles relative paths by requesting them from the Next.js server.
  // Since we added a rewrite for /uploads in next.config.mjs, we can just return the relative path.
  if (path.startsWith("/")) return path;
  return `/${path}`;
}

/** Get the frontend base URL dynamically from window or env */
export function getFrontendUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_FRONTEND_URL || process.env.FRONTEND_URL || "http://localhost:3000";
}
