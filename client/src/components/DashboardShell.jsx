"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import SidebarTrigger, { SidebarProvider } from "@/components/SidebarTrigger";
import { Toaster } from "sonner";
import { Search, Bell, User } from "lucide-react";

export default function DashboardShell({ user, children }) {
  return (
    <SidebarProvider sidebar={<AdminSidebar user={user} />}>
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-gray-100 px-4 lg:px-8 bg-white/80 backdrop-blur-md z-20 w-full sticky top-0">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 w-72 transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500/30">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Global search..."
              className="bg-transparent border-none outline-none text-xs text-gray-600 font-medium placeholder:text-gray-400 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-5">
          <button className="p-2.5 bg-gray-50 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all relative cursor-pointer">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full" />
          </button>

          <div className="h-6 w-px bg-gray-100 mx-1"></div>

          <div className="flex items-center gap-3 pl-1 group cursor-pointer">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-xs font-bold text-gray-900 leading-tight tracking-tight">
                {user?.name || "Guest User"}
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider font-mono">
                {user?.role || "GUEST"}
              </span>
            </div>
            <div className="p-1 px-1.5 border-2 border-emerald-500/20 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm shadow-sm transition-transform group-hover:scale-105">
              {user?.name?.charAt(0) || <User className="w-5 h-5 opacity-40" />}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto bg-gray-50/30 p-4 md:p-8 lg:p-10 w-full custom-scrollbar">
        <div className="mx-auto max-w-7xl w-full">{children}</div>
      </main>

      <Toaster position="top-right" richColors closeButton />
    </SidebarProvider>
  );
}
