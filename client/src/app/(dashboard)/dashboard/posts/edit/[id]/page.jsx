"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Image as ImageIcon, Type, Video, Trash, Link2, Upload, Tag, Shield, Star, FileText, Zap } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React from "react";

// Drop-in React 19 replacement component resolving findDOMNode errors globally
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false, loading: () => <p className="text-xs text-gray-500 font-medium">Loading Rich Text Editor...</p> });

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const BREAKING_SLUGS = ["breaking-news", "breaking"];

export default function EditPostPage({ params }) {
  const unwrappedParams = React.use(params);
  const postId = unwrappedParams.id;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [childCategoryId, setChildCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);
  const [featured, setFeatured] = useState(false);
  const [isOpinion, setIsOpinion] = useState(false);
  const [homeSpotlightPriority, setHomeSpotlightPriority] = useState(0);
  const [feedPriority, setFeedPriority] = useState(0);
  
  const [categories, setCategories] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = currentUser?.role === "ADMIN";

  const breakingTagIds = tagsList.filter((t) => BREAKING_SLUGS.includes(t.slug)).map((t) => t.id);
  const breakingActive = breakingTagIds.length > 0 && breakingTagIds.some((id) => selectedTags.includes(id));

  const setBreakingCoverage = (on) => {
    if (on) {
      setSelectedTags((prev) => [...new Set([...prev, ...breakingTagIds])]);
    } else {
      setSelectedTags((prev) => prev.filter((id) => !breakingTagIds.includes(id)));
    }
  };

  const [blocks, setBlocks] = useState([
    { id: Date.now(), type: "text", content: "" }
  ]);

  useEffect(() => {
     const fetchCategories = fetch(`${API_BASE}/admin/categories`, { credentials: "include" }).then((res) => res.json());
     const fetchTags = fetch(`${API_BASE}/admin/tags`, { credentials: "include" }).then((res) => res.json());
     const fetchPost = fetch(`${API_BASE}/admin/posts?limit=250`, { credentials: "include" }).then((res) => res.json());
     const fetchMe = fetch(`${API_BASE}/admin/auth/me`, { credentials: "include" }).then((res) => res.json());

     Promise.all([fetchCategories, fetchTags, fetchPost, fetchMe]).then(([catsData, tagsData, postsData, meData]) => {
         if (meData?.success && meData.data) setCurrentUser(meData.data);
         if(catsData.success) setCategories(catsData.data);
         if(tagsData.success) setTagsList(tagsData.data);
         
         if(postsData.success) {
            const target = postsData.posts?.find(p => p.id === postId);
            if(target) {
                setTitle(target.title);
                setExcerpt(target.excerpt || "");
                setFeatured(!!target.featured);
                setIsOpinion(!!target.isOpinion);
                setHomeSpotlightPriority(
                  typeof target.homeSpotlightPriority === "number" ? target.homeSpotlightPriority : 0
                );
                setFeedPriority(typeof target.feedPriority === "number" ? target.feedPriority : 0);
                
                if(target.category?.parentId) {
                    setParentCategoryId(target.category.parentId);
                    setChildCategoryId(target.categoryId);
                } else {
                    setParentCategoryId(target.categoryId);
                }

                setSelectedTags(target.tags?.map(t => t.tag.id) || []);

                try {
                    const parsedContent = typeof target.content === 'object' ? target.content : JSON.parse(target.content);
                    if(Array.isArray(parsedContent) && parsedContent.length > 0) {
                        setBlocks(parsedContent.map((b, idx) => ({
                            id: Date.now() + idx,
                            type: b.type,
                            content: b.content,
                            file: null,
                            videoSource: b.metaInfo || 'url'
                        })));
                    }
                } catch(e) {}
            } else {
                toast.error("Target database post not found.");
            }
         }
         setIsLoading(false);
     }).catch(() => {
         toast.error("Failed synchronizing networking loops");
         setIsLoading(false);
     });

  }, [postId]);

  const toggleTag = (tagId) => {
      setSelectedTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]);
  };

  const addBlock = (type) => {
    setBlocks([...blocks, { id: Date.now(), type, content: "", file: null, videoSource: type === 'video' ? 'url' : null }]);
  };

  const updateBlockContent = (id, newContent) => {
    setBlocks(prevBlocks => {
      let changed = false;
      const newBlocks = prevBlocks.map((b) => {
        if (b.id === id && b.content !== newContent) {
          changed = true;
          return { ...b, content: newContent };
        }
        return b;
      });
      return changed ? newBlocks : prevBlocks;
    });
  };

  const setVideoSource = (id, sourceMode) => {
      setBlocks(blocks.map((b) => (b.id === id ? { ...b, videoSource: sourceMode, content: "", file: null } : b)));
  };

  const handleFileChange = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file); 
      setBlocks(blocks.map((b) => (b.id === id ? { ...b, content: url, file } : b)));
    }
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const finalCategoryId = childCategoryId || parentCategoryId;
    if(!finalCategoryId) {
       toast.error("You must select at least a parent category!");
       return;
    }
    
    // Injecting Mutler Express Intercept Uploads tracking dynamically replacing modified buffers natively avoiding overwrites.
    toast.loading("Uploading Media Variations and Syncing Post...");
    const parsedBlocks = [];
    for (const b of blocks) {
        if ((b.type === 'image' || b.type === 'video') && b.file) {
            const formData = new FormData();
            formData.append('media', b.file);
            try {
                const uploadRes = await fetch(`${API_BASE}/admin/upload`, { method: 'POST', body: formData, credentials: "include" });
                const uploadData = await uploadRes.json();
                if (uploadData.success && uploadData.url) {
                    parsedBlocks.push({ type: b.type, content: 'http://localhost:5000' + uploadData.url, metaInfo: b.videoSource });
                } else {
                    toast.dismiss();
                    toast.error("Media file refused mapping natively.");
                    return;
                }
            } catch(error) {
                toast.dismiss();
                toast.error("Media upload routing crashed natively.");
                return;
            }
        } else {
            // Unmodified Image/Video Blocks carry their original content URL silently! Completely solves "be carefull" delete/add.
            parsedBlocks.push({ type: b.type, content: b.content, metaInfo: b.videoSource });
        }
    }
    
    const payload = {
      title, excerpt, categoryId: finalCategoryId,
      tags: selectedTags,
      content: parsedBlocks,
    };
    if (isAdmin) {
      payload.featured = featured;
      payload.isOpinion = isOpinion;
      payload.homeSpotlightPriority = Number(homeSpotlightPriority) || 0;
      payload.feedPriority = Number(feedPriority) || 0;
    }

    try {
        const res = await fetch(`${API_BASE}/admin/posts/${postId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        toast.dismiss();
        if(res.ok) {
            toast.success("Dynamic Post modifications injected successfully!");
            router.push("/dashboard/posts");
        } else {
            toast.error("Database connection refused updating Post schemas");
        }
    } catch(e) {
        toast.dismiss();
        toast.error("Endpoint networking crash.");
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ]
  };

  if (isLoading) return <div className="p-10 text-center text-sm font-semibold text-gray-500 animate-pulse">Decrypting internal Database Blocks...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 text-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Modify Article Settings</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">Amend tags, rewrite texts, or update dynamic BBC Blocks securely.</p>
        </div>
        <button onClick={handleUpdateSubmit} className="bg-emerald-600 text-white px-5 py-2 text-xs rounded border border-emerald-600 font-semibold tracking-wide shadow-sm hover:bg-emerald-700 transition-colors">
          Commit Changes
        </button>
      </div>

      <div className="bg-white p-5 shadow-sm border border-gray-200 rounded-lg space-y-5">
        <div className="mb-2">
           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Post Headline</label>
           <input 
             value={title} onChange={e => setTitle(e.target.value)}
             className="w-full border-none p-0 text-2xl font-black focus:ring-0 placeholder:text-gray-200 bg-transparent text-gray-900 tracking-tight" 
             placeholder="Enter Breaking News Title..." 
           />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
            <div>
               <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Primary Category</label>
               <select value={parentCategoryId} onChange={e => { setParentCategoryId(e.target.value); setChildCategoryId(""); }} className="w-full border-gray-100 bg-gray-50 p-3 text-[13px] font-bold rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all cursor-pointer">
                  <option value="">Select Target Parent...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
            </div>
            <div>
               <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Subcategory</label>
               <select 
                value={childCategoryId} 
                onChange={e => setChildCategoryId(e.target.value)} 
                disabled={!parentCategoryId}
                className={`w-full border-gray-100 p-3 text-[13px] font-bold rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all cursor-pointer ${!parentCategoryId ? 'bg-gray-100 text-gray-400 opacity-50' : 'bg-gray-50 text-gray-700'}`}
               >
                  <option value="">Select Subcategory...</option>
                  {parentCategoryId && categories.find(c => c.id === parentCategoryId)?.children?.map(child => (
                      <option key={child.id} value={child.id}>{child.name}</option>
                  ))}
               </select>
            </div>
        </div>

        {isAdmin && (
          <div className="rounded-xl border-2 border-amber-200/80 bg-amber-50/40 p-4 space-y-4">
            <div className="flex items-center gap-2 text-amber-900">
              <Shield className="w-4 h-4 shrink-0" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] font-[Inter]">
                Admin · homepage & distribution
              </h3>
            </div>
            <p className="text-[10px] text-amber-900/80 font-[Inter] leading-relaxed">
              Only admins can change these. Authors still use tags below, but <strong>Breaking</strong> tags are enforced
              here so you can pull stories from the ticker without confusion.
            </p>
            <label className="flex items-center justify-between gap-3 cursor-pointer group">
              <div className="flex items-center gap-2 min-w-0">
                <Star className={`w-4 h-4 shrink-0 ${featured ? "text-amber-500 fill-amber-400" : "text-gray-400"}`} />
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Home “big cards” (PulseHero)</span>
                  <span className="text-[10px] text-gray-500">Marks this story in the featured carousel on the homepage.</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 shrink-0"
              />
            </label>
            <div>
              <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                Spotlight priority (0–999)
              </label>
              <input
                type="number"
                min={0}
                max={999}
                value={homeSpotlightPriority}
                onChange={(e) => setHomeSpotlightPriority(e.target.value === "" ? "" : Number(e.target.value))}
                disabled={!featured}
                className="w-full max-w-[140px] border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono disabled:opacity-40"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Lower number = higher priority (1 is highest). Leave empty or 0 for default.
              </p>
            </div>
            <div className="border-t border-amber-200/50 pt-3">
              <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                Listing priority — category / subcategory / author pages (0–999)
              </label>
              <input
                type="number"
                min={0}
                max={999}
                value={feedPriority}
                onChange={(e) => setFeedPriority(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full max-w-[140px] border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Lower number = higher priority (1 is highest). Leave empty or 0 for default.
              </p>
            </div>
            <label className="flex items-center justify-between gap-3 cursor-pointer group">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className={`w-4 h-4 shrink-0 ${isOpinion ? "text-blue-600" : "text-gray-400"}`} />
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Must read / Opinion</span>
                  <span className="text-[10px] text-gray-500">Fills the &quot;Must Read&quot; block when opinion slots are used.</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isOpinion}
                onChange={(e) => setIsOpinion(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
              />
            </label>
            <label className="flex items-center justify-between gap-3 cursor-pointer group border-t border-amber-200/50 pt-3">
              <div className="flex items-center gap-2 min-w-0">
                <Zap className={`w-4 h-4 shrink-0 ${breakingActive ? "text-red-600" : "text-gray-400"}`} />
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Breaking ticker &amp; /breaking page</span>
                  <span className="text-[10px] text-gray-500">
                    Adds/removes <code className="text-[9px] bg-white/80 px-1 rounded">breaking-news</code> &amp;{" "}
                    <code className="text-[9px] bg-white/80 px-1 rounded">breaking</code> tags together.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={breakingActive}
                onChange={(e) => setBreakingCoverage(e.target.checked)}
                disabled={breakingTagIds.length === 0}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500 shrink-0"
              />
            </label>
            {breakingTagIds.length === 0 && (
              <p className="text-[10px] text-amber-800 bg-white/60 rounded px-2 py-1.5">
                Create tags named <strong>breaking-news</strong> or <strong>breaking</strong> in Tag admin first.
              </p>
            )}
          </div>
        )}

        <div>
           <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
             Tags {isAdmin ? "" : "(Breaking tags: admin only)"}
           </label>
           <div className="flex flex-wrap gap-2">
             {tagsList
               .filter((t) => isAdmin || !BREAKING_SLUGS.includes(t.slug))
               .map((t) => (
                 <button
                   type="button"
                   key={t.id}
                   onClick={() => toggleTag(t.id)}
                   className={`text-[10px] px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1.5 font-semibold tracking-wide uppercase cursor-pointer ${selectedTags.includes(t.id) ? "bg-[#00453e] text-white border-[#00453e] shadow-sm" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100"}`}
                 >
                   <Tag className="w-2.5 h-2.5" /> {t.name}
                 </button>
               ))}
           </div>
        </div>

        <div>
           <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Excerpt summary</label>
           <textarea 
             value={excerpt} onChange={e => setExcerpt(e.target.value)}
             className="w-full border p-3 text-xs rounded focus:outline-none focus:border-[#00453e] text-gray-800 bg-gray-50 font-medium border-gray-200 min-h-[60px]" 
             placeholder="Short SEO summary for the homepage feed loop..." 
           />
        </div>

        <div className="mt-8 space-y-3 border-t border-gray-200 pt-6">
           <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-3">Content Builder</label>
           
           {blocks.map((block) => (
             <div key={block.id} className="group relative flex items-start gap-4 p-3 border border-gray-200 bg-white shadow-sm hover:border-gray-300 transition-all rounded-lg">
                <div className="flex-1 w-full max-w-full overflow-hidden">
                  
                  {block.type === 'text' && (
                    <div className="bg-white rounded border border-gray-200 overflow-hidden text-gray-800 font-medium">
                      <ReactQuill 
                         theme="snow"
                         value={block.content}
                         onChange={(val) => updateBlockContent(block.id, val)}
                         modules={modules}
                         className="text-sm border-none bg-white min-h-[140px] text-gray-800"
                         placeholder="Select text to bold, change to heading list..."
                      />
                    </div>
                  )}

                  {block.type === 'image' && (
                    <div className="flex flex-col gap-2 relative">
                      {block.content ? (
                        <div className="relative max-h-64 w-fit overflow-hidden rounded border border-gray-200 shadow-sm mx-auto group-hover/img shadow hover:shadow-md transition-shadow">
                           <img src={block.content} alt="Preview Component Image" className="object-contain w-full max-h-64 h-auto" />
                           <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white font-semibold text-[10px] tracking-wider uppercase">
                              Replace Image File
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(block.id, e)} />
                           </label>
                        </div>
                      ) : (
                        <div className="w-full max-w-lg mx-auto border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col justify-center items-center text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">
                          <ImageIcon className="w-6 h-6 mb-2 text-gray-400" />
                          <label className="cursor-pointer text-xs hover:text-gray-900 font-semibold tracking-wide uppercase hover:underline">
                             Upload Image Object Mode
                             <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(block.id, e)} />
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  {block.type === 'video' && (
                    <div className="w-full max-w-md mx-auto border border-gray-200 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden">
                         <div className="flex border-b border-gray-200 bg-gray-50/80">
                             <button onClick={() => setVideoSource(block.id, 'url')} className={`flex-1 py-2 text-[10px] font-semibold tracking-wider uppercase flex justify-center gap-1.5 items-center transition-colors cursor-pointer ${block.videoSource === 'url' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}><Link2 className="w-3.5 h-3.5" /> URL Link</button>
                             <button onClick={() => setVideoSource(block.id, 'upload')} className={`flex-1 py-2 text-[10px] font-semibold tracking-wider uppercase flex justify-center gap-1.5 items-center transition-colors cursor-pointer ${block.videoSource === 'upload' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}><Upload className="w-3.5 h-3.5" /> Upload File</button>
                         </div>
                         <div className="p-4">
                             {block.videoSource === 'url' ? (
                                <input type="text" placeholder="https://youtube.com/watch?v=..." className="w-full px-3 py-2 bg-white text-gray-800 font-medium text-xs outline-none border border-gray-300 rounded focus:border-[#00453e] focus:ring-1 focus:ring-[#00453e] transition-colors" value={block.content} onChange={e => updateBlockContent(block.id, e.target.value)} />
                             ) : (
                                <div>
                                   {block.content ? (
                                     <div className="flex flex-col gap-2 relative group-hover/vid">
                                        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded font-semibold uppercase tracking-wide justify-center shadow-inner"><Video className="w-4 h-4"/> Video Object Attached Natively</div>
                                        <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white font-semibold text-[10px] tracking-wider uppercase rounded shadow">
                                           Upload New
                                           <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(block.id, e)} />
                                        </label>
                                     </div>
                                   ) : (
                                     <label className="cursor-pointer w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded bg-gray-50 text-gray-600 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-100 text-xs font-semibold uppercase tracking-wide transition-all">
                                        <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(block.id, e)} />
                                        Browse Video From PC
                                     </label>
                                   )}
                                </div>
                             )}
                         </div>
                    </div>
                  )}

                </div>
                
                <button onClick={() => removeBlock(block.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:bg-red-50 hover:text-red-600 p-1.5 rounded transition-all mt-1 cursor-pointer border border-transparent hover:border-red-200" title="Remove Block">
                  <Trash className="w-4 h-4" />
                </button>
             </div>
           ))}

           <div className="flex items-center justify-center gap-3 pt-4 border-t border-dashed border-gray-200 mt-6 pb-2">
              <button type="button" onClick={() => addBlock('text')} className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 text-[11px] font-semibold tracking-wide rounded-md transition-colors shadow-sm uppercase cursor-pointer">
                <Type className="w-3.5 h-3.5" /> Add HTML Text Option
              </button>
              <button type="button" onClick={() => addBlock('image')} className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 hover:border-purple-300 text-[11px] font-semibold tracking-wide rounded-md transition-colors shadow-sm uppercase cursor-pointer">
                <ImageIcon className="w-3.5 h-3.5" /> Add Picture Slot
              </button>
              <button type="button" onClick={() => addBlock('video')} className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 hover:border-blue-300 text-[11px] font-semibold tracking-wide rounded-md transition-colors shadow-sm uppercase cursor-pointer">
                <Video className="w-3.5 h-3.5" /> Add Media Link
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
