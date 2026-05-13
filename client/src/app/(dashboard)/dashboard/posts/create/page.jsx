"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Type, Video, Trash2, Upload, Tag, Quote, Activity, Shield, X, ChevronDown, MousePointer2, FileText, SquarePen, Image as ImageIcon } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getApiV1Base, getClientSiteOrigin } from "@/lib/apiBaseUrl";

// Drop-in React 19 replacement component 
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false, loading: () => <p className="text-[12px] text-gray-500 font-medium">Loading Editor...</p> });
const makeBlockId = () => typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

const normalizeEditorHtml = (value) => {
  if (typeof value !== "string") return value;
  return value.replace(/&nbsp;|&#160;|\u00A0/g, " ").replace(/white-space\s*:\s*nowrap;?/gi, "");
};

const CustomSelect = ({ value, onChange, options, placeholder, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className={`relative w-full ${disabled ? 'opacity-60 pointer-events-none' : ''}`} ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border ${isOpen ? 'border-[#8B0000] ring-4 ring-[#8B0000]/10' : 'border-gray-200'} ${disabled ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-700'} pl-3 py-3 pr-10 text-[13px] font-bold rounded-xl outline-none transition-all cursor-pointer shadow-sm truncate flex items-center justify-between`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''} absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none`} />
      </div>
      
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto overflow-x-hidden">
          <div 
            onClick={() => { onChange(""); setIsOpen(false); }}
            className="px-4 py-2.5 text-[13px] font-medium text-gray-500 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
          >
            {placeholder}
          </div>
          {options.map(opt => (
            <div 
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-gray-50 transition-colors truncate ${value === opt.value ? 'bg-[#8B0000]/5 text-[#8B0000] font-bold' : 'text-gray-700'}`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [heroCaption, setHeroCaption] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [childCategoryId, setChildCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  
  const [countryTag, setCountryTag] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const [featuredImage, setFeaturedImage] = useState("");
  const [featuredImageFile, setFeaturedImageFile] = useState(null);

  const [categories, setCategories] = useState([]);
 
  const [tagsList, setTagsList] = useState([]);
  
  const [currentUser, setCurrentUser] = useState(null);
  const [featured, setFeatured] = useState(false);
  const [isOpinion, setIsOpinion] = useState(false);
  const [homeSpotlightPriority, setHomeSpotlightPriority] = useState(0);
  const [feedPriority, setFeedPriority] = useState(0);
  const isAdmin = currentUser?.role === "ADMIN";

  const breakingTagIds = tagsList.filter((t) => ["breaking-news", "breaking"].includes(t.slug)).map((t) => t.id);
  const breakingActive = breakingTagIds.length > 0 && breakingTagIds.some((id) => selectedTags.includes(id));

  // Max lengths
  const MAX_TITLE = 100;
  const MAX_SUBTITLE = 200;
  const MAX_CAPTION = 150;

  const setBreakingCoverage = (on) => {
    if (on) {
      setSelectedTags((prev) => [...new Set([...prev, ...breakingTagIds])]);
    } else {
      setSelectedTags((prev) => prev.filter((id) => !breakingTagIds.includes(id)));
    }
  };

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImageFile(file);
      const url = URL.createObjectURL(file);
      setFeaturedImage(url);
    }
  };

  useEffect(() => {
     const fetchCategories = fetch(`${getApiV1Base()}/public/categories`).then(res => res.json());
     const fetchTags = fetch(`${getApiV1Base()}/public/tags`).then(res => res.json());
     const fetchMe = fetch(`${getApiV1Base()}/admin/auth/me`, { credentials: "include" }).then(res => res.json());

     Promise.all([fetchCategories, fetchTags, fetchMe]).then(([catsData, tagsData, meData]) => {
         if (meData?.success && meData.data) setCurrentUser(meData.data);
         if(catsData.success) setCategories(catsData.data);
         if(tagsData.success) setTagsList(tagsData.data);
     }).catch(() => {
         toast.error("Failed synchronizing networking loops");
     });
  }, []);

  const [blocks, setBlocks] = useState([
    { id: makeBlockId(), type: "text", content: "" }
  ]);

  const addBlock = (type) => {
    setBlocks((prev) => [...prev, { id: makeBlockId(), type, content: "", file: null, metaInfo: type === "video" ? "url" : "" }]);
  };

  const updateBlockContent = (id, newContent) => {
    setBlocks(prevBlocks => prevBlocks.map(b => b.id === id ? { ...b, content: newContent } : b));
  };

  const handleFileChange = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file); 
      setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content: url, file } : b)));
    }
  };

  const removeBlock = (id) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !subtitle || !parentCategoryId || selectedTags.length === 0 || !featuredImageFile) {
        toast.error("Please fill in all mandatory fields (Title, Subtitle, Category, Tags, Image)!");
        return;
    }

    const toastId = toast.loading("Processing submission...");
    
    try {
        let uploadedFeaturedImage = "";
        if (featuredImageFile) {
            const formData = new FormData();
            formData.append('media', featuredImageFile);
            const uploadRes = await fetch(`${getApiV1Base()}/admin/upload`, { 
                method: 'POST', 
                body: formData,
                credentials: 'include'
            });
            const uploadData = await uploadRes.json();
            if (uploadData.success && uploadData.url) {
                uploadedFeaturedImage = getClientSiteOrigin() + uploadData.url;
            }
        }

        const parsedBlocks = [];
        for (const b of blocks) {
            if ((b.type === 'image' || b.type === 'video') && b.file) {
                const formData = new FormData();
                formData.append('media', b.file);
                const uploadRes = await fetch(`${getApiV1Base()}/admin/upload`, { 
                    method: 'POST', 
                    body: formData,
                    credentials: 'include'
                });
                const uploadData = await uploadRes.json();
                if (uploadData.success && uploadData.url) {
                    parsedBlocks.push({ type: b.type, content: getClientSiteOrigin() + uploadData.url, metaInfo: b.metaInfo });
                }
            } else {
                parsedBlocks.push({
                  type: b.type,
                  content: b.type === "text" ? normalizeEditorHtml(b.content) : b.content,
                  metaInfo: b.metaInfo
                });
            }
        }
        
        const payload = {
          title, subtitle, excerpt, heroCaption,
          featuredImage: uploadedFeaturedImage,
          categoryId: childCategoryId || parentCategoryId,
          tags: selectedTags,
          isPhotoStory: false,
          countryTag, subcategory,
          content: parsedBlocks,
          status: 'PENDING'
        };

        if (isAdmin) {
          payload.featured = featured;
          payload.isOpinion = isOpinion;
          payload.homeSpotlightPriority = Number(homeSpotlightPriority) || 0;
          payload.feedPriority = Number(feedPriority) || 0;
        }
        
        const res = await fetch(`${getApiV1Base()}/admin/posts`, { 
            method: 'POST', 
            body: JSON.stringify(payload), 
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        const result = await res.json().catch(() => ({}));

        if(res.ok) {
            toast.success("Article submitted for moderation!");
            router.push("/dashboard/posts");
        } else {
            toast.error(result?.message || "Failed to save article.");
        }
    } catch(e) {
        toast.error("An error occurred during submission.");
    } finally {
        toast.dismiss(toastId);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ]
  };

  return (
    <div className="w-full px-1 md:px-4 pb-28 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#f8fafc] min-h-screen">
      <div className="max-w-[1400px] mx-auto pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-[14px] font-black text-gray-900 tracking-tight uppercase">News Creation Engine</h1>
            <p className="text-[12px] text-gray-500 mt-1 font-medium tracking-wide">Premium Editorial Suite</p>
          </div>
          <button onClick={handleSubmit} className="px-6 py-2.5 bg-[#8B0000] !text-white font-bold text-[12px] rounded-lg hover:bg-[#6b0000] transition-colors shadow-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer">
            <MousePointer2 size={14} className="text-white"/> Create news
          </button>
        </div>

        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-4 md:gap-6">
          
          {/* Main Editor Section */}
          <div className="lg:col-span-8 space-y-4 md:space-y-6">
              
              {/* Core Metadata */}
              <div className="bg-white p-2 md:p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-8">
                  <div className="relative">
                     <label className="flex items-center text-[12px] font-black text-gray-500 uppercase tracking-wider mb-2 px-1">
                        Headline <span className="text-rose-500 ml-1 leading-none">*</span>
                        <span className="ml-auto text-[12px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{title.length}/{MAX_TITLE}</span>
                     </label>
                     <input 
                       value={title} onChange={e => setTitle(e.target.value)}
                       maxLength={MAX_TITLE}
                       className="w-full bg-transparent border-0 border-b-2 border-gray-100 px-1 py-2 text-[14px] font-bold focus:ring-0 focus:border-[#8B0000] placeholder:text-gray-300 text-gray-900 transition-colors" 
                       placeholder="The most compelling headline..." 
                     />
                  </div>

                  <div className="relative">
                     <label className="flex items-center text-[12px] font-black text-gray-500 uppercase tracking-wider mb-2 px-1">
                        Sub-headline <span className="text-rose-500 ml-1 leading-none">*</span>
                        <span className="ml-auto text-[12px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{subtitle.length}/{MAX_SUBTITLE}</span>
                     </label>
                     <textarea 
                       value={subtitle} onChange={e => setSubtitle(e.target.value)}
                       maxLength={MAX_SUBTITLE}
                       className="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-xl text-[14px] font-medium focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]/50 placeholder:text-gray-300 text-gray-700 min-h-[120px] resize-y transition-all outline-none" 
                       placeholder="Add secondary context or a dekko..." 
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 pt-4 border-t border-gray-100/50">
                      <div>
                         <label className="flex items-center text-[12px] font-black text-gray-500 uppercase tracking-wider mb-2 px-1">
                            Primary Category <span className="text-rose-500 ml-1 leading-none">*</span>
                         </label>
                           <CustomSelect 
                             value={parentCategoryId} 
                             onChange={(val) => { setParentCategoryId(val); setChildCategoryId(""); }}
                             placeholder="Select Category..."
                             options={categories.map(c => ({ value: c.id, label: c.name }))}
                           />
                      </div>
                      <div>
                         <label className="flex items-center text-[12px] font-black text-gray-500 uppercase tracking-wider mb-2 px-1">Subcategory</label>
                           <CustomSelect 
                            value={childCategoryId} 
                            onChange={(val) => {
                                setChildCategoryId(val);
                                if (val) {
                                    const parent = categories.find(c => c.id === parentCategoryId);
                                    const child = parent?.children?.find(ch => ch.id === val);
                                    if (child) setSubcategory(child.name);
                                } else {
                                    setSubcategory("");
                                }
                            }} 
                            disabled={!parentCategoryId}
                            placeholder="Select Subcategory..."
                            options={parentCategoryId && categories.find(c => c.id === parentCategoryId)?.children ? categories.find(c => c.id === parentCategoryId).children.map(child => ({ value: child.id, label: child.name })) : []}
                           />
                      </div>
                  </div>
              </div>

              {/* Block Builder */}
              <div className="bg-white p-2 md:p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100/60">
                      <h2 className="text-[13px] font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                          <Activity className="w-4 h-4 text-[#8B0000]" /> Narrative Content
                      </h2>
                  </div>

                  <div className="space-y-6">
                      {blocks.map((block, idx) => (
                          <div key={block.id} className="group relative bg-white border border-gray-100 p-[2px] rounded-xl hover:border-[#8B0000]/30 hover:shadow-md transition-all duration-300">
                              
                              <div className="absolute -left-2 -top-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-sm z-10 border-2 border-white">
                                {idx + 1}
                              </div>

                              {block.type === 'text' && (
                                  <ReactQuill 
                                      theme="snow"
                                      value={block.content}
                                      onChange={(v) => updateBlockContent(block.id, v)}
                                      modules={modules}
                                      className="bg-transparent [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-gray-50 [&_.ql-toolbar]:rounded-t-lg [&_.ql-container]:border-none [&_.ql-container]:bg-transparent [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:p-2 [&_.ql-editor]:text-[14px] [&_.ql-editor]:leading-relaxed [&_.ql-editor]:text-gray-800"
                                  />
                              )}

                              {block.type === 'image' && (
                                  <div className="space-y-4 text-center mt-2">
                                      {block.content ? (
                                          <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm max-h-72 mx-auto w-fit bg-gray-50">
                                              <img src={block.content} className="max-h-72 w-auto object-contain" />
                                          </div>
                                      ) : (
                                          <label className="flex flex-col items-center justify-center p-8 border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all">
                                              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                                                <ImageIcon className="w-5 h-5 text-gray-400" />
                                              </div>
                                              <span className="text-[12px] font-bold text-gray-500 uppercase">Upload Resource Image</span>
                                              <input type="file" className="hidden" onChange={(e) => handleFileChange(block.id, e)} />
                                          </label>
                                      )}
                                      <div className="px-2">
                                        <input 
                                            type="text" 
                                            placeholder="Caption for this image..." 
                                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-[12px] font-medium outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]/30 text-center placeholder:text-gray-400 text-gray-700 transition-all" 
                                            value={block.metaInfo} 
                                            onChange={e => setBlocks((prev) => prev.map((b) => b.id === block.id ? {...b, metaInfo: e.target.value} : b))}
                                        />
                                      </div>
                                  </div>
                              )}

                              {block.type === 'pullquote' && (
                                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner space-y-3 relative mt-2">
                                      <Quote className="absolute top-4 left-4 w-6 h-6 text-gray-200 rotate-180 pointer-events-none" />
                                      <textarea 
                                          placeholder="Enter the standout quote..."
                                          className="w-full text-[14px] font-black text-gray-800 border-none p-0 outline-none bg-transparent placeholder:text-gray-400 text-center resize-none"
                                          value={block.content}
                                          onChange={e => updateBlockContent(block.id, e.target.value)}
                                      />
                                      <input 
                                          placeholder="Attribution (e.g. Name, Position)"
                                          className="w-full text-[12px] font-bold text-gray-500 uppercase tracking-wider border-none p-0 outline-none bg-transparent mt-1 text-center"
                                          value={block.metaInfo}
                                          onChange={e => setBlocks((prev) => prev.map((b) => b.id === block.id ? {...b, metaInfo: e.target.value} : b))}
                                      />
                                  </div>
                              )}

                              {block.type === 'video' && (
                                  <div className="space-y-4 text-center mt-2">
                                      <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-gray-50 max-w-sm mx-auto">
                                          <button onClick={() => setBlocks((prev) => prev.map((b) => b.id === block.id ? {...b, metaInfo: 'url', content: ''} : b))} className={`flex-1 py-2 text-[11px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${block.metaInfo === 'url' ? 'bg-white text-[#8B0000] shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>URL Link</button>
                                          <button onClick={() => setBlocks((prev) => prev.map((b) => b.id === block.id ? {...b, metaInfo: 'upload', content: ''} : b))} className={`flex-1 py-2 text-[11px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${block.metaInfo === 'upload' ? 'bg-white text-[#8B0000] shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>Upload File</button>
                                      </div>
                                      <div className="px-2 mt-4">
                                          {block.metaInfo === 'url' ? (
                                              <input type="text" placeholder="https://youtube.com/watch?v=..." className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-[12px] font-medium outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]/30 text-center placeholder:text-gray-400 text-gray-700 transition-all" value={block.content} onChange={e => updateBlockContent(block.id, e.target.value)} />
                                          ) : (
                                              <div className="flex flex-col items-center justify-center">
                                                  {block.content ? (
                                                      <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm mx-auto w-fit bg-gray-50">
                                                          <div className="p-4 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Video className="w-4 h-4"/> Video Object Attached</div>
                                                          <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white font-bold text-[10px] tracking-wider uppercase">
                                                              Replace
                                                              <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(block.id, e)} />
                                                          </label>
                                                      </div>
                                                  ) : (
                                                      <label className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all w-full max-w-sm mx-auto">
                                                          <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                                                              <Upload className="w-5 h-5 text-gray-400" />
                                                          </div>
                                                          <span className="text-[12px] font-bold text-gray-500 uppercase">Upload Video File</span>
                                                          <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(block.id, e)} />
                                                      </label>
                                                  )}
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              )}

                              <button onClick={() => removeBlock(block.id)} className="absolute -top-2 -right-2 md:top-2 md:right-2 p-1.5 bg-white text-gray-400 hover:text-white hover:bg-rose-500 rounded-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all shadow-sm border border-gray-200 z-20">
                                  <Trash2 size={14} />
                              </button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Sidebar Section (Moved Above Editor on Mobile) */}
          <div className="lg:col-span-4 space-y-4 md:space-y-6">
              
              {/* Featured Image / Thumbnail Upload */}
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-4 md:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                      <label className="flex items-center text-[12px] font-black text-gray-800 uppercase tracking-wider">
                          Featured Image <span className="text-rose-500 ml-1 leading-none">*</span>
                      </label>
                      {featuredImage && (
                          <button onClick={() => { setFeaturedImage(""); setFeaturedImageFile(null); }} className="text-[12px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md hover:bg-rose-100 transition-colors">
                              Remove
                          </button>
                      )}
                  </div>
                  
                  {featuredImage ? (
                      <div className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-[16/10] shadow-sm">
                          <img src={featuredImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Featured Preview" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <div onClick={() => { setFeaturedImage(""); setFeaturedImageFile(null); }} className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-rose-600 hover:text-white text-gray-800 shadow-sm transition-all">
                                  <Trash2 size={16} />
                               </div>
                          </div>
                      </div>
                  ) : (
                      <label className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all aspect-[16/10] group">
                          <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                              <Upload className="w-5 h-5 text-gray-400" />
                          </div>
                          <span className="text-[12px] font-bold text-gray-600 uppercase">Upload Cover</span>
                          <span className="text-[12px] font-medium text-gray-400 mt-1">1200 x 630px</span>
                          <input type="file" className="hidden" onChange={handleFeaturedImageChange} accept="image/*" />
                      </label>
                  )}
                  
                  <div className="relative mt-2">
                     <label className="flex items-center text-[12px] font-bold text-gray-500 mb-1.5 px-1">
                        Image Caption
                        <span className="ml-auto text-[12px] font-medium text-gray-400 bg-gray-50 px-1 rounded">{heroCaption.length}/{MAX_CAPTION}</span>
                     </label>
                     <input 
                       value={heroCaption} onChange={e => setHeroCaption(e.target.value)}
                       maxLength={MAX_CAPTION}
                       className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[13px] font-medium focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]/30 placeholder:text-gray-400 text-gray-700 outline-none transition-all" 
                       placeholder="Credits or description..." 
                     />
                  </div>
              </div>

              {/* Taxonomy & Metadata */}
              <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4">
                  <h3 className="text-[13px] font-black text-gray-800 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
                      Taxonomy
                  </h3>
                  
                  <div className="space-y-4">
                      <div className="relative group">
                          <label className="flex items-center text-[12px] font-bold text-gray-600 mb-2 px-1">
                              Tags <span className="text-rose-500 ml-1 leading-none">*</span>
                          </label>
                          <CustomSelect 
                              value=""
                              onChange={(val) => {
                                  if (val && !selectedTags.includes(val)) {
                                      setSelectedTags([...selectedTags, val]);
                                  }
                              }}
                              placeholder={tagsList.length === 0 ? 'Synchronizing tags...' : 'Select Tags...'}
                              options={tagsList.map(t => ({ value: t.id, label: t.name }))}
                          />

                      </div>

                      <div className="flex flex-wrap gap-2">
                          {selectedTags.length === 0 ? (
                              <div className="w-full py-6 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                                  <Tag size={16} className="mb-2 opacity-40" />
                                  <p className="text-[12px] font-bold">No Tags Selected</p>
                              </div>
                          ) : selectedTags.map(tagId => {
                              const tag = tagsList.find(t => t.id === tagId);
                              return tag ? (
                                  <span key={tagId} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[12px] font-semibold rounded-md border border-gray-200 flex items-center gap-1.5 hover:border-gray-300 transition-all shadow-sm">
                                      {tag.name}
                                      <button onClick={() => setSelectedTags(selectedTags.filter(id => id !== tagId))} className="text-gray-400 hover:text-rose-600 transition-colors cursor-pointer p-0.5">
                                          <X size={12}/>
                                      </button>
                                  </span>
                              ) : null;
                          })}
                      </div>
                  </div>

                  <div className="h-px bg-gray-100 my-4" />

                  <div className="space-y-2">
                      <label className="flex items-center gap-1.5 text-[12px] font-bold text-gray-600 px-1"><Shield size={14} className="text-blue-600"/> Geopolitical Tag</label>
                      <input value={countryTag} onChange={e => setCountryTag(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-sm" placeholder="e.g. USA, Bangladesh, EU" />
                  </div>
              </div>

              {/* Admin Privileges */}
              {isAdmin && (
                <div className="bg-[#fff9f0] p-4 md:p-5 rounded-2xl border-2 border-[#ffedd5] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4">
                  <div className="flex items-center gap-2 text-amber-900 mb-2">
                    <Shield className="w-4 h-4 shrink-0" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Admin Controls</h3>
                  </div>

                  <label className="flex items-center justify-between gap-3 cursor-pointer group">
                    <div className="flex items-center gap-2 min-w-0">
                      <Star className={`w-4 h-4 shrink-0 ${featured ? "text-amber-500 fill-amber-400" : "text-gray-400"}`} />
                      <div>
                        <span className="text-[12px] font-bold text-gray-900 block">Home “big cards” (PulseHero)</span>
                        <span className="text-[10px] text-gray-500">Marks this story in the featured carousel on the homepage.</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 shrink-0 cursor-pointer"
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
                      className="w-full max-w-[140px] bg-white border border-gray-200 rounded-lg px-3 py-2 text-[12px] font-mono disabled:opacity-40 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>

                  <div className="border-t border-amber-200/50 pt-3">
                    <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                      Listing priority (0–999)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={999}
                      value={feedPriority}
                      onChange={(e) => setFeedPriority(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full max-w-[140px] bg-white border border-gray-200 rounded-lg px-3 py-2 text-[12px] font-mono outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>

                  <label className="flex items-center justify-between gap-3 cursor-pointer group border-t border-amber-200/50 pt-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className={`w-4 h-4 shrink-0 ${isOpinion ? "text-blue-600" : "text-gray-400"}`} />
                      <div>
                        <span className="text-[12px] font-bold text-gray-900 block">Must read / Opinion</span>
                        <span className="text-[10px] text-gray-500">Fills the "Must Read" block when opinion slots are used.</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isOpinion}
                      onChange={(e) => setIsOpinion(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between gap-3 cursor-pointer group border-t border-amber-200/50 pt-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Zap className={`w-4 h-4 shrink-0 ${breakingActive ? "text-red-600" : "text-gray-400"}`} />
                      <div>
                        <span className="text-[12px] font-bold text-gray-900 block">Breaking ticker & /breaking</span>
                        <span className="text-[10px] text-gray-500">
                          Adds/removes breaking tags automatically.
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={breakingActive}
                      onChange={(e) => setBreakingCoverage(e.target.checked)}
                      disabled={breakingTagIds.length === 0}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500 shrink-0 cursor-pointer"
                    />
                  </label>
                </div>
              )}
          </div>
        </div>

        {/* Floating Action Bar for Blocks - White with shadow */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="bg-white border border-gray-200 shadow-xl shadow-black/5 rounded-full px-1.5 py-1.5 flex items-center gap-1">
            <button onClick={() => addBlock("text")} className="px-3 py-2 rounded-full text-[12px] font-bold text-gray-600 hover:text-[#8B0000] hover:bg-rose-50 flex items-center gap-1.5 transition-all uppercase tracking-wide cursor-pointer">
              <Type size={14} /> Text
            </button>
            <div className="w-px h-4 bg-gray-200" />
            <button onClick={() => addBlock("image")} className="px-3 py-2 rounded-full text-[12px] font-bold text-gray-600 hover:text-[#8B0000] hover:bg-rose-50 flex items-center gap-1.5 transition-all uppercase tracking-wide cursor-pointer">
              <ImageIcon size={14} /> Image
            </button>
            <div className="w-px h-4 bg-gray-200" />
            <button onClick={() => addBlock("pullquote")} className="px-3 py-2 rounded-full text-[12px] font-bold text-gray-600 hover:text-[#8B0000] hover:bg-rose-50 flex items-center gap-1.5 transition-all uppercase tracking-wide cursor-pointer">
              <Quote size={14} /> Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
