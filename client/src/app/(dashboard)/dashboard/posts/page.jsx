import { CircleCheckBig, Image as ImageIcon, Clock, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import PostActionButtons from "../../../../components/admin/PostActionButtons";
import { getAdminPostsAction } from "@/actions/admin-data.action";
import { getMe } from "@/lib/server-auth";
import PostsStatusFilter from "@/components/dashboard/posts/PostsStatusFilter";

const PAGE_SIZE = 10;

function postsListHref(resolvedParams, pageNum) {
  const statusFilter = resolvedParams?.status || "all";
  const authorIdFilter = resolvedParams?.authorId;
  const q = new URLSearchParams();
  if (statusFilter !== "all") q.set("status", String(statusFilter).toUpperCase());
  if (authorIdFilter) q.set("authorId", String(authorIdFilter));
  if (pageNum > 1) q.set("page", String(pageNum));
  const s = q.toString();
  return s ? `/dashboard/posts?${s}` : "/dashboard/posts";
}

export default async function AllNewsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const statusFilter = resolvedParams?.status || "all";
  const authorIdFilter = resolvedParams?.authorId;
  const pageNum = Math.max(1, parseInt(String(resolvedParams?.page ?? "1"), 10) || 1);
  const user = await getMe();

  const queryParams = new URLSearchParams();
  if (statusFilter !== "all") {
    queryParams.append("status", statusFilter.toUpperCase());
  }
  if(authorIdFilter) {
      queryParams.append('authorId', authorIdFilter);
  }

  const postsRes = await getAdminPostsAction(queryParams.toString());
  const allPosts = postsRes.posts || [];
  const count = allPosts.length;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const safePage = Math.min(pageNum, totalPages);
  const posts = allPosts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-5 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 gap-y-1">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary shrink-0" />
              News articles
            </h1>
            <span
              className="text-[12px] font-semibold tabular-nums text-gray-500"
              title={`${count} article${count === 1 ? "" : "s"} in this list`}
            >
              ({count})
            </span>
          </div>
          <p className="text-[13px] text-gray-500 font-medium mt-1">
            Filter by status, preview, edit, or moderate stories.
          </p>
        </div>
        {user?.role !== "ADMIN" && (
          <Link
            href="/dashboard/posts/create"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[12px] font-bold uppercase tracking-wide !text-white shadow-md shadow-primary/20 transition-colors hover:bg-primary-dark"
          >
            + New article
          </Link>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <PostsStatusFilter statusFilter={statusFilter} />
        <div className="overflow-x-auto custom-scrollbar rounded-b-xl">
          <table className="w-full text-left text-sm text-gray-600 border-collapse min-w-[640px]">
            <thead className="bg-[#fcfdfd] border-b border-gray-200 text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
              <tr>
                <th className="px-3 sm:px-4 py-3">Visual</th>
                <th className="px-3 sm:px-4 py-3">Article</th>
                <th className="px-3 sm:px-4 py-3">Author</th>
                <th className="px-3 sm:px-4 py-3">Category</th>
                <th className="px-3 sm:px-4 py-3 text-center">Status</th>
                <th className="px-3 sm:px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => {
                let loadedImage = post.featuredImage;
                if (!loadedImage && post.content) {
                  try {
                    const contentArr = typeof post.content === "object" ? post.content : JSON.parse(post.content);
                    const firstImage = contentArr.find((c) => c.type === "image");
                    if (firstImage) loadedImage = firstImage.content;
                  } catch (_) {}
                }

                return (
                  <tr key={post.id} className="hover:bg-gray-50/70 transition-colors group">
                    <td className="px-3 sm:px-4 py-2.5">
                      {loadedImage ? (
                        <div className="w-14 h-14 rounded-2xl border border-gray-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                          <img src={loadedImage} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-3 sm:px-4 py-2.5">
                      <div className="flex flex-col gap-1 max-w-md truncate">
                        <span className="text-[13px] font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {post.title}
                        </span>
                        <div className="flex items-center gap-3 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                          <Clock size={12} /> {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-bold border border-emerald-100 uppercase">
                          {post.author?.name?.charAt(0)}
                        </div>
                        <span className="text-[13px] font-semibold text-gray-700">{post.author?.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                        {post.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 text-center">
                      {post.status === "PUBLISHED" ? (
                        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                          <CircleCheckBig color="#059669" size={12} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100">
                          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" /> {post.status}
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 text-right">
                      <PostActionButtons post={post} userRole={user?.role} />
                    </td>
                  </tr>
                );
              })}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-gray-400 text-sm font-semibold">
                    No articles match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {count > PAGE_SIZE && (
          <div className="flex flex-col gap-2 border-t border-gray-200 bg-gray-50/90 px-3 py-3 text-[12px] text-gray-600 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <span className="tabular-nums">
              Showing <strong className="text-gray-900">{(safePage - 1) * PAGE_SIZE + 1}</strong>–
              <strong className="text-gray-900">{Math.min(safePage * PAGE_SIZE, count)}</strong> of{" "}
              <strong className="text-gray-900">{count}</strong>
            </span>
            <div className="flex items-center gap-2">
              <Link
                href={postsListHref(resolvedParams, safePage - 1)}
                className={`inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-800 hover:bg-gray-50 ${safePage <= 1 ? "pointer-events-none opacity-40" : ""}`}
                aria-disabled={safePage <= 1}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </Link>
              <span className="px-1 text-[11px] font-semibold tabular-nums text-gray-500">
                {safePage} / {totalPages}
              </span>
              <Link
                href={postsListHref(resolvedParams, safePage + 1)}
                className={`inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-800 hover:bg-gray-50 ${safePage >= totalPages ? "pointer-events-none opacity-40" : ""}`}
                aria-disabled={safePage >= totalPages}
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
