"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import SidebarTrigger, { SidebarProvider } from "@/components/SidebarTrigger";
import { Toaster } from "sonner";
import { Search, Bell, User, ChevronDown, Settings, LogOut } from "lucide-react";
import { Suspense, useState } from "react";
import { logoutAction } from "@/actions/auth";
import { useRouter } from "next/navigation";

export default function DashboardShell({ user, children }) {
  const [openProfile, setOpenProfile] = useState(false);
  const router = useRouter();

  const onLogout = async () => {
    await logoutAction();
    router.push("/");
  };

  return (
    <SidebarProvider
      sidebar={
        <Suspense
          fallback={
            <div className="fixed inset-y-0 left-0 z-50 w-64 min-w-[16rem] shrink-0 bg-[#8B0000] md:relative min-h-screen border-r border-white/10" />
          }
        >
          <AdminSidebar user={user} />
        </Suspense>
      }
    >
      <header className="flex h-[64px] shrink-0 items-center justify-between border-b border-red-800 px-3 lg:px-6 bg-primary z-20 w-full sticky top-0">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="hidden md:flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 w-64 transition-all focus-within:ring-2 focus-within:ring-white/30">
            <Search className="w-4 h-4 text-white/70" />
            <input
              type="text"
              placeholder="Global search..."
              className="bg-transparent border-none outline-none text-xs text-white font-medium placeholder:text-white/70 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 relative">
          <button className="p-2 text-white/90 hover:bg-white/10 rounded-lg transition-all relative cursor-pointer">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-300 border-2 border-primary rounded-full" />
          </button>

          <button
            onClick={() => setOpenProfile((p) => !p)}
            className="flex items-center gap-2 pl-1 group cursor-pointer rounded-lg px-2 py-1 hover:bg-white/10 transition-colors"
          >
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-[11px] font-bold text-white leading-tight tracking-tight">
                {user?.name || "Guest User"}
              </span>
              <span className="text-[9px] uppercase font-bold text-white/80 tracking-wider font-mono">
                {user?.role || "GUEST"}
              </span>
            </div>
            <div className="p-1 px-1.5 border border-white/20 rounded-lg bg-white/10 text-white font-bold text-sm shadow-sm transition-transform group-hover:scale-105">
              {user?.name?.charAt(0) || <User className="w-5 h-5 opacity-40" />}
            </div>
            <ChevronDown className="w-3 h-3 text-white/80" />
          </button>

          {openProfile && (
            <div className="absolute right-0 top-[56px] w-40 rounded-md border border-gray-200 bg-white shadow-xl overflow-hidden z-50">
              <button
                onClick={() => {
                  setOpenProfile(false);
                  router.push("/dashboard/settings");
                }}
                className="w-full px-3 py-2 text-left text-[11px] font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Settings className="w-3.5 h-3.5" /> Settings
              </button>
              <button
                onClick={onLogout}
                className="w-full px-3 py-2 text-left text-[11px] font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-auto bg-gray-50 px-2 py-3 sm:px-3 sm:py-4 md:px-4 w-full custom-scrollbar">
        <div className="mx-auto max-w-7xl w-full min-w-0">{children}</div>
      </main>

      <Toaster position="top-right" richColors closeButton />
    </SidebarProvider>
  );
}
