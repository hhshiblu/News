"use client";

import { useEffect, useRef } from "react";
import { getApiV1Base } from "@/lib/apiBaseUrl";

export default function RecordArticleClick({ slug }) {
  const done = useRef(false);
  useEffect(() => {
    if (!slug || done.current) return;
    done.current = true;
    fetch(`${getApiV1Base()}/public/posts/${encodeURIComponent(slug)}/click`, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
    }).catch(() => {}); // fire-and-forget, never block the reader
  }, [slug]);
  return null;
}
