"use client";

import { Eye, Pencil, Trash2, Ban, Check, TriangleAlert, X, Tag, CircleAlert } from "lucide-react";
import { toast } from "sonner";
import { deletePostAction, updatePostStatusAction } from "../../actions/post.action";
import { createIssueAction } from "../../actions/issue.action";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function PostActionButtons({ post, userRole = 'AUTHOR' }) {
  const isAdmin = userRole === 'ADMIN';
  const [currentStatus, setCurrentStatus] = useState(post.status);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showIssueListModal, setShowIssueListModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [tagSearch, setTagSearch] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [savingTags, setSavingTags] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");
  const [issueSeverity, setIssueSeverity] = useState("MEDIUM");
  const [postIssues, setPostIssues] = useState([]);
  const [issueListLoading, setIssueListLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  useEffect(() => {
    if (!showTagsModal) return;
    // Init selection from post payload
    const init = (post?.tags || [])
      .map((t) => t?.tag?.id)
      .filter(Boolean);
    setSelectedTagIds(Array.from(new Set(init)));

    fetch(`${API_BASE}/admin/tags`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d?.success) setAllTags(d.data || []);
        else setAllTags([]);
      })
      .catch(() => setAllTags([]));
  }, [showTagsModal, post?.id]);

  const filteredTags = useMemo(() => {
    const q = tagSearch.trim().toLowerCase();
    if (!q) return allTags;
    return allTags.filter((t) => (t.name || "").toLowerCase().includes(q) || (t.slug || "").toLowerCase().includes(q));
  }, [allTags, tagSearch]);

  const selectedTags = useMemo(() => {
    const set = new Set(selectedTagIds);
    return allTags.filter((t) => set.has(t.id));
  }, [allTags, selectedTagIds]);

  const toggleTag = (id) => {
    setSelectedTagIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const saveTags = async () => {
    try {
      setSavingTags(true);
      const res = await fetch(`${API_BASE}/admin/posts/${post.id}/tags`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagIds: selectedTagIds }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) throw new Error(data?.message || "Tag update failed");
      toast.success("Tags updated");
      setShowTagsModal(false);
    } catch (e) {
      toast.error(e.message || "Could not update tags");
    } finally {
      setSavingTags(false);
    }
  };

  const handleToggleStatus = async () => {
    const initialStatus = currentStatus;
    const targetStatus = currentStatus === 'PUBLISHED' ? 'PENDING' : 'PUBLISHED';
    setCurrentStatus(targetStatus);
    
    const res = await updatePostStatusAction(post.id, targetStatus);
    if (!res.success) {
      setCurrentStatus(initialStatus);
      toast.error(res.message || "Failed changing status.");
    } else {
      toast.success(`Post safely changed to ${targetStatus}.`);
    }
  };

  const handleCreateIssue = async (e) => {
      e.preventDefault();
      if(!issueDescription) return toast.error("Please describe the issue.");
      
      const res = await createIssueAction(post.id, issueDescription, issueSeverity);
      if(res.success) {
          toast.success("Editorial issue registered and sent to author!");
          setShowIssueModal(false);
          setIssueDescription("");
      } else {
          toast.error(res.message);
      }
  };

  const openIssueList = async () => {
    setShowIssueListModal(true);
    setIssueListLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/issues`, { credentials: "include" });
      const data = await res.json();
      const all = Array.isArray(data?.data) ? data.data : [];
      const filtered = all.filter((issue) => {
        const issuePost = issue?.post || {};
        if (issuePost?.id && issuePost.id === post.id) return true;
        if (issuePost?.slug && post.slug && issuePost.slug === post.slug) return true;
        return issuePost?.title && post.title && issuePost.title === post.title;
      });
      setPostIssues(filtered);
    } catch (_) {
      toast.error("Failed to load issue history");
      setPostIssues([]);
    } finally {
      setIssueListLoading(false);
    }
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    setShowDeleteModal(false);
    const res = await deletePostAction(post.id);
    if (res.success) {
      toast.success("Article has been successfully wiped from database context!");
    } else {
      setIsDeleting(false);
      toast.error(res.message);
    }
  };

  if (isDeleting) return <span className="text-[10px] text-red-500 font-semibold animate-pulse tracking-wide uppercase px-4">Purging...</span>;

  return (
    <>
      <div className="flex flex-nowrap items-center justify-end gap-0.5 sm:gap-1 overflow-x-auto max-w-[min(100vw,28rem)] sm:max-w-none ml-auto py-0.5 [-webkit-overflow-scrolling:touch]">
        {isAdmin && (
            <>
                {currentStatus !== 'PUBLISHED' ? (
                <button type="button" onClick={handleToggleStatus} className="shrink-0 p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer" title="Approve & Publish">
                    <Check className="w-4 h-4" />
                </button>
                ) : (
                <button type="button" onClick={handleToggleStatus} className="shrink-0 p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all cursor-pointer" title="Block / Suspend Post">
                    <Ban className="w-4 h-4" />
                </button>
                )}
                
                <button type="button" onClick={() => setShowIssueModal(true)} className="shrink-0 p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer" title="Report Editorial Issue">
                    <TriangleAlert className="w-4 h-4" />
                </button>
                <button type="button" onClick={openIssueList} className="shrink-0 p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all cursor-pointer" title="View Article Issues">
                    <CircleAlert className="w-4 h-4" />
                </button>
            </>
        )}
        
        <Link href={`/dashboard/posts/${post.id}`} className="shrink-0 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer" title="View Article Detail">
          <Eye className="w-4 h-4" />
        </Link>
        
        <Link href={`/dashboard/posts/edit/${post.id}`} className="shrink-0 p-2 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer inline-flex" title="Edit Article Properties">
          <Pencil className="w-4 h-4" />
        </Link>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setShowTagsModal(true)}
            className="shrink-0 p-2 text-gray-400 hover:text-violet-700 hover:bg-violet-50 rounded-xl transition-all cursor-pointer"
            title="Update tags (add/remove)"
          >
            <Tag className="w-4 h-4" />
          </button>
        )}
        
        {isAdmin && (
            <button type="button" onClick={() => setShowDeleteModal(true)} className="shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer" title="Delete Database Article">
                <Trash2 className="w-4 h-4" />
            </button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001d1a]/60 backdrop-blur-md px-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center space-y-4">
               <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-sm"><Trash2 className="w-8 h-8" /></div>
               <h3 className="text-xl font-black text-gray-900 tracking-tight">Erase Content?</h3>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">This will permanently destroy <span className="text-rose-600 font-black">"{post.title}"</span> from the global production database.</p>
            </div>
            <div className="bg-gray-50/50 px-8 py-6 flex items-center gap-4 justify-center border-t border-gray-100">
               <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-white border border-gray-100 rounded-2xl hover:bg-gray-100 cursor-pointer transition-all">Cancel</button>
               <button onClick={executeDelete} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-white bg-rose-600 rounded-2xl hover:bg-rose-700 cursor-pointer shadow-lg shadow-rose-600/20 transition-all">Destroy</button>
            </div>
          </div>
        </div>
      )}

      {showIssueListModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001d1a]/60 backdrop-blur-md px-4">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Article Issues</h3>
              <button onClick={() => setShowIssueListModal(false)} className="p-2 text-gray-400 hover:text-gray-800">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-3 max-h-[65vh] overflow-y-auto">
              <p className="text-[12px] font-semibold text-gray-700">{post.title}</p>
              {issueListLoading ? (
                <p className="text-[12px] text-gray-500">Loading issues...</p>
              ) : postIssues.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 p-5 text-center text-[12px] text-gray-500">
                  No issue history found for this article.
                </div>
              ) : (
                postIssues.map((issue) => (
                  <div key={issue.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                        {issue.severity || "MEDIUM"}
                      </span>
                      <span className={`text-[10px] font-bold uppercase ${issue.resolved || issue.isResolved ? "text-emerald-600" : "text-rose-600"}`}>
                        {issue.resolved || issue.isResolved ? "Resolved" : "Open"}
                      </span>
                    </div>
                    <p className="text-[13px] text-gray-700">{issue.description || issue.comment || "Issue details not available."}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Issue Creation Modal */}
      {showIssueModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001d1a]/60 backdrop-blur-md px-4">
              <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                  <div className="p-8 space-y-6">
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100"><TriangleAlert size={20}/></div>
                              <div>
                                  <h3 className="text-lg font-black text-gray-900 tracking-tight">Report Issue</h3>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Post Moderation Feedback</p>
                              </div>
                          </div>
                          <button onClick={() => setShowIssueModal(false)} className="p-2 text-gray-300 hover:text-gray-900 transition-colors"><X size={20}/></button>
                      </div>

                      <form onSubmit={handleCreateIssue} className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Severity / Urgency</label>
                             <div className="flex gap-2">
                                 {['LOW', 'MEDIUM', 'HIGH'].map(s => (
                                     <button 
                                        key={s} type="button" onClick={() => setIssueSeverity(s)}
                                        className={`flex-1 py-2 rounded-xl text-[10px] font-black tracking-widest border transition-all ${issueSeverity === s ? 'bg-rose-600 text-white border-rose-600 shadow-md' : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-rose-200'}`}
                                     >
                                         {s}
                                     </button>
                                 ))}
                             </div>
                          </div>

                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Issue Description</label>
                             <textarea 
                                required
                                value={issueDescription}
                                onChange={e => setIssueDescription(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 transition-all min-h-[120px]"
                                placeholder="Explain why this post needs a correction..."
                             />
                          </div>

                          <button className="w-full py-4 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-primary-dark transition-all active:scale-[0.98] mt-4">
                              Submit Moderation Log
                          </button>
                      </form>
                  </div>
              </div>
          </div>
      )}

      {/* Tags Editor Modal (Admin) */}
      {showTagsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001d1a]/60 backdrop-blur-md px-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-violet-50 text-violet-700 border border-violet-100">
                      <Tag className="w-4 h-4" />
                    </span>
                    Update tags
                  </h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Only tags will change · post content stays same
                  </p>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    <span className="font-bold text-gray-800">Post:</span> {post.title}
                  </p>
                </div>
                <button onClick={() => setShowTagsModal(false)} className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  placeholder="Search tags…"
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                />
                <button
                  type="button"
                  disabled={savingTags}
                  onClick={saveTags}
                  className="px-6 py-3 bg-primary text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-primary-dark transition-all disabled:opacity-60"
                >
                  {savingTags ? "Saving…" : "Save tags"}
                </button>
              </div>

              <div className="bg-gray-50/60 border border-gray-100 rounded-2xl p-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Selected</p>
                {selectedTags.length === 0 ? (
                  <p className="text-sm text-gray-500">No tags selected.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTag(t.id)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-800 text-xs font-bold hover:border-violet-300"
                        title="Remove"
                      >
                        {t.name}
                        <span className="text-gray-400">
                          <X className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-auto custom-scrollbar pr-1">
                {filteredTags.map((t) => {
                  const checked = selectedTagIds.includes(t.id);
                  return (
                    <label
                      key={t.id}
                      className={`flex items-center justify-between gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                        checked ? "border-violet-200 bg-violet-50/40" : "border-gray-100 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-gray-900 truncate">{t.name}</div>
                        <div className="text-[11px] font-mono text-gray-400 truncate">{t.slug}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTag(t.id)}
                        className="w-4 h-4"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
