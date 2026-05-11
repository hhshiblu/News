"use client";

import { useState, useEffect, use } from "react";
import dynamic from "next/dynamic";
import { Type, Trash2, Upload, MousePointer2, Image as ImageIcon, X, SquarePen, ArrowLeft } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false, loading: () => <p className="text-[12px] text-gray-500 font-medium">Loading Editor...</p> });
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const API_ORIGIN = API_BASE.replace(/\/api\/v1\/?$/, "");
const makeBlockId = () => typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

const normalizeEditorHtml = (value) => {
  if (typeof value !== "string") return value;
  return value.replace(/&nbsp;|&#160;|\u00A0/g, " ").replace(/white-space\s*:\s*nowrap;?/gi, "");
};

export default function EditStoryPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [thumbnailImageFile, setThumbnailImageFile] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/stories/${id}`, { credentials: 'include' });
        const result = await res.json();
        if (result.success && result.data) {
          setTitle(result.data.title);
          setThumbnailImage(result.data.thumbnailImage);
          // Assuming content is already an array of blocks
          setBlocks(result.data.content.map(b => ({ ...b, id: makeBlockId() })));
        } else {
          toast.error("Failed to load story");
          router.push("/dashboard/stories");
        }
      } catch (e) {
        toast.error("Error fetching story");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStory();
  }, [id, router]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailImageFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailImage(url);
    }
  };

  const addBlock = (type) => {
    setBlocks((prev) => [...prev, { id: makeBlockId(), type, content: "", file: null }]);
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
    if (!title) {
        toast.error("Title is required!");
        return;
    }

    const toastId = toast.loading("Updating story...");
    
    try {
        const formData = new FormData();
        formData.append('title', title);
        if (thumbnailImageFile) {
            formData.append('thumbnail', thumbnailImageFile);
        }

        const parsedBlocks = [];
        for (const b of blocks) {
            if (b.type === 'image' && b.file) {
                const imgFormData = new FormData();
                imgFormData.append('media', b.file);
                const uploadRes = await fetch(`${API_BASE}/admin/upload`, { 
                    method: 'POST', 
                    body: imgFormData,
                    credentials: 'include'
                });
                const uploadData = await uploadRes.json();
                if (uploadData.success && uploadData.url) {
                    parsedBlocks.push({ type: b.type, content: API_ORIGIN + uploadData.url });
                }
            } else {
                parsedBlocks.push({
                  type: b.type,
                  content: b.type === "text" ? normalizeEditorHtml(b.content) : b.content
                });
            }
        }
        
        formData.append('content', JSON.stringify(parsedBlocks));

        const res = await fetch(`${API_BASE}/admin/stories/${id}`, { 
            method: 'PATCH', 
            body: formData, 
            credentials: 'include'
        });
        const result = await res.json().catch(() => ({}));

        if(res.ok) {
            toast.success("Story updated successfully!");
            router.push("/dashboard/stories");
        } else {
            toast.error(result?.message || "Failed to update story.");
        }
    } catch(e) {
        toast.error("An error occurred during update.");
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

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="w-full px-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#f8fafc] min-h-screen pt-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
           <Link href="/dashboard/stories" className="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors">
              <ArrowLeft size={14} /> Back to stories
           </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <SquarePen size={24} />
             </div>
             <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">Edit Story</h1>
                <p className="text-xs text-gray-500 font-medium">Update your story narrative</p>
             </div>
          </div>
          <button onClick={handleSubmit} className="px-8 py-3 bg-primary text-white font-black text-xs rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer active:scale-95">
            <MousePointer2 size={16} /> Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
              <div className="relative">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block px-1">Story Title</label>
                <input 
                  value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full bg-transparent border-0 border-b-2 border-gray-100 px-1 py-3 text-lg font-bold focus:ring-0 focus:border-primary placeholder:text-gray-200 text-gray-900 transition-colors outline-none" 
                  placeholder="Enter a compelling title..." 
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Story Content</label>
                </div>
                <div className="space-y-6">
                   {blocks.map((block, idx) => (
                     <div key={block.id} className="group relative bg-gray-50/50 border border-gray-100 p-5 rounded-2xl hover:border-primary/20 hover:bg-white hover:shadow-md transition-all duration-300">
                        <div className="absolute -left-3 -top-3 w-8 h-8 bg-gray-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black shadow-lg border-4 border-white z-10">
                           {idx + 1}
                        </div>
                        
                        {block.type === 'text' && (
                          <ReactQuill 
                            theme="snow"
                            value={block.content}
                            onChange={(v) => updateBlockContent(block.id, v)}
                            modules={modules}
                            className="bg-transparent [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-gray-100/50 [&_.ql-toolbar]:rounded-xl [&_.ql-container]:border-none [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-sm [&_.ql-editor]:text-gray-800"
                          />
                        )}

                        {block.type === 'image' && (
                          <div className="text-center">
                            {block.content ? (
                              <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white p-2 max-w-md mx-auto">
                                 <img src={block.content} className="rounded-xl w-full object-cover max-h-64" alt="" />
                                 <button onClick={() => removeBlock(block.id)} className="absolute top-4 right-4 p-2 bg-white/90 text-red-600 rounded-xl shadow-lg hover:bg-red-600 hover:text-white transition-all">
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-3xl bg-white hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all">
                                 <div className="p-4 bg-gray-50 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                    <ImageIcon className="w-6 h-6 text-gray-400" />
                                 </div>
                                 <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Upload Content Image</span>
                                 <input type="file" className="hidden" onChange={(e) => handleFileChange(block.id, e)} accept="image/*" />
                              </label>
                            )}
                          </div>
                        )}

                        <button onClick={() => removeBlock(block.id)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={16} />
                        </button>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 block">Story Thumbnail</label>
               {thumbnailImage ? (
                 <div className="relative group rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-square bg-gray-50">
                    <img src={thumbnailImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <button onClick={() => { setThumbnailImage(""); setThumbnailImageFile(null); }} className="p-3 bg-white text-red-600 rounded-2xl shadow-xl hover:bg-red-600 hover:text-white transition-all transform hover:rotate-12">
                          <Trash2 size={20} />
                       </button>
                    </div>
                 </div>
               ) : (
                 <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 hover:bg-white hover:border-primary/40 cursor-pointer transition-all aspect-square group">
                    <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                       <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest text-center">Upload Cover Thumbnail</span>
                    <input type="file" className="hidden" onChange={handleThumbnailChange} accept="image/*" />
                 </label>
               )}
            </div>
          </div>
        </div>

        {/* Floating Controls */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
           <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl px-2 py-2 flex items-center gap-1 shadow-black/5">
              <button onClick={() => addBlock("text")} className="px-5 py-2.5 rounded-xl text-[10px] font-black text-gray-600 hover:text-primary hover:bg-primary/5 flex items-center gap-2 transition-all uppercase tracking-widest">
                <Type size={14} /> Add Text
              </button>
              <div className="w-px h-6 bg-gray-100 mx-1" />
              <button onClick={() => addBlock("image")} className="px-5 py-2.5 rounded-xl text-[10px] font-black text-gray-600 hover:text-primary hover:bg-primary/5 flex items-center gap-2 transition-all uppercase tracking-widest">
                <ImageIcon size={14} /> Add Image
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
