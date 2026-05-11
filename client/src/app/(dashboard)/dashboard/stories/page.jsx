import { Image as ImageIcon, Clock, MousePointerClick, SquarePen } from "lucide-react";
import Link from "next/link";
import StoryActionButtons from "@/components/admin/StoryActionButtons";
import { getAdminStoriesAction } from "@/actions/admin-data.action";

const PAGE_SIZE = 10;

export default async function StoriesAdminPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const pageNum = Math.max(1, parseInt(String(resolvedParams?.page ?? "1"), 10) || 1);
  const statusFilter = resolvedParams?.status || "all";

  const queryParams = new URLSearchParams();
  if (statusFilter !== "all") queryParams.append("status", statusFilter.toUpperCase());
  queryParams.append("page", String(pageNum));
  queryParams.append("limit", String(PAGE_SIZE));

  const storiesRes = await getAdminStoriesAction(queryParams.toString());
  const stories = storiesRes.stories || [];
  const count = Number(storiesRes.total || 0);
  const totalPages = Math.max(1, Number(storiesRes.totalPages || 1));
  const safePage = Math.min(pageNum, totalPages);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 px-4 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <SquarePen className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Stories Management</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">Manage and publish narrative stories across the platform.</p>
        </div>
        <Link
          href="/dashboard/stories/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95"
        >
          + Create Story
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-gray-600 border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">
              <tr>
                <th className="px-6 py-4">Visual</th>
                <th className="px-6 py-4">Story Details</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stories.map((story) => (
                <tr key={story.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    {story.thumbnailImage ? (
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                        <img src={story.thumbnailImage} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">{story.title}</p>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} /> {new Date(story.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${story.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${story.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-orange-500 animate-pulse'}`} />
                      {story.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <StoryActionButtons story={story} />
                  </td>
                </tr>
              ))}
              {stories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="max-w-xs mx-auto space-y-2">
                      <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto text-gray-200">
                        <SquarePen size={32} />
                      </div>
                      <p className="text-gray-900 font-bold">No stories found</p>
                      <p className="text-xs text-gray-400">Get started by creating your first story narrative.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Page {safePage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Link
                href={`/dashboard/stories?page=${safePage - 1}`}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all ${safePage === 1 ? 'pointer-events-none opacity-50' : ''}`}
              >
                Prev
              </Link>
              <Link
                href={`/dashboard/stories?page=${safePage + 1}`}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all ${safePage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
