import { Mail, Calendar, DownloadCloud } from "lucide-react";
import { cookies } from "next/headers";

export default async function SubscribersPage() {
    let subscribers = [];
    try {
        const cookieStore = await cookies();
        const res = await fetch("http://localhost:5000/api/v1/admin/newsletter", {
            headers: { Cookie: cookieStore.toString() },
            cache: "no-store",
        });
        if(res.ok) {
            const data = await res.json();
            subscribers = data.subscribers || [];
        }
    } catch(err) {
        console.error("Networking error getting subscribers");
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                      <Mail className="text-emerald-500" size={32}/>
                      Newsletter Subscribers
                   </h1>
                   <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-widest">Manage email marketing campaigns</p>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden p-8">
               {subscribers.length === 0 ? (
                   <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-sm">No subscribers found in database</div>
               ) : (
                   <div className="overflow-x-auto custom-scrollbar">
                       <table className="w-full text-left text-sm text-gray-600 border-collapse">
                           <thead className="bg-gray-50/50 text-[11px] uppercase font-black text-gray-400 tracking-[0.1em]">
                              <tr>
                                  <th className="px-8 py-5 border-b border-gray-50">Email Address</th>
                                  <th className="px-8 py-5 border-b border-gray-50">Platform Subscription Date</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                               {subscribers.map((sub) => (
                                   <tr key={sub.id} className="hover:bg-gray-50/30 transition-all">
                                      <td className="px-8 py-5 font-bold text-gray-900">{sub.email}</td>
                                      <td className="px-8 py-5 font-medium flex items-center gap-2">
                                          <Calendar size={14} className="text-emerald-500"/>
                                          {new Date(sub.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                      </td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>
               )}
            </div>
        </div>
    );
}
