import { CircleCheckBig, Image as ImageIcon, Clock, FileText } from "lucide-react";
import Link from "next/link";
import PostActionButtons from "../../../../components/admin/PostActionButtons";
import { getAdminPostsAction } from "@/actions/admin-data.action";
import { getMe } from "@/lib/server-auth";
import PostsStatusFilter from "@/components/dashboard/posts/PostsStatusFilter";

export default async function AllNewsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const statusFilter = resolvedParams?.status || "all";
  const authorIdFilter = resolvedParams?.authorId;
  const user = await getMe();

  const queryParams = new URLSearchParams();
  if (statusFilter !== "all") {
    queryParams.append("status", statusFilter.toUpperCase());
  }
  if(authorIdFilter) {
      queryParams.append('authorId', authorIdFilter);
  }

  const postsRes = await getAdminPostsAction(queryParams.toString());
  const posts = postsRes.posts || [];
  const count = posts.length;

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
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-[12px] rounded-xl shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors uppercase tracking-wide shrink-0"
          >
            + New article
          </Link>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <PostsStatusFilter statusFilter={statusFilter} />
        <div className="overflow-x-auto custom-scrollbar">
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
      </div>
    </div>
  );
}
