"use client";
import { useEffect } from "react";

export default function ReadingProgressBar() {
  useEffect(() => {
    const bar = document.getElementById("reading-progress");
    if (!bar) return;

    const onScroll = () => {
      const article = document.getElementById("article-content");
      if (!article) return;
      const scrollTop = window.scrollY;
      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const progress = Math.min(
        Math.max(((scrollTop - articleTop) / (articleHeight - windowHeight)) * 100, 0),
        100
      );
      bar.style.width = `${progress}%`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div id="reading-progress" aria-hidden="true" />;
}
