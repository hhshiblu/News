import { FileText, ShieldAlert, ArrowRight, Activity, TrendingUp, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ViewsChart } from "@/components/DashboardCharts";
import { getMe } from "@/lib/server-auth";
import { getAdminPostsAction } from "@/actions/admin-data.action";

export default async function DashboardPage() {
  const user = await getMe();
  const isAdmin = user?.role === 'ADMIN';
  const { total, posts } = await getAdminPostsAction("limit=5");
  const pendingCount = posts.filter(p => p.status === 'PENDING').length;

  const stats = [
    { label: "Total Articles", value: total, icon: FileText, color: "text-blue-600", bg: "bg-blue-50", trend: "+12.5%" },
    { label: "Pending Review", value: pendingCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", trend: "Action Required" },
    { label: "Published Items", value: posts.filter(p => p.status === 'PUBLISHED').length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", trend: "Live on site" },
    { label: "Total Reach", value: "14.2K", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50", trend: "+18% views" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Editorial Hub</h1>
                <p className="text-gray-500 font-medium mt-1">Real-time performance metrics and content lifecycle overview.</p>
            </div>
            {!isAdmin && (
                <Link 
                    href="/dashboard/posts/create" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-widest"
                >
                    Create New Post
                </Link>
            )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all group">
                    <div className="flex items-center justify-between">
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${stat.bg} ${stat.color} uppercase tracking-wider`}>
                            {stat.trend}
                        </span>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{stat.label}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* Analytics & Recent Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
            
            {/* Main Graph Area */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20">
                            <Activity className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 tracking-tight">Traffic Performance</h2>
                    </div>
                    <select className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold text-gray-500 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                </div>
                <ViewsChart />
            </div>

            {/* Recent Activity List */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Recent Updates</h2>
                    <Link href="/dashboard/posts" className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest flex items-center gap-1 group">
                        View All <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
                
                <div className="flex-1 divide-y divide-gray-50">
                    {posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 space-y-3">
                             <ShieldAlert className="w-10 h-10 opacity-20" />
                             <p className="text-xs font-bold uppercase tracking-widest">No articles found</p>
                        </div>
                    ) : posts.map((post) => (
                        <div key={post.id} className="p-5 hover:bg-emerald-50/30 transition-colors flex items-center gap-4 group">
                             <div className="flex-1 min-w-0">
                                 <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">{post.title}</h4>
                                 <div className="flex items-center gap-3 mt-1">
                                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{post.category?.name || "Global"}</span>
                                     <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</span>
                                 </div>
                             </div>
                             {post.status === 'PUBLISHED' ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30" title="Published" />
                             ) : (
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" title="Pending" />
                             )}
                        </div>
                    ))}
                </div>

                <Link href="/admin/posts/create" className="m-4 p-4 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-[0.2em] text-center hover:bg-emerald-100 transition-all">
                    Start Writing
                </Link>
            </div>
        </div>
    </div>
  );
}
