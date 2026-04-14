"use client";
import { useState } from "react";
import { Folder, Calendar, Download, UserCircle, Tag, Eye, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SubmissionsClient({ initialSubmissions }) {
    const [submissions, setSubmissions] = useState(initialSubmissions);
    const [viewModalData, setViewModalData] = useState(null);
    const router = useRouter();

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this submission?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/v1/admin/submissions/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setSubmissions(submissions.filter(sub => sub.id !== id));
                toast.success("Submission deleted successfully");
                if (viewModalData && viewModalData.id === id) setViewModalData(null);
            } else {
                toast.error("Failed to delete submission");
            }
        } catch (err) {
            toast.error("Network error");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                      <Folder className="text-emerald-500" size={32}/>
                      Public News Submissions
                   </h1>
                   <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-widest">Review anonymous tips and dropped stories</p>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden p-8">
               {submissions.length === 0 ? (
                   <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-sm">No submissions available</div>
               ) : (
                   <div className="overflow-x-auto custom-scrollbar">
                       <table className="w-full text-left text-sm text-gray-600 border-collapse">
                           <thead className="bg-gray-50/50 text-[11px] uppercase font-black text-gray-400 tracking-[0.1em]">
                              <tr>
                                  <th className="px-6 py-5 border-b border-gray-50">Date</th>
                                  <th className="px-6 py-5 border-b border-gray-50">Topic / Headline</th>
                                  <th className="px-6 py-5 border-b border-gray-50">Sender</th>
                                  <th className="px-6 py-5 border-b border-gray-50">Evidence</th>
                                  <th className="px-6 py-5 border-b border-gray-50 text-right">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                               {submissions.map((sub) => (
                                   <tr key={sub.id} className="hover:bg-gray-50/30 transition-all">
                                      <td className="px-6 py-5 font-medium whitespace-nowrap">
                                          {new Date(sub.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                      </td>
                                      <td className="px-6 py-5 font-bold text-gray-900 max-w-[200px] truncate">
                                          {sub.title || "Untitled Submission"}
                                      </td>
                                      <td className="px-6 py-5 max-w-[150px] truncate font-medium flex items-center gap-2">
                                          <UserCircle size={14} className="text-emerald-500 shrink-0"/>
                                          {sub.senderName || "Anonymous"} 
                                      </td>
                                      <td className="px-6 py-5 font-bold">
                                         {sub.images && sub.images.length > 0 ? (
                                           <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-[10px]">{sub.images.length} Files</span>
                                         ) : <span className="text-gray-300">-</span>}
                                      </td>
                                      <td className="px-6 py-5 text-right whitespace-nowrap">
                                          <div className="flex items-center justify-end gap-2">
                                              <button onClick={() => setViewModalData(sub)} className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
                                                 <Eye size={16}/>
                                              </button>
                                              <button onClick={() => handleDelete(sub.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                                 <Trash2 size={16}/>
                                              </button>
                                          </div>
                                      </td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>
               )}
            </div>

            {/* Modal for Details */}
            {viewModalData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white w-full max-w-3xl rounded-[32px] shadow-2xl relative animate-in fade-in zoom-in-95 my-8 flex flex-col max-h-[90vh]">
                        <div className="p-6 md:p-8 flex items-center justify-between border-b border-gray-100 shrink-0">
                             <div>
                                <h2 className="text-2xl font-black text-gray-900">{viewModalData.title || "Submission Details"}</h2>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Sender: {viewModalData.senderName || "Anonymous"} {viewModalData.senderEmail && `(${viewModalData.senderEmail})`}</p>
                             </div>
                             <button onClick={() => setViewModalData(null)} className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors"><X size={20}/></button>
                        </div>
                        
                        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
                                 {viewModalData.content}
                             </div>

                             {viewModalData.images && viewModalData.images.length > 0 && (
                                 <div>
                                     <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4">Attached Evidence ({viewModalData.images.length})</h3>
                                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                          {viewModalData.images.map((imgUrl, i) => (
                                              <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
                                                  <img src={`http://localhost:5000${imgUrl}`} alt="Evidence" className="w-full h-full object-cover" />
                                                  <a href={`http://localhost:5000/api/v1/admin/submissions/download?file=${encodeURIComponent(imgUrl)}`} 
                                                     target="_blank" 
                                                     rel="noopener noreferrer" 
                                                     className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm cursor-pointer z-10">
                                                      <div className="flex flex-col items-center justify-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                          <Download className="text-white bg-white/20 p-2.5 rounded-full w-12 h-12 hover:bg-emerald-500 hover:text-white transition-all shadow-xl"/>
                                                          <span className="text-[10px] font-black tracking-widest uppercase text-white shadow-sm">Save HQ</span>
                                                      </div>
                                                  </a>
                                              </div>
                                          ))}
                                     </div>
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
