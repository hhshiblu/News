"use client";

import { useState, useEffect } from "react";
import { CircleAlert, CircleCheckBig, Clock, ExternalLink, MessageSquare, Filter, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function IssuesPage() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        fetch("http://localhost:5000/api/v1/admin/issues", { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.success) setIssues(data.data);
                setLoading(false);
            })
            .catch(() => {
                toast.error("Failed to load issues");
                setLoading(false);
            });
    }, []);

    const handleResolve = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/v1/admin/issues/${id}/resolve`, {
                method: 'PATCH',
                credentials: 'include'
            });
            if (res.ok) {
                setIssues(issues.map(i => i.id === id ? { ...i, resolved: true } : i));
                toast.success("Issue resolved!");
            }
        } catch (e) {
            toast.error("Failed to resolve issue");
        }
    };

    const filteredIssues = issues.filter(i => {
        if (filter === "RESOLVED") return i.resolved;
        if (filter === "OPEN") return !i.resolved;
        return true;
    });

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Clock className="animate-spin text-emerald-500" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <CircleAlert className="w-8 h-8 text-rose-500" /> Editorial Moderation
                    </h1>
                    <p className="text-gray-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Quality Control & Feedback Loop</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                    {["ALL", "OPEN", "RESOLVED"].map((f) => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${filter === f ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredIssues.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-20 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-4 bg-emerald-50 text-emerald-500 rounded-full">
                            <CircleCheckBig className="w-10 h-10" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Clear Skies!</h3>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No pending editorial issues found.</p>
                        </div>
                    </div>
                ) : filteredIssues.map((issue) => (
                    <div key={issue.id} className={`group bg-white rounded-3xl border transition-all p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 ${issue.resolved ? 'border-gray-100 opacity-60' : 'border-rose-100 bg-rose-50/10 shadow-sm hover:shadow-xl hover:border-rose-200'}`}>
                        <div className="flex items-start gap-4 flex-1">
                            <div className={`p-3 rounded-2xl shrink-0 ${issue.resolved ? 'bg-gray-100 text-gray-400' : 'bg-rose-100 text-rose-600'}`}>
                                {issue.resolved ? <CircleCheckBig size={24} /> : <ShieldAlert size={24} />}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h4 className={`text-sm font-black uppercase tracking-tight ${issue.resolved ? 'text-gray-500' : 'text-gray-900'}`}>
                                        Post: {issue.post?.title}
                                    </h4>
                                    <Link href={`/dashboard/posts/${issue.post?.id}`} className="text-gray-400 hover:text-emerald-600 transition-colors">
                                        <ExternalLink size={14} />
                                    </Link>
                                </div>
                                <p className={`text-sm font-medium ${issue.resolved ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {issue.description}
                                </p>
                                <div className="flex items-center gap-6 pt-2">
                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <MessageSquare size={12} /> Admin: {issue.admin?.name}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <Clock size={12} /> {new Date(issue.createdAt).toLocaleDateString()}
                                    </div>
                                    {!issue.resolved && (
                                        <div className="px-2 py-0.5 rounded bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest">
                                            {issue.severity}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {!issue.resolved && (
                            <button 
                                onClick={() => handleResolve(issue.id)}
                                className="shrink-0 px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all uppercase tracking-widest active:scale-95 cursor-pointer"
                            >
                                Mark Resolved
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
