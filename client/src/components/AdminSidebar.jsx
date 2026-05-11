"use client";
import { useState, useContext } from "react";
import { SidebarContext } from "@/components/SidebarTrigger";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Folder,
  FileText,
  Users,
  ChevronDown,
  Settings,
  List,
  X,
  User,
  LogOut,
  Activity,
  Megaphone,
  Mail,
  SquarePen,
} from "lucide-react";

const getMenuGroups = (role) => {
  const isAdmin = role === "ADMIN";

  const articleChildren = [
    { title: "All News", url: "/dashboard/posts" },
    { title: "Pending", url: "/dashboard/posts?status=PENDING" },
    { title: "Published", url: "/dashboard/posts?status=PUBLISHED" },
  ];
  if (!isAdmin) {
    articleChildren.push({ title: "Create New", url: "/dashboard/posts/create" });
  }

  return [
    {
      label: "Main Dashboard",
      items: [{ title: "Overview", icon: Activity, url: "/dashboard" }],
    },
    {
      label: "Content Studio",
      items: [
        {
          title: "Articles",
          icon: FileText,
          children: articleChildren,
        },
        {
          title: "Stories",
          icon: SquarePen,
          url: "/dashboard/stories",
        },
        ...(isAdmin
          ? [
              {
                title: "Taxonomy",
                icon: List,
                children: [
                  { title: "Categories", url: "/dashboard/categories" },
                  { title: "Tag Index", url: "/dashboard/tags" },
                ],
              },
            ]
          : []),
      ],
    },
    ...(isAdmin
      ? [
          {
            label: "Advertising",
            items: [
              {
                title: "Ad placements",
                icon: Megaphone,
                children: [
                  { title: "Manage ads & layouts", url: "/dashboard/ads" },
                ],
              },
            ],
          },
          {
            label: "Users & Public",
            items: [
              {
                title: "Team members",
                icon: Users,
                children: [
                  { title: "Reporters List", url: "/dashboard/reporters" },
                  { title: "Our Team", url: "/dashboard/team-members" },
                  { title: "Departments", url: "/dashboard/departments" },
                  { title: "Partners", url: "/dashboard/partners" },
                  { title: "Admin Panel", url: "/dashboard/users" },
                ],
              },
              {
                title: "Public Submissions",
                icon: Folder,
                url: "/dashboard/submissions",
              },
              {
                title: "Subscribers",
                icon: Mail,
                url: "/dashboard/subscribers",
              },
            ],
          },
        ]
      : []),
    {
      label: "Account",
      items: isAdmin
        ? [{ title: "Settings", icon: Settings, url: "/dashboard/settings" }]
        : [{ title: "My account", icon: User, url: "/dashboard/account" }],
    },
  ];
};

/** Match sidebar link including query (e.g. posts filters). */
function childLinkIsActive(pathname, searchParams, childUrl) {
  const [path, queryPart] = childUrl.split("?");
  if (pathname !== path) return false;
  const currentStatus = (searchParams.get("status") || "").toUpperCase();
  if (!queryPart) {
    if (path === "/dashboard/posts") return !currentStatus;
    return true;
  }
  const wanted = (new URLSearchParams(queryPart).get("status") || "").toUpperCase();
  return currentStatus === wanted;
}

export function AdminSidebar({ isOpen: propIsOpen, setIsOpen: propSetIsOpen, user = { role: "REPORTER" } }) {
  const ctx = useContext(SidebarContext);
  const isOpen = ctx ? ctx.isOpen : propIsOpen;
  const setIsOpen = ctx ? ctx.setIsOpen : propSetIsOpen;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const role = user?.role || "REPORTER";
  const menuGroups = getMenuGroups(role);

  const [openMenus, setOpenMenus] = useState({
    Articles: false,
    Taxonomy: false,
    "Ad placements": false,
    "Team members": false,
  });

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLinkClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768 && setIsOpen) {
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    const res = await logoutAction();
    if (res.success) {
      router.push("/login");
    }
  };

  return (
    <div
      id="dashboard-sidebar-nav"
      className={`fixed inset-y-0 left-0 z-50 w-64 min-w-[16rem] shrink-0 bg-[#8B0000] md:border-r border-white/10 min-h-screen flex flex-col text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
    >
      <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex bg-white/10 p-2 rounded-xl text-white">
            <Activity className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[15px] font-bold tracking-tight">
              LabourPulse
            </h2>
            <p className="text-[10px] font-semibold text-white/70 uppercase tracking-widest">
              {role} HUB
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen?.(false)}
          className="md:hidden p-1.5 bg-white/5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 py-6 px-4 flex flex-col gap-8 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="flex flex-col gap-2">
            {group.label && (
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-2 mb-2">
                {group.label}
              </span>
            )}

            {group.items.map((item, itemIdx) => (
              <div key={itemIdx}>
                {item.children ? (
                  <div className="mb-1">
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all duration-200 
                          ${openMenus[item.title] ? "bg-white/10 text-white shadow-sm" : "hover:bg-white/[0.06] text-white/70"}
                        `}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={`w-[18px] h-[18px] ${openMenus[item.title] ? "text-white" : "text-current"}`}
                        />
                        <span className="text-[13px] font-semibold tracking-tight">
                          {item.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-[14px] h-[14px] transition-transform duration-300 ${openMenus[item.title] ? "rotate-180 opacity-100" : "opacity-40"}`}
                      />
                    </button>

                    <div
                      className={`mt-1 flex flex-col pl-9 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${openMenus[item.title] ? "max-h-[22rem] opacity-100 mb-4" : "max-h-0 opacity-0"}`}
                    >
                      {item.children.map((child) => {
                        const isActive = childLinkIsActive(pathname, searchParams, child.url);
                        return (
                          <Link
                            key={child.title}
                            href={child.url}
                            onClick={handleLinkClick}
                            className={`px-3 py-2 block rounded-lg text-[12px] font-medium transition-all duration-200 relative
                                ${isActive ? "bg-white/10 text-white font-bold" : "text-white/60 hover:text-white"}
                              `}
                          >
                            {isActive && (
                              <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-3 bg-white rounded-full" />
                            )}
                            {child.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.url}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 mb-1
                         ${pathname === item.url ? "bg-white/10 text-white font-bold shadow-sm" : "hover:bg-white/[0.06] text-white/70"}
                      `}
                  >
                    <item.icon
                      className={`w-[18px] h-[18px] ${pathname === item.url ? "text-white" : "text-current"}`}
                    />
                    <span className="text-[13px] font-semibold tracking-tight">
                      {item.title}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
}
