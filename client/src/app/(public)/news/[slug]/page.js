import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import ReadingProgressBar from "@/components/article/ReadingProgressBar";
import ShareButtons from "@/components/article/ShareButtons";
import PullQuote from "@/components/article/PullQuote";
import ArticleSidebar from "@/components/article/ArticleSidebar";
import RelatedArticles from "@/components/article/RelatedArticles";
import AdSlot from "@/components/ads/AdSlot";
import { getPostDetail, getNewsFeed } from "@/actions/public";
import { reporterSlugFromName } from "@/lib/reporterSlug";
import NewsDetailLoading from "./loading";
import RecordArticleClick from "@/components/article/RecordArticleClick";
import { getImageUrl, getFrontendUrl } from "@/lib/apiBaseUrl";

function ChevronRightIcon({ className = "w-3 h-3 text-gray-200" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-3 h-3" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
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
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const normalizePost = (post) => ({
  ...post,
  image: getImageUrl(post.featuredImage) || "/placeholder.jpg",
  reporter: post.reporter?.name || "Staff Reporter",
  category: post.category?.name || "News",
  categorySlug: post.category?.slug,
  timestamp: formatTimeAgo(post.publishedAt),
});

const normalizeRichTextHtml = (html) => {
  if (typeof html !== "string") return html;
  return html
    .replace(/&nbsp;|&#160;|\u00A0/g, " ")
    .replace(/white-space\s*:\s*nowrap;?/gi, "");
};

/** Main story column — wide hero + body share one width */
const ARTICLE_COL = "w-full max-w-[min(100%,52rem)] xl:max-w-[56rem]";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const res = await getPostDetail(slug);
  const article = res?.success ? res.data : null;
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.subtitle || article.excerpt,
  };
}

async function ArticlePageContent({ params }) {
  const { slug } = await params;
  const res = await getPostDetail(slug);
  let article = res?.success ? res.data : null;
  if (!article) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-32 text-center h-[60vh] flex flex-col justify-center">
        <h1 className="text-4xl font-black font-[Playfair_Display] text-gray-900 mb-4 tracking-tight">
          Article Not Found
        </h1>
        <p className="text-gray-500 font-medium mb-8 uppercase tracking-widest text-[10px]">
          The requested editorial context was destroyed or moved
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-primary text-white font-black text-xs rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all uppercase tracking-widest inline-block"
        >
          Return to Hub
        </Link>
      </div>
    );
  }

  const rawCategory = article.category;
  const parentCategorySlug =
    rawCategory?.parent?.slug || rawCategory?.slug || "general";
  const parentCategoryName =
    rawCategory?.parent?.name || rawCategory?.name || "General";

  const reporterId = article.reporter?.id;
  const [categoryNewsRes, breakingA, breakingB, latestRes, reporterFeedRes] =
    await Promise.all([
      getNewsFeed({ parentCategorySlug, limit: 20 }),
      getNewsFeed({ tagSlug: "breaking-news", limit: 12 }),
      getNewsFeed({ tagSlug: "breaking", limit: 12 }),
      getNewsFeed({ limit: 10 }),
      reporterId
        ? getNewsFeed({ reporterId, limit: 12 })
        : Promise.resolve({ posts: [] }),
    ]);

  const categoryNews = (categoryNewsRes?.posts || [])
    .filter((p) => p.slug !== slug)
    .map(normalizePost);
  const latestCategoryTopTen = categoryNews.slice(0, 10);
  const moreCategoryCards = categoryNews.slice(10, 13);

  const seenBreaking = new Set();
  const mergedBreaking = [];
  for (const p of [...(breakingA?.posts || []), ...(breakingB?.posts || [])]) {
    if (!p?.id || seenBreaking.has(p.id)) continue;
    seenBreaking.add(p.id);
    mergedBreaking.push(p);
  }

  let breakingNews = mergedBreaking
    .filter((p) => p.slug !== slug)
    .slice(0, 5)
    .map(normalizePost);

  if (breakingNews.length === 0) {
    breakingNews = (latestRes?.posts || [])
      .filter((p) => p.slug !== slug)
      .slice(0, 5)
      .map(normalizePost);
  }

  const reporterBylinePosts = (reporterFeedRes?.posts || [])
    .filter((p) => p.slug !== slug)
    .slice(0, 7)
    .map((p) => ({ id: p.id, slug: p.slug, title: p.title, featuredImage: p.featuredImage, image: p.featuredImage || "/placeholder.jpg" }));

  article = {
    ...article,
    reporterData: article.reporter || {},
    category: rawCategory?.name || "General",
    category_slug: rawCategory?.slug || "general",
    timeAgo: formatTimeAgo(article.publishedAt),
    tags: article.tags?.map((t) => t.tag?.name) || [],
  };

  const reporterName = article.reporterData?.name || "Staff";
  const reporterAvatar = getImageUrl(article.reporterData?.avatar || article.reporterData?.image);
  const frontendUrl = getFrontendUrl();

  return (
    <>
      <RecordArticleClick slug={slug} />
      <ReadingProgressBar />

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4">
          <nav className="flex items-center gap-1.5 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest font-[Inter] min-w-0">
            <Link href="/" className="hover:text-primary transition-colors shrink-0">
              HUB
            </Link>
            <ChevronRightIcon />
            <Link
              href={`/${article.category_slug}`}
              className="hover:text-primary transition-colors shrink-0"
            >
              {article.category}
            </Link>
            <ChevronRightIcon />
            <span className="text-gray-900 italic min-w-0 flex-1 line-clamp-2 sm:line-clamp-1">
              {article.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 overflow-x-hidden">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 pb-10 pt-3">
          <main className="flex-1 min-w-0">
            <div className={`${ARTICLE_COL}`}>
              <header className="mb-2">
                <h1 className="text-xl md:text-2xl font-bold text-gray-950 leading-snug font-[Playfair_Display] tracking-tight">
                  {article.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-2 text-[11px] text-gray-600 font-[Inter]">
                  <img
                    src={reporterAvatar}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover border border-gray-100 shrink-0"
                  />
                  <span className="font-semibold text-gray-900">{reporterName}</span>
                  <span className="text-gray-300 select-none">·</span>
                  <time className="text-gray-500">{article.timeAgo}</time>
                  <span className="text-gray-300 select-none">·</span>
                  <Link
                    href={`/${article.category_slug}`}
                    className="text-primary font-bold uppercase tracking-wide text-[10px]"
                  >
                    {article.category}
                  </Link>
                </div>
                <div className="flex justify-end mt-1.5 pt-1.5 border-b border-gray-100">
                  <ShareButtons
                    title={article.title}
                    url={`${frontendUrl}/news/${slug}`}
                  />
                </div>
              </header>

              {article.featuredImage && (
                <div>
                  <div className="relative w-full h-[240px] sm:h-[300px] md:h-[340px] lg:h-[380px] rounded-xl overflow-hidden shadow-md border border-gray-100 bg-gray-100">
                    <Image
                      src={getImageUrl(article.featuredImage)}
                      alt={article.title}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 56rem"
                      priority
                    />
                  </div>
                </div>
              )}

              <div className="my-2">
                <AdSlot slotKey="article_in_feed" hideLabel />
              </div>

              <div className="flex flex-row gap-2 lg:gap-3 mt-2">
                <div className="hidden xl:block shrink-0">
                  <div className="sticky top-24">
                    <ShareButtons
                      title={article.title}
                      url={`${frontendUrl}/news/${slug}`}
                      variant="sticky"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <article
                    id="article-content"
                    className="article-content-flow article-body-readable min-w-0 w-full max-w-full"
                  >
                    {article.subtitle && (
                      <p className="text-sm text-gray-600 leading-relaxed font-[Inter] mb-3 font-medium italic border-l-2 border-primary pl-3">
                        {article.subtitle}
                      </p>
                    )}

                    <div className="article-body-content space-y-3 text-gray-800 leading-[1.65] font-[Inter] text-[13px] md:text-[14px] wrap-anywhere **:max-w-full [&_a]:break-all [&_pre]:overflow-x-auto">
                      {Array.isArray(article.content) ? (
                        article.content.map((block, idx) => {
                          const type = block.type?.toLowerCase();
                          const isUrl =
                            block.content?.startsWith("http") ||
                            block.content?.startsWith("uploads");

                          if (
                            type === "text" &&
                            block.content === article.subtitle
                          )
                            return null;

                          if (
                            ["image", "img", "photo", "picture"].includes(type) ||
                            isUrl
                          ) {
                            return (
                              <figure key={idx} className="my-2.5">
                                <div className="relative w-full h-[220px] sm:h-[248px] md:h-[272px] rounded-lg overflow-hidden border border-gray-100 bg-gray-100 shadow-sm">
                                  <Image
                                    src={getImageUrl(block.content)}
                                    alt={block.metaInfo || article.title}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 56rem"
                                  />
                                </div>
                                {block.metaInfo && (
                                  <figcaption className="text-center text-[9px] font-medium text-gray-500 mt-1.5 font-[Inter] leading-snug px-1">
                                    {block.metaInfo.trim()}
                                  </figcaption>
                                )}
                              </figure>
                            );
                          }
                          if (type === "pullquote") {
                            return (
                              <PullQuote
                                key={idx}
                                text={block.content}
                                attribution={block.metaInfo}
                              />
                            );
                          }
                          if (
                            ["video", "youtube", "vimeo"].includes(type)
                          ) {
                            return (
                              <div
                                key={idx}
                                className="relative w-full h-[200px] sm:h-[220px] bg-black rounded-lg overflow-hidden my-2.5 shadow-md flex items-center justify-center"
                              >
                                <VideoPlaceholderIcon />
                              </div>
                            );
                          }
                          if (type === "text") {
                            return (
                              <div
                                key={idx}
                                className="prose prose-sm prose-gray max-w-none text-gray-800 article-body-readable wrap-anywhere [&_h3]:text-base [&_h3]:mt-2.5 [&_h3]:mb-1 [&_p]:text-[13px] md:[&_p]:text-[14px] [&_p]:leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: normalizeRichTextHtml(block.content),
                                }}
                              />
                            );
                          }

                          return null;
                        })
                      ) : (
                        <div
                          className="prose prose-sm prose-gray max-w-none text-gray-800 article-body-readable wrap-anywhere [&_p]:text-[13px] md:[&_p]:text-[14px]"
                          dangerouslySetInnerHTML={{
                            __html: normalizeRichTextHtml(article.content),
                          }}
                        />
                      )}
                    </div>
                  </article>

                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row gap-3 items-start">
                      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-primary/20 shadow-md">
                        <img
                          src={reporterAvatar}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">
                          Editorial Voice
                        </div>
                        <h3 className="text-base font-bold text-gray-950 font-[Playfair_Display] mb-1">
                          {reporterName}
                        </h3>
                        <p className="text-gray-600 text-[13px] font-[Inter] leading-relaxed mb-3">
                          {article.reporterData?.bio}
                        </p>
                        <Link
                          href={`/reporter/${reporterSlugFromName(reporterName)}`}
                          className="text-[10px] font-black uppercase tracking-widest text-gray-950 border-b-2 border-primary pb-0.5 inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                        >
                          Full portfolio <ArrowRightIcon className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {latestCategoryTopTen.length > 0 && (
                    <div className="mt-8 mb-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="h-0.5 w-6 bg-primary" />
                          <h2 className="text-sm md:text-base font-bold text-gray-950 font-[Playfair_Display]">
                            Latest in {parentCategoryName}
                          </h2>
                        </div>
                      </div>
                      <RelatedArticles
                        articles={latestCategoryTopTen}
                        viewAllHref={`/${parentCategorySlug}`}
                        viewAllLabel={`View all in ${parentCategoryName}`}
                      />
                    </div>
                  )}



                  <div className="mt-6 pt-3 border-t border-gray-100">
                    <ShareButtons
                      title={article.title}
                      url={`${frontendUrl}/news/${slug}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>

          <aside className="w-full lg:min-w-[280px] lg:w-[300px] xl:min-w-[300px] xl:w-[320px] shrink-0">
            <div className="sticky top-24">
              <ArticleSidebar
                breakingNews={breakingNews}
                reporterPosts={reporterBylinePosts}
                reporterName={reporterName}
                reporterHref={`/reporter/${reporterSlugFromName(reporterName)}`}
              />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

export default function ArticlePage({ params }) {
  return (
    <Suspense fallback={<NewsDetailLoading />}>
      <ArticlePageContent params={params} />
    </Suspense>
  );
}
