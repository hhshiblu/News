"use client";

import { Suspense, useState, useEffect } from "react";
import { Check, X, Shield, Users, Mail, RefreshCw, Edit, Eye, Activity, AlertCircle, Clock, User } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

function AuthorsManagementPageContent() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filterParam = searchParams.get('status') || 'ALL';

  // Fetch from Express API dynamically
  const fetchAuthors = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams();
      queryParams.append('roleIn', 'REPORTER,RESEARCH_AUTHOR');
      if (filterParam !== 'ALL') {
          queryParams.append('status', filterParam);
      }

      // FULLY DYNAMIC FETCH EXPECTATION
      const res = await fetch(`http://localhost:5000/api/v1/admin/users?${queryParams.toString()}`);
      
      if(res.ok) {
          const fetchedData = await res.json();
          setAuthors(fetchedData.data || []);
      } else {
          setAuthors([]); // Fallback specifically to null mapping if query fails per instructions
      }
    } catch (e) {
      toast.error("Database unavailable. Data is currently disconnected.");
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, [filterParam]); // Re-fetches immediately upon URL query change exactly as requested

  const updateStatus = async (authorId, newStatus) => {
    try {
        const res = await fetch(`http://localhost:5000/api/v1/admin/users/${authorId}`, { 
            method: 'PATCH', 
            body: JSON.stringify({ status: newStatus }), 
            headers: { 'Content-Type': 'application/json' }
        });
        if(res.ok) {
             setAuthors(authors.map(u => u.id === authorId ? { ...u, status: newStatus } : u));
             toast.success(`Author status changed successfully!`);
        } else {
             toast.error(`Database rejected the operation.`);
        }
    } catch (e) {
        toast.error("Live patch operation failed.");
    }
  };

  const getRoleBadge = (role) => {
      switch(role) {
          case 'REPORTER': return <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-semibold text-[10px] tracking-wide">REPORTER</span>;
          case 'RESEARCH_AUTHOR': return <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-700 font-semibold text-[10px] tracking-wide">RESEARCH AUTHOR</span>;
          default: return null;
      }
  };

  const getStatusBadge = (status) => {
      switch(status) {
          case 'ACTIVE': return <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] uppercase tracking-wide"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ACTIVE</span>;
          case 'PENDING': return <span className="inline-flex items-center gap-1.5 text-amber-600 font-bold text-[11px] uppercase tracking-wide"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> PENDING</span>;
          case 'BLOCKED': return <span className="inline-flex items-center gap-1.5 text-red-700 font-bold text-[11px] uppercase tracking-wide"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> BLOCKED</span>;
      }
  };

  const setFilterParam = (statusVal) => {
      const params = new URLSearchParams(searchParams);
      if(statusVal === 'ALL') {
          params.delete('status');
      } else {
          params.set('status', statusVal);
      }
      router.replace(`${pathname}?${params.toString()}`);
  }

  // Cards Math -> No longer strictly math on displayed results alone, normally you'd query aggregated stats from DB. Falling back to local array length is fine for simple pagination.
  const activeCount = authors.filter(a => a.status === "ACTIVE").length;
  const pendingCount = authors.filter(a => a.status === "PENDING").length;
  const blockedCount = authors.filter(a => a.status === "BLOCKED").length;

  return (
    <div className="space-y-6 text-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2"><Edit className="w-5 h-5 text-emerald-500" /> Account Moderation Hub</h1>
          <p className="text-[13px] text-gray-500 font-medium mt-1">Review pending reporters, block malicious writers, and approve research analysts.</p>
        </div>
      </div>

      {/* Info Cards Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-[3px] border-l-blue-600 group hover:bg-gray-50/50 transition-all">
            <div className="bg-blue-50 p-2.5 rounded-full text-blue-600 transition-transform group-hover:scale-110"><Users className="w-5 h-5" /></div>
            <div><p className="text-[11px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1">Total Context</p><p className="text-2xl font-black text-gray-900 leading-none">{authors.length}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-[3px] border-l-emerald-600 group hover:bg-gray-50/50 transition-all">
            <div className="bg-emerald-50 p-2.5 rounded-full text-emerald-600 transition-transform group-hover:scale-110"><Activity className="w-5 h-5" /></div>
            <div><p className="text-[11px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1">Active View</p><p className="text-2xl font-black text-gray-900 leading-none">{activeCount}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-[3px] border-l-amber-500 group hover:bg-gray-50/50 transition-all">
            <div className="bg-amber-50 p-2.5 rounded-full text-amber-600 transition-transform group-hover:scale-110"><Clock className="w-5 h-5" /></div>
            <div><p className="text-[11px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1">Pending Set</p><p className="text-2xl font-black text-gray-900 leading-none">{pendingCount}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-[3px] border-l-red-600">
            <div className="bg-red-50 p-2.5 rounded-full text-red-600"><AlertCircle className="w-5 h-5" /></div>
            <div><p className="text-[11px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1">Blocked Accounts</p><p className="text-2xl font-black text-gray-900">{blockedCount}</p></div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        
        {/* URL Params Filters Top Bar */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50 flex gap-2">
           <button onClick={() => setFilterParam("ALL")} className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${filterParam === 'ALL' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}>All Matches</button>
           <button onClick={() => setFilterParam("ACTIVE")} className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${filterParam === 'ACTIVE' ? 'bg-emerald-700 text-white border-emerald-800' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}>Active Status</button>
           <button onClick={() => setFilterParam("PENDING")} className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all flex items-center gap-1 cursor-pointer ${filterParam === 'PENDING' ? 'bg-amber-500 text-white border-amber-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}>Pending Reviews {filterParam === 'PENDING' && <span className="w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px]">{authors.length}</span>}</button>
           <button onClick={() => setFilterParam("BLOCKED")} className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${filterParam === 'BLOCKED' ? 'bg-red-700 text-white border-red-800' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}>Blocked Logs</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#fcfdfd] border-b border-gray-200 text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
              <tr>
                <th className="px-4 py-3">UUID & Identity</th>
                <th className="px-4 py-3">Assigned Role</th>
                <th className="px-4 py-3">Publishing Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {authors.map(author => (
                <tr key={author.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold border">
                            {author.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm text-gray-800">{author.name}</span>
                            <span className="text-[10px] font-medium text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3"/> {author.email} <span className="text-gray-400 font-mono">({author.id})</span></span>
                        </div>
                     </div>
                  </td>
                  <td className="px-4 py-3">{getRoleBadge(author.role)}</td>
                  <td className="px-4 py-3 text-xs">{getStatusBadge(author.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs font-medium">
                        
                        <button onClick={() => setSelectedAuthor(author)} className="p-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition-colors cursor-pointer" title="View Full Details">
                            <Eye className="w-4 h-4" />
                        </button>

                        {author.status === 'PENDING' && (
                           <button onClick={() => updateStatus(author.id, 'ACTIVE')} className="p-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all cursor-pointer" title="Approve Writer">
                              <Check className="w-4 h-4" />
                           </button>
                        )}
                        {author.status === 'ACTIVE' && (
                           <button onClick={() => updateStatus(author.id, 'BLOCKED')} className="p-1.5 bg-red-50 text-red-700 border border-red-200 rounded-xl hover:bg-red-100 transition-all cursor-pointer" title="Suspend Writer">
                              <X className="w-4 h-4" />
                           </button>
                        )}
                        {author.status === 'BLOCKED' && (
                           <button onClick={() => updateStatus(author.id, 'ACTIVE')} className="p-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all cursor-pointer" title="Restore Rights">
                              <RefreshCw className="w-4 h-4" />
                           </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
              {authors.length === 0 && (
                  <tr>
                      <td colSpan="4" className="py-8 text-center text-sm text-gray-500 font-medium">No authors found for specific filter.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW AUTHOR MODAL */}
      {selectedAuthor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-gray-200 border border-gray-300 text-gray-700 flex items-center justify-center font-bold text-lg">
                     {selectedAuthor.name.charAt(0)}
                 </div>
                 <div>
                    <h2 className="text-lg font-bold text-gray-900">{selectedAuthor.name}</h2>
                    <p className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5 mt-0.5"><Mail className="w-3.5 h-3.5" /> {selectedAuthor.email}</p>
                 </div>
              </div>
              <button onClick={() => setSelectedAuthor(null)} className="text-gray-400 hover:bg-gray-200 p-1.5 rounded transition-colors cursor-pointer border border-transparent hover:border-gray-300">
                 <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status Alignment</p>
                       <div>{getStatusBadge(selectedAuthor.status)}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Assigned Role</p>
                       <div>{getRoleBadge(selectedAuthor.role)}</div>
                    </div>
                </div>
                
                <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">User Biography</p>
                    <p className="text-sm font-medium text-gray-800 bg-gray-50 p-3 rounded border border-gray-100 leading-relaxed">{selectedAuthor.bio || 'No biography attached to this account.'}</p>
                </div>

                <div className="pt-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">System Identifiers</p>
                    <div className="text-[11px] font-mono font-medium text-gray-600 bg-gray-100 px-3 py-2 rounded border border-gray-200">
                        {selectedAuthor.id}
                    </div>
                </div>
            </div>
            
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
               <button onClick={() => setSelectedAuthor(null)} className="px-4 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors shadow-sm rounded cursor-pointer">
                  Close Dashboard
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function AuthorsManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-gray-500 text-sm font-medium animate-pulse">Loading authors…</div>
      }
    >
      <AuthorsManagementPageContent />
    </Suspense>
  );
}
