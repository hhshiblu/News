"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ShareButtons from "@/components/article/ShareButtons";
import PullQuote from "@/components/article/PullQuote";
import { getFrontendUrl } from "@/lib/apiBaseUrl";

const getAvatarUrl = (url) => {
  if (!url) return "/placeholder.jpg";
  if (url.startsWith("http")) return url;
  return url.startsWith("/") ? url : "/" + url;
};

const ARTICLE_COL = "w-full max-w-[min(100%,52rem)] xl:max-w-[56rem]";

function ChevronRightIcon({ className = "w-3 h-3 text-gray-200" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VideoPlaceholderIcon({ className = "w-10 h-10 text-white/25" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

const formatTimeAgo = (dateString) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const normalizeRichTextHtml = (html) => {
  if (typeof html !== "string") return html;
  return html.replace(/&nbsp;|&#160;|\u00A0/g, " ").replace(/white-space\s*:\s*nowrap;?/gi, "");
};

export default function DashboardArticlePreview({ post }) {
  const rawCategory = post.category;
  const categoryName = rawCategory?.name || "General";
  const reporterName = post.reporter?.name || "Unknown Reporter";
  const reporterAvatar = getAvatarUrl(post.reporter?.avatar);
  const timeRef = post.publishedAt || post.createdAt;
  const timeAgo = formatTimeAgo(timeRef);
  const shareUrl = post.slug ? `${getFrontendUrl()}/news/${post.slug}` : "";

  let contentBlocks = [];
  try {
    contentBlocks = typeof post.content === "object" ? post.content : JSON.parse(post.content);
  } catch {
    contentBlocks = [];
  }

  return (
    <div className="bg-white min-h-screen text-gray-900 -mx-2 w-[calc(100%+1rem)] sm:mx-0 sm:w-full overflow-x-hidden">
      <div className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-4 md:px-4 py-2.5 flex items-center">
          <Link
            href="/dashboard/posts"
            className="inline-flex items-center gap-2 text-[12px] sm:text-sm font-semibold text-gray-600 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" /> Back to list
          </Link>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-4 md:px-4">
          <nav className="flex items-center gap-1.5 py-2 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest font-[Inter] min-w-0">
            <Link href="/dashboard" className="hover:text-primary transition-colors shrink-0">
              Dashboard
            </Link>
            <ChevronRightIcon />
            <Link href="/dashboard/posts" className="hover:text-primary transition-colors shrink-0">
              Posts
            </Link>
            <ChevronRightIcon />
            <span className="text-gray-900 italic min-w-0 flex-1 line-clamp-2 sm:line-clamp-1">{post.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-3 sm:px-4 md:px-4 overflow-x-hidden pb-10 pt-3">
        <main className="flex-1 min-w-0">
          <div className={ARTICLE_COL}>
            <header className="mb-2">
              <h1 className="text-xl md:text-2xl font-bold text-gray-950 leading-snug font-[Playfair_Display] tracking-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-2 text-[11px] text-gray-600 font-[Inter]">
                <img
                  src={reporterAvatar}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover border border-gray-100 shrink-0"
                />
                <span className="font-semibold text-gray-900">{reporterName}</span>
                <span className="text-gray-300 select-none">·</span>
                <time className="text-gray-500">{timeAgo}</time>
                <span className="text-gray-300 select-none">·</span>
                <span className="text-primary font-bold uppercase tracking-wide text-[10px]">{categoryName}</span>
              </div>
              {shareUrl ? (
                <div className="flex justify-end mt-1.5 pt-1.5 border-b border-gray-100">
                  <ShareButtons title={post.title} url={shareUrl} />
                </div>
              ) : null}
            </header>

            {post.featuredImage && (
              <div className="relative w-full h-[200px] sm:h-[280px] md:h-[340px] rounded-xl overflow-hidden shadow-md border border-gray-100 bg-gray-100 my-2">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 56rem"
                  priority
                />
              </div>
            )}

            <article
              id="article-content"
              className="article-content-flow article-body-readable min-w-0 w-full max-w-full pt-2"
            >
              {post.subtitle && (
                <p className="text-sm text-gray-600 leading-relaxed font-[Inter] mb-3 font-medium italic border-l-2 border-primary pl-3">
                  {post.subtitle}
                </p>
              )}
              {!post.subtitle && post.excerpt && (
                <p className="text-sm text-gray-600 leading-relaxed font-[Inter] mb-3 font-medium italic border-l-2 border-primary pl-3">
                  {post.excerpt}
                </p>
              )}

              <div className="article-body-content space-y-3 text-gray-800 leading-[1.65] font-[Inter] text-[13px] md:text-[14px] break-words [overflow-wrap:anywhere] [&_*]:max-w-full [&_a]:break-all [&_pre]:overflow-x-auto">
                {Array.isArray(contentBlocks) ? (
                  contentBlocks.map((block, idx) => {
                    const type = block.type?.toLowerCase();
                    const isUrl =
                      block.content?.startsWith("http") || block.content?.startsWith("uploads") || block.content?.startsWith("/");

                    if (type === "text" && block.content === post.subtitle) return null;

                    if (["image", "img", "photo", "picture"].includes(type) || (isUrl && type !== "text")) {
                      return (
                        <figure key={idx} className="my-2.5">
                          <div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] rounded-lg overflow-hidden border border-gray-100 bg-gray-100 shadow-sm">
                            <Image
                              src={block.content}
                              alt={block.metaInfo || post.title}
                              fill
                              unoptimized
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 56rem"
                            />
                          </div>
                          {block.metaInfo && (
                            <figcaption className="text-center text-[9px] font-medium text-gray-500 mt-1.5 font-[Inter] leading-snug px-1">
                              {String(block.metaInfo).trim()}
                            </figcaption>
                          )}
                        </figure>
                      );
                    }
                    if (type === "pullquote") {
                      return <PullQuote key={idx} text={block.content} attribution={block.metaInfo} />;
                    }
                    if (["video", "youtube", "vimeo"].includes(type)) {
                      return (
                        <div
                          key={idx}
                          className="relative w-full h-[180px] sm:h-[200px] bg-black rounded-lg overflow-hidden my-2.5 shadow-md flex items-center justify-center"
                        >
                          <VideoPlaceholderIcon />
                        </div>
                      );
                    }
                    if (type === "text") {
                      return (
                        <div
                          key={idx}
                          className="prose prose-sm prose-gray max-w-none text-gray-800 article-body-readable break-words [overflow-wrap:anywhere] [&_h3]:text-base [&_h3]:mt-2.5 [&_h3]:mb-1 [&_p]:text-[13px] md:[&_p]:text-[14px] [&_p]:leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: normalizeRichTextHtml(block.content) }}
                        />
                      );
                    }
                    if (typeof block.content === "string" && block.content.trim()) {
                      return (
                        <div
                          key={idx}
                          className="prose prose-sm prose-gray max-w-none"
                          dangerouslySetInnerHTML={{ __html: normalizeRichTextHtml(block.content) }}
                        />
                      );
                    }
                    return null;
                  })
                ) : (
                  <div
                    className="prose prose-sm prose-gray max-w-none text-gray-800 article-body-readable break-words [overflow-wrap:anywhere] [&_p]:text-[13px] md:[&_p]:text-[14px]"
                    dangerouslySetInnerHTML={{
                      __html: normalizeRichTextHtml(typeof post.content === "string" ? post.content : ""),
                    }}
                  />
                )}
              </div>
            </article>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-5 border-t border-gray-100 flex flex-wrap gap-2">
                <div className="w-full text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">Tags</div>
                {post.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 border border-gray-200 text-gray-600 text-[11px] font-semibold px-2.5 py-1 rounded"
                  >
                    {t.tag?.name || "Tag"}
                  </span>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
