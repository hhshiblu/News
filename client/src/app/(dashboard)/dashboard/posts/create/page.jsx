"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Type, Video, Trash2, Upload, Tag, Quote, Activity, Shield, X, ChevronDown, MousePointer2, FileText, Image as ImageIcon } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Drop-in React 19 replacement component 
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false, loading: () => <p className="text-xs text-gray-500 font-medium">Loading Editor...</p> });

const normalizeEditorHtml = (value) => {
  if (typeof value !== "string") return value;
  return value
    .replace(/&nbsp;|&#160;|\u00A0/g, " ")
    .replace(/white-space\s*:\s*nowrap;?/gi, "");
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
  
  const [isPhotoStory, setIsPhotoStory] = useState(false);
  const [countryTag, setCountryTag] = useState("");
  const [subcategory, setSubcategory] = useState("");

  // New storage for the Thumbnail / Featured Image
  const [featuredImage, setFeaturedImage] = useState("");
  const [featuredImageFile, setFeaturedImageFile] = useState(null);

  const [categories, setCategories] = useState([]);
  const [tagsList, setTagsList] = useState([]);

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImageFile(file);
      const url = URL.createObjectURL(file);
      setFeaturedImage(url);
    }
  };

  useEffect(() => {
     fetch("http://localhost:5000/api/v1/public/categories")
       .then(res => res.json())
       .then(data => { if(data.success) setCategories(data.data); });

     fetch("http://localhost:5000/api/v1/public/tags")
       .then(res => res.json())
       .then(data => { if(data.success) setTagsList(data.data); });
  }, []);

  const [blocks, setBlocks] = useState([
    { id: Date.now(), type: "text", content: "" }
  ]);

  const toggleTag = (tagId) => {
      setSelectedTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]);
  };

  const addBlock = (type) => {
    setBlocks([...blocks, { id: Date.now(), type, content: "", file: null, metaInfo: "" }]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !parentCategoryId) {
        toast.error("Title and Category are required!");
        return;
    }

    const toastId = toast.loading("Processing submission...");
    
    try {
        let uploadedFeaturedImage = "";
        if (featuredImageFile) {
            const formData = new FormData();
            formData.append('media', featuredImageFile);
            const uploadRes = await fetch("http://localhost:5000/api/v1/admin/upload", { 
                method: 'POST', 
                body: formData,
                credentials: 'include'
            });
            const uploadData = await uploadRes.json();
            if (uploadData.success && uploadData.url) {
                uploadedFeaturedImage = 'http://localhost:5000' + uploadData.url;
            }
        }

        const parsedBlocks = [];
        for (const b of blocks) {
            if ((b.type === 'image' || b.type === 'video') && b.file) {
                const formData = new FormData();
                formData.append('media', b.file);
                const uploadRes = await fetch("http://localhost:5000/api/v1/admin/upload", { 
                    method: 'POST', 
                    body: formData,
                    credentials: 'include'
                });
                const uploadData = await uploadRes.json();
                if (uploadData.success && uploadData.url) {
                    parsedBlocks.push({ type: b.type, content: 'http://localhost:5000' + uploadData.url, metaInfo: b.metaInfo });
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
          isPhotoStory,
          countryTag, subcategory,
          content: parsedBlocks,
          status: 'PENDING'
        };
        
        const res = await fetch("http://localhost:5000/api/v1/admin/posts", { 
            method: 'POST', 
            body: JSON.stringify(payload), 
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if(res.ok) {
            toast.success("Article submitted for moderation!");
            router.push("/dashboard/posts");
        } else {
            toast.error("Failed to save article.");
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
    <div className="max-w-6xl mx-auto pb-28 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none">Create Post</h1>
          <p className="text-[11px] text-gray-500 mt-1">Compact editor for fast newsroom publishing.</p>
        </div>
        <button onClick={handleSubmit} className="px-5 py-2.5 bg-primary text-white font-bold text-[11px] rounded-lg hover:bg-[#8B0000] transition-all uppercase tracking-widest cursor-pointer flex items-center gap-2">
          <MousePointer2 size={14} /> Create Post
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        
        {/* Main Editor Section */}
        <div className="xl:col-span-2 space-y-4">
            
            {/* Core Metadata */}
            <div className="bg-white p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Headline</label>
                   <input 
                     value={title} onChange={e => setTitle(e.target.value)}
                     className="w-full border-none p-0 text-2xl font-black focus:ring-0 placeholder:text-gray-200 bg-transparent text-gray-900 tracking-tight" 
                     placeholder="The most compelling headline..." 
                   />
                </div>

                <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Sub-headline</label>
                   <textarea 
                     value={subtitle} onChange={e => setSubtitle(e.target.value)}
                     className="w-full border-none p-0 text-base font-bold focus:ring-0 placeholder:text-gray-200 bg-transparent text-gray-600 tracking-tight min-h-[40px] resize-none" 
                     placeholder="Add secondary context or a dekko..." 
                   />
                </div>

                <div className="h-px bg-gray-50" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Primary Category</label>
                       <select value={parentCategoryId} onChange={e => { setParentCategoryId(e.target.value); setChildCategoryId(""); }} className="w-full border-gray-100 bg-gray-50 p-3 text-[13px] font-bold rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all cursor-pointer">
                          <option value="">Select Category...</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Subcategory</label>
                       <select 
                        value={childCategoryId} 
                        onChange={e => {
                            const selectedId = e.target.value;
                            setChildCategoryId(selectedId);
                            if (selectedId) {
                                const parent = categories.find(c => c.id === parentCategoryId);
                                const child = parent?.children?.find(ch => ch.id === selectedId);
                                if (child) setSubcategory(child.name);
                            } else {
                                setSubcategory("");
                            }
                        }} 
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
            </div>

            {/* Featured Image / Thumbnail Upload */}
            <div className="bg-white p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Thumbnail / Featured Image</label>
                    {featuredImage && (
                        <button onClick={() => { setFeaturedImage(""); setFeaturedImageFile(null); }} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 transition-colors">
                            Change Image
                        </button>
                    )}
                </div>
                
                {featuredImage ? (
                    <div className="relative group rounded-2xl overflow-hidden border border-gray-100 aspect-video">
                        <img src={featuredImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Featured Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <Trash2 onClick={() => { setFeaturedImage(""); setFeaturedImageFile(null); }} className="text-white cursor-pointer hover:text-rose-400 transition-colors" size={32} />
                        </div>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/30 hover:bg-emerald-50/30 hover:border-emerald-200 cursor-pointer transition-all">
                        <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
                            <Upload className="w-8 h-8 text-emerald-500" />
                        </div>
                        <span className="text-[11px] font-black text-gray-600 uppercase tracking-[0.2em]">Upload Article Header</span>
                        <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest mt-2">Recommended: 1200 x 630px</span>
                        <input type="file" className="hidden" onChange={handleFeaturedImageChange} accept="image/*" />
                    </label>
                )}
                
                <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Hero Caption</label>
                   <input 
                     value={heroCaption} onChange={e => setHeroCaption(e.target.value)}
                     className="w-full border-none p-0 text-xs font-medium focus:ring-0 placeholder:text-gray-200 bg-transparent text-gray-500 italic" 
                     placeholder="Credits or description for the featured image..." 
                   />
                </div>
            </div>

            {/* Block Builder */}
            <div className="bg-white p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500" /> Narrative Blocks
                    </h2>
                </div>

                <div className="space-y-4">
                    {blocks.map((block) => (
                        <div key={block.id} className="group relative bg-gray-50/50 p-5 rounded-2xl border border-transparent hover:border-emerald-200 transition-all">
                            
                            {block.type === 'text' && (
                                <ReactQuill 
                                    theme="snow"
                                    value={block.content}
                                    onChange={(v) => updateBlockContent(block.id, v)}
                                    modules={modules}
                                    className="bg-white rounded-xl overflow-hidden border border-gray-100 "
                                />
                            )}

                            {block.type === 'image' && (
                                <div className="space-y-4 text-center">
                                    {block.content ? (
                                        <div className="relative rounded-xl overflow-hidden border border-gray-200 max-h-80 mx-auto w-fit">
                                            <img src={block.content} className="max-h-80 w-auto object-contain" />
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-200 rounded-2xl bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                            <SquarePen className="w-8 h-8 text-gray-300 mb-2" />
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Resource</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileChange(block.id, e)} />
                                        </label>
                                    )}
                                    <input 
                                        type="text" 
                                        placeholder="Caption for this image..." 
                                        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-medium outline-none focus:ring-1 focus:ring-emerald-500" 
                                        value={block.metaInfo} 
                                        onChange={e => setBlocks(blocks.map(b => b.id === block.id ? {...b, metaInfo: e.target.value} : b))}
                                    />
                                </div>
                            )}

                            {block.type === 'pullquote' && (
                                <div className="bg-white p-6 rounded-xl border-l-4 border-emerald-500 shadow-sm space-y-3">
                                    <Quote className="w-5 h-5 text-emerald-200" />
                                    <textarea 
                                        placeholder="Enter the standout quote..."
                                        className="w-full text-lg font-bold text-emerald-900 border-none p-0 outline-none bg-transparent placeholder:text-gray-200"
                                        value={block.content}
                                        onChange={e => updateBlockContent(block.id, e.target.value)}
                                    />
                                    <input 
                                        placeholder="Attribution (e.g. Name, Position)"
                                        className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest border-none p-0 outline-none bg-transparent mt-2"
                                        value={block.metaInfo}
                                        onChange={e => setBlocks(blocks.map(b => b.id === block.id ? {...b, metaInfo: e.target.value} : b))}
                                    />
                                </div>
                            )}

                            <button onClick={() => removeBlock(block.id)} className="absolute top-2 right-2 p-1.5 bg-white text-gray-300 hover:text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-gray-100">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-4">
            
            {/* Publication Config */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-50 pb-3">Publication Config</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                  <strong className="text-gray-700">Featured home cards, Must read, Breaking:</strong> only an{" "}
                  <strong>admin</strong> can set these after your story is in the system—open{" "}
                  <strong>Edit post</strong> from the posts list.
                </p>
                <div className="space-y-4 pt-2">
                    <label className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                            <FileText className={`w-4 h-4 transition-colors ${isPhotoStory ? 'text-purple-500' : 'text-gray-300'}`} />
                            <span className="text-xs font-bold text-gray-700">Photo Story Mode</span>
                        </div>
                        <input type="checkbox" checked={isPhotoStory} onChange={e => setIsPhotoStory(e.target.checked)} className="rounded text-purple-600 focus:ring-purple-500 border-gray-300" />
                    </label>
                </div>

                <div className="h-px bg-gray-50" />

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Shield size={12}/> Geopolitical Tag</label>
                    <input value={countryTag} onChange={e => setCountryTag(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="e.g. USA, Bangladesh, EU" />
                </div>
            </div>

            {/* Taxonomy & Metadata */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-[0.2em] flex items-center gap-2.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    Taxonomy & Metadata
                </h3>
                
                <div className="space-y-5">
                    <div className="relative group">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Tags</label>
                        <select 
                            value=""
                            onChange={e => {
                                if (e.target.value && !selectedTags.includes(e.target.value)) {
                                    setSelectedTags([...selectedTags, e.target.value]);
                                }
                            }}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-bold text-gray-700 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all cursor-pointer appearance-none"
                        >
                            <option value="">{tagsList.length === 0 ? 'Synchronizing tags...' : 'Search tags from database...'}</option>
                            {tagsList
                              .filter((tag) => !["breaking-news", "breaking"].includes(tag.slug))
                              .map((tag) => (
                                <option key={tag.id} value={tag.id}>
                                  {tag.name}
                                </option>
                              ))}
                        </select>
                        <div className="absolute right-5 bottom-4 pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-2">
                        {selectedTags.length === 0 ? (
                            <div className="w-full py-10 border-2 border-dashed border-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-300">
                                <Tag size={24} className="mb-2 opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-widest">No tags indexed</p>
                            </div>
                        ) : selectedTags.map(tagId => {
                            const tag = tagsList.find(t => t.id === tagId);
                            return tag ? (
                                <span key={tagId} className="px-4 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-xl border border-emerald-100/50 flex items-center gap-2.5 group hover:bg-emerald-100 hover:border-emerald-200 transition-all shadow-sm">
                                    {tag.name}
                                    <button onClick={() => setSelectedTags(selectedTags.filter(id => id !== tagId))} className="text-emerald-300 hover:text-rose-500 transition-colors cursor-pointer p-0.5">
                                        <X size={14}/>
                                    </button>
                                </span>
                            ) : null;
                        })}
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white border border-gray-200 shadow-xl rounded-xl px-2 py-2 flex items-center gap-1">
          <button onClick={() => addBlock("text")} className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5">
            <Type size={14} /> Text
          </button>
          <button onClick={() => addBlock("image")} className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5">
            <ImageIcon size={14} /> Image
          </button>
          <button onClick={() => addBlock("pullquote")} className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5">
            <Quote size={14} /> Quote
          </button>
          <button onClick={() => addBlock("video")} className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5">
            <Video size={14} /> Video
          </button>
        </div>
      </div>
    </div>
  );
}
