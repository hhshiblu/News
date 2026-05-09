"use client";

import { useEffect, useRef } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function RecordArticleClick({ slug }) {
  const done = useRef(false);
  useEffect(() => {
    if (!slug || done.current) return;
    done.current = true;
    fetch(`${API}/public/posts/${encodeURIComponent(slug)}/click`, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
    }).catch(() => {}); // fire-and-forget, never block the reader
  }, [slug]);
  return null;
}
