"use client";

import { useEffect, useRef } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function RecordArticleClick({ slug }) {
  const done = useRef(false);
  useEffect(() => {
    if (!slug || done.current) return;
    done.current = true;
    // Temporarily disabled: backend Redis/BullMQ click flow is off.
    // fetch(`${API}/public/posts/${encodeURIComponent(slug)}/click`, {
    //   method: "POST",
    //   mode: "cors",
    //   credentials: "omit",
    // }).catch(() => {});
  }, [slug]);
  return null;
}
