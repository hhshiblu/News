"use client";

import { useState } from "react";
import { UserCheck, UserX, Shield, Users, Mail, RefreshCw } from "lucide-react";

export default function UsersManagementPage() {
  const [users, setUsers] = useState([
    { id: "1", name: "Super Admin", email: "news12@gmail.com", role: "ADMIN", status: "ACTIVE" },
    { id: "2", name: "John Doe", email: "author1@news.com", role: "REPORTER", status: "ACTIVE" },
    { id: "3", name: "Jane Smith", email: "author2@news.com", role: "RESEARCH_AUTHOR", status: "PENDING" },
    { id: "4", name: "Bob Fraud", email: "fraud@news.com", role: "REPORTER", status: "BLOCKED" }
  ]);

  const updateStatus = (userId, newStatus) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    alert(`User status changed dynamically to ${newStatus}. Requires backend patch endpoint binding!`);
  };

  const getRoleBadge = (role) => {
      switch(role) {
          case 'ADMIN': return <span className="px-2 py-0.5 rounded bg-purple-100 border border-purple-300 text-purple-800 font-bold text-[10px]">ADMIN</span>;
          case 'REPORTER': return <span className="px-2 py-0.5 rounded bg-blue-100 border border-blue-300 text-blue-800 font-bold text-[10px]">REPORTER</span>;
          case 'RESEARCH_AUTHOR': return <span className="px-2 py-0.5 rounded bg-teal-100 border border-teal-300 text-teal-800 font-bold text-[10px]">RESEARCH AUTHOR</span>;
      }
  };

  const getStatusBadge = (status) => {
      switch(status) {
          case 'ACTIVE': return <span className="inline-flex items-center gap-1 text-emerald-800 font-black"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> ACTIVE</span>;
          case 'PENDING': return <span className="inline-flex items-center gap-1 text-amber-800 font-black"><span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> PENDING</span>;
          case 'BLOCKED': return <span className="inline-flex items-center gap-1 text-red-800 font-black"><span className="w-2 h-2 rounded-full bg-red-600"></span> BLOCKED</span>;
      }
  };

  return (
    <div className="space-y-6 text-black">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight">Author & User Management</h1>
          <p className="text-xs text-black font-medium mt-1">Review pending reporter applications, block abusers, and manage admin privileges.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 border-b border-gray-300 text-[10px] uppercase font-black tracking-wider text-black">
              <tr>
                <th className="px-4 py-3">Account Details</th>
                <th className="px-4 py-3">Assigned Role</th>
                <th className="px-4 py-3">Approve Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${user.role === 'ADMIN' ? 'bg-purple-50/20' : ''}`}>
                  <td className="px-4 py-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-400 flex items-center justify-center font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-sm">{user.name}</span>
                            <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1"><Mail className="w-3 h-3"/> {user.email}</span>
                        </div>
                     </div>
                  </td>
                  <td className="px-4 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-4 py-4 text-xs">{getStatusBadge(user.status)}</td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-xs font-bold font-sans">
                        {user.status === 'PENDING' && (
                           <button onClick={() => updateStatus(user.id, 'ACTIVE')} className="px-3 py-1.5 bg-emerald-600 text-white border border-emerald-800 rounded hover:bg-emerald-700 shadow-sm flex items-center gap-1 transition-colors">
                              <UserCheck className="w-3.5 h-3.5" /> Approve
                           </button>
                        )}
                        {user.status === 'ACTIVE' && user.role !== 'ADMIN' && (
                           <button onClick={() => updateStatus(user.id, 'BLOCKED')} className="px-3 py-1.5 bg-white text-red-700 border border-red-300 rounded hover:bg-red-50 shadow-sm flex items-center gap-1 transition-colors">
                              <UserX className="w-3.5 h-3.5" /> Block Check
                           </button>
                        )}
                        {user.status === 'BLOCKED' && (
                           <button onClick={() => updateStatus(user.id, 'ACTIVE')} className="px-3 py-1.5 bg-white text-amber-700 border border-amber-300 rounded hover:bg-amber-50 shadow-sm flex items-center gap-1 transition-colors">
                              <RefreshCw className="w-3.5 h-3.5" /> Unblock
                           </button>
                        )}
                        {user.role === 'ADMIN' && (
                           <span className="text-purple-700 text-[10px] uppercase font-black tracking-widest flex items-center gap-1 px-2 py-1 bg-purple-50 rounded border border-purple-200">
                             <Shield className="w-3.5 h-3.5" /> Core
                           </span>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
