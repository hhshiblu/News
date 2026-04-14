import { CircleCheckBig, CircleX, Image as ImageIcon, Search, Filter, ArrowRight, UserCircle2, Clock } from "lucide-react";
import Link from "next/link";
import PostActionButtons from "../../../../components/admin/PostActionButtons";
import { cookies } from "next/headers";

async function getMe() {
    try {
        const cookieStore = await cookies();
        const res = await fetch("http://localhost:5000/api/v1/admin/auth/me", {
            headers: { Cookie: cookieStore.toString() },
            cache: 'no-store'
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch (e) {
        return null;
    }
}

export default async function AllNewsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const statusFilter = resolvedParams?.status || 'all';
  const user = await getMe();

  const queryParams = new URLSearchParams();
  if(statusFilter !== 'all') {
      queryParams.append('status', statusFilter.toUpperCase());
  }

  let posts = [];
  try {
      const cookieStore = await cookies();
      const res = await fetch(`http://localhost:5000/api/v1/admin/posts?${queryParams.toString()}`, { 
          headers: { Cookie: cookieStore.toString() },
          cache: "no-store" 
      });
      if(res.ok) {
          const data = await res.json();
          posts = data.posts || [];
      }
  } catch(e) {
      console.log("Failed reaching Node.js REST endpoints via Server Components");
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Editorial Archives</h1>
          <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-widest">Article Lifecycle & Moderation Hub</p>
        </div>
        {user?.role !== 'ADMIN' && (
          <Link href="/dashboard/posts/create" className="px-6 py-3 bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all uppercase tracking-widest flex items-center gap-2 active:scale-95">
            + Draft New Story
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-1.5 inline-flex rounded-2xl border border-gray-100 shadow-sm">
        {['all', 'PUBLISHED', 'PENDING', 'BLOCKED'].map((status) => (
          <Link 
            key={status}
            href={`/dashboard/posts?status=${status}`} 
            className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${statusFilter.toUpperCase() === status.toUpperCase() ? 'bg-gray-900 text-white shadow-lg shadow-black/20' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
          >
            {status === 'all' ? 'Entire Library' : status}
          </Link>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-gray-600 border-collapse">
            <thead className="bg-gray-50/50 text-[11px] uppercase font-black text-gray-400 tracking-[0.1em]">
              <tr>
                <th className="px-8 py-5 border-b border-gray-50">Visual Asset</th>
                <th className="px-6 py-5 border-b border-gray-50">Article Identity</th>
                <th className="px-6 py-5 border-b border-gray-50">Curator</th>
                <th className="px-6 py-5 border-b border-gray-50">Taxonomy</th>
                <th className="px-6 py-5 border-b border-gray-50 text-center">Status</th>
                <th className="px-8 py-5 border-b border-gray-50 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map(post => {
                 let loadedImage = post.featuredImage;
                 if(!loadedImage && post.content) {
                    try { 
                        const contentArr = typeof post.content === 'object' ? post.content : JSON.parse(post.content);
                        const firstImage = contentArr.find(c => c.type === 'image');
                        if(firstImage) loadedImage = firstImage.content;
                    } catch(e) {}
                 }

                 return (
                 <tr key={post.id} className="hover:bg-gray-50/30 transition-all group">
                  <td className="px-8 py-4">
                     {loadedImage ? (
                         <div className="w-14 h-14 rounded-2xl border border-gray-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                             <img src={loadedImage} alt="Cover" className="w-full h-full object-cover" />
                         </div>
                     ) : (
                         <div className="w-14 h-14 rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300">
                             <ImageIcon className="w-5 h-5" />
                         </div>
                     )}
                  </td>
                  <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 max-w-md truncate">
                          <span className="text-[13px] font-black text-gray-900 group-hover:text-emerald-700 transition-colors">{post.title}</span>
                          <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            <Clock size={12}/> {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                      </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                         <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-black border border-emerald-100 uppercase">{post.author?.name?.charAt(0)}</div>
                         <span className="text-[13px] font-bold text-gray-700">{post.author?.name || "Global Editor"}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">{post.category?.name || "Uncategorized"}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {post.status === 'PUBLISHED' ? (
                      <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                        <CircleCheckBig color="#10b981" size={12} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" /> {post.status}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <PostActionButtons post={post} userRole={user?.role} />
                  </td>
                </tr>
              )})}
              {posts.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-gray-400 text-sm font-bold uppercase tracking-widest">
                    No editorial records match the query.
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
