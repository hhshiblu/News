"use client";
import { useState, useTransition, useEffect } from "react";
import { X, Folder, Image as ImageIcon, Edit, Trash2, PlusCircle, AlertTriangle } from "lucide-react";
import { createCategoryAction } from "@/actions/category.action";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  const [defaultParentId, setDefaultParentId] = useState("");
  
  const [isPending, startTransition] = useTransition();

  const [categories, setCategories] = useState([]);
  
  const fetchCategories = async () => {
      try {
          const res = await fetch("http://localhost:5000/api/v1/admin/categories");
          if(res.ok) {
              const data = await res.json();
              setCategories(data.data || []);
          }
      } catch (e) {
          toast.error("Tree data connection severed.");
      }
  };

  useEffect(() => {
      fetchCategories();
  }, []);

  const openAddModal = (parentId = "") => {
      setDefaultParentId(parentId);
      setIsModalOpen(true);
  };

  const openDeleteModal = (category) => {
      setCategoryToDelete(category);
      setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
      if(categoryToDelete) {
          setCategories(categories.filter(c => c.id !== categoryToDelete.id && c.parentId !== categoryToDelete.id)); 
      }
      setIsDeleteModalOpen(false);
      toast.success("Category deleted successfully!");
  };

  const handleSubmit = async (formData) => {
    startTransition(async () => {
        try {
            const res = await createCategoryAction(formData);
            if(res.success) {
                toast.success("Category created and saved to database.");
                setIsModalOpen(false);
                fetchCategories();
            } else {
                toast.error(res.message || "Failed to create category");
            }
        } catch (e) {
            toast.error("Category action crashed.");
        }
    });
  };

  return (
    <div className="space-y-6 relative text-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Categories Tree</h1>
          <p className="text-xs text-gray-500 mt-1">Hierarchical distribution of the news vertical.</p>
        </div>
        <button onClick={() => openAddModal("")} className="bg-[#00453e] text-white px-4 py-1.5 text-xs rounded shadow hover:bg-[#00453e]/90 font-medium tracking-wide flex items-center gap-2">
           <Folder className="w-3.5 h-3.5" /> Create Category
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-3.5 border-b border-gray-200 bg-gray-50/80 rounded-t-lg">
             <div className="grid grid-cols-12 text-xs font-semibold text-gray-600 tracking-wider">
                 <div className="col-span-6 uppercase">Category Name</div>
                 <div className="col-span-3 uppercase">Total Posts</div>
                 <div className="col-span-3 text-right uppercase">Actions</div>
             </div>
          </div>
          
          <div className="p-4 space-y-3">
             {categories.map(parent => (
               <div key={parent.id} className="relative">
                  <div className="group grid grid-cols-12 items-center border border-gray-200 bg-white rounded-lg p-2.5 hover:bg-gray-50 transition-colors shadow-sm">
                      <div className="col-span-6 flex items-center gap-3">
                          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-1.5 rounded items-center justify-center flex font-medium">
                              {parent.imageUrl ? <ImageIcon className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                          </div>
                          <span className="text-sm font-semibold text-gray-800">{parent.name}</span>
                      </div>
                      <div className="col-span-3 flex items-center text-xs font-medium text-gray-600">
                          <span className="bg-gray-100 px-3 py-0.5 rounded-full border border-gray-200">0 posts</span>
                      </div>
                      <div className="col-span-3 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openAddModal(parent.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded border border-transparent hover:border-emerald-200 transition-colors cursor-pointer" title="Add nested category"><PlusCircle className="w-4 h-4" /></button>
                          <button className="p-1.5 text-blue-600 hover:bg-blue-100 rounded border border-transparent hover:border-blue-200 transition-colors cursor-pointer" title="Edit category"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => openDeleteModal(parent)} className="p-1.5 text-red-600 hover:bg-red-100 rounded border border-transparent hover:border-red-200 transition-colors cursor-pointer" title="Delete category"><Trash2 className="w-4 h-4" /></button>
                      </div>
                  </div>

                  {parent.children && parent.children.length > 0 && (
                      <div className="relative mt-2 ml-[19px] pl-6 border-l-2 border-gray-200 space-y-2 pb-2">
                          {parent.children.map((child) => (
                             <div key={child.id} className="group grid grid-cols-12 items-center bg-gray-50/50 border border-gray-200 rounded-lg p-2 hover:bg-white transition-colors relative">
                                  <div className="absolute -left-[26px] top-1/2 w-6 border-t-2 border-gray-200"></div>
                                  <div className="col-span-6 flex items-center gap-3">
                                      <div className="bg-white text-gray-500 p-1 rounded items-center justify-center flex border border-gray-300">
                                          <Folder className="w-3.5 h-3.5" />
                                      </div>
                                      <span className="text-[13px] font-medium text-gray-700">{child.name}</span>
                                  </div>
                                  <div className="col-span-3 flex items-center text-[11px] font-medium text-gray-600">
                                      <span className="bg-white px-2 py-0.5 rounded-full border border-gray-200">0 posts</span>
                                  </div>
                                  <div className="col-span-3 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button className="p-1.5 text-blue-600 hover:bg-blue-100 rounded border border-transparent hover:border-blue-200 transition-colors cursor-pointer" title="Edit subcategory"><Edit className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => openDeleteModal(child)} className="p-1.5 text-red-600 hover:bg-red-100 rounded border border-transparent hover:border-red-200 transition-colors cursor-pointer" title="Delete subcategory"><Trash2 className="w-3.5 h-3.5" /></button>
                                  </div>
                             </div>
                          ))}
                      </div>
                  )}
               </div>
             ))}
          </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-[15px] font-semibold text-gray-800">Add New Category</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:bg-gray-200 p-1 rounded transition-colors">
                 <X className="w-4 h-4" />
              </button>
            </div>
            
            <form action={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-widest mb-1.5">Category Name</label>
                <input name="name" required type="text" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-[#00453e] focus:ring-1 focus:ring-[#00453e] font-medium text-gray-800 bg-white" placeholder="e.g. Industry & Economy" />
              </div>
              
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-widest mb-1.5">Parent Category (Optional)</label>
                <select name="parentId" defaultValue={defaultParentId} className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-[#00453e] focus:ring-1 focus:ring-[#00453e] font-medium text-gray-800 bg-white">
                  <option value="">-- None (Root Level) --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {defaultParentId && <p className="text-[10px] text-emerald-600 font-medium mt-1">✓ Auto-assigned from tree selected context</p>}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                   Category Image <span className="font-normal normal-case tracking-normal text-gray-400">(BBC specific feature)</span>
                </label>
                <input name="imageFile" type="file" accept="image/*" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-[#00453e] font-medium bg-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer text-gray-600" />
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-gray-200 bg-gray-50 -mx-5 px-5 py-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-800 rounded transition-colors shadow-sm">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="bg-[#00453e] text-white px-5 py-1.5 text-xs rounded border border-[#00453e] shadow flex items-center justify-center font-medium tracking-wide disabled:opacity-50 hover:bg-[#00453e]/90">
                  {isPending ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
           <div className="bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-sm p-6 text-center">
               <div className="mx-auto w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 border border-red-200">
                   <AlertTriangle className="w-6 h-6" />
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-2">Are you sure?</h3>
               <p className="text-sm text-gray-500 font-medium mb-6">You are about to permanently delete <strong className="font-semibold text-gray-800">{categoryToDelete?.name}</strong>. This act is absolutely irreversible.</p>
               <div className="flex gap-3 justify-center w-full">
                   <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm rounded shadow-sm">Abort</button>
                   <button onClick={confirmDelete} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded shadow-sm">Yes, Delete It</button>
               </div>
           </div>
        </div>
      )}

    </div>
  );
}
