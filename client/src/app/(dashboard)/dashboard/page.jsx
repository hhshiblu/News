import { FileText, MousePointerClick, ArrowRight, Activity, TrendingUp, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ViewsChart, StatusPieChart, CategoryBarChart } from "@/components/DashboardCharts";
import TrafficRangeFilter from "@/components/dashboard/TrafficRangeFilter";
import { getMe } from "@/lib/server-auth";
import { getAdminPostsAction } from "@/actions/admin-data.action";

export default async function DashboardPage() {
  const user = await getMe();
  const isAdmin = user?.role === "ADMIN";
  const { total, posts } = await getAdminPostsAction("limit=250");
  const pendingCount = posts.filter((p) => p.status === "PENDING").length;
  const publishedCount = posts.filter((p) => p.status === "PUBLISHED").length;
  const totalClicks = posts.reduce((s, p) => s + (p.viewCount ?? 0), 0);

  const chartData = [...posts]
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, 8)
    .map((p) => ({
      name:
        (p.title || "?").length > 14 ? `${(p.title || "").slice(0, 14)}…` : p.title || "?",
      clicks: p.viewCount ?? 0,
    }));

  const statusData = [
    { name: "Published", value: publishedCount },
    { name: "Pending", value: pendingCount }
  ];

  const catCount = posts.reduce((acc, p) => {
      const cat = p.category?.name || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
  }, {});
  const categoryData = Object.keys(catCount).map(k => ({ name: k, count: catCount[k] }));

  const stats = [
    { label: "Articles", value: total, icon: FileText, color: "text-blue-600", bg: "bg-blue-50", sub: `${publishedCount} live` },
    { label: "Pending", value: pendingCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", sub: "Queue" },
    { label: "Published", value: publishedCount, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", sub: "On site" },
    { label: "Clicks", value: totalClicks.toLocaleString(), icon: MousePointerClick, color: "text-rose-600", bg: "bg-rose-50", sub: "All-time" },
  ];

  const recent = (posts || []).slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Editorial Hub</h1>
          <p className="text-[12px] text-gray-500 font-medium mt-0.5">Overview · posts · engagement</p>
        </div>
        {!isAdmin && (
          <Link
            href="/dashboard/posts/create"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-[11px] font-bold !text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            New post
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div className={`rounded-xl p-2 ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">{stat.sub}</span>
            </div>
            <p className="mt-2.5 text-xl font-black tabular-nums text-gray-900">{stat.value}</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 pb-10 lg:grid-cols-3">
        {user?.role === 'ADMIN' && (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-1">
            <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-rose-600" /> Top stories by clicks
            </h2>
            <ViewsChart data={chartData} valueKey="clicks" />
          </div>
        )}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-1">
          <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" /> Post Status
          </h2>
          <StatusPieChart data={statusData} />
        </div>

        {user?.role !== 'ADMIN' && (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-1">
            <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" /> Posts by Category
            </h2>
            <CategoryBarChart data={categoryData} />
          </div>
        )}

        <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:col-span-1">
          <div className="flex items-center justify-between border-b border-gray-50 bg-gray-50/40 px-4 py-3">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-600">Recent</h2>
            <Link href="/dashboard/posts" className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700">
              All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="max-h-[min(360px,50vh)] flex-1 divide-y divide-gray-50 overflow-y-auto">
            {recent.length === 0 ? (
              <p className="p-6 text-center text-[11px] text-gray-400">No articles</p>
            ) : (
              recent.map((post) => (
                <div key={post.id} className="flex items-start gap-2 px-4 py-2.5 hover:bg-gray-50/80">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/dashboard/posts/${post.id}`}
                      className="line-clamp-2 text-[11px] font-semibold leading-snug text-gray-900 hover:text-primary"
                    >
                      {post.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] text-gray-400">
                      <span>{post.category?.name}</span>
                      <span className="tabular-nums text-rose-600/90">{post.viewCount ?? 0} clicks</span>
                    </div>
                  </div>
                  <TrendingUp className="mt-0.5 h-3 w-3 shrink-0 text-gray-300" />
                </div>
              ))
            )}
          </div>
          <Link
            href="/dashboard/posts/create"
            className="m-3 rounded-xl bg-emerald-50 py-2.5 text-center text-[10px] font-bold uppercase tracking-wide text-emerald-700 hover:bg-emerald-100"
          >
            Write
          </Link>
        </div>

        {user?.role === 'ADMIN' && (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-3">
            <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" /> Posts by Category
            </h2>
            <CategoryBarChart data={categoryData} />
          </div>
        )}
      </div>
    </div>
  );
}
