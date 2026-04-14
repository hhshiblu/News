"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, ChevronDown, ChevronRight, Menu, Globe, User, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/data/db";
import { searchArticles } from "@/data/queries";
import LoginModal from "@/components/auth/LoginModal";
import Image from "next/image";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const router = useRouter();
  const sidebarRef = useRef(null);
  const searchInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Persistence: Fetch user on load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/admin/auth/me", { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
        }
      } catch (e) {
        console.error("Session check failed", e);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeSidebar = () => {
    setMobileOpen(false);
    setOpenAccordion(null);
  };

  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch Dynamic Categories for Nav
  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/public/categories");
        if (res.ok) {
          const data = await res.json();
          // Filter only top-level categories for main nav
          const topLevel = data.data.filter(c => !c.parentId);
          setDynamicCategories(topLevel.map(c => ({
            label: c.name,
            slug: c.slug,
            children: c.children?.map(child => ({ label: child.name, slug: child.slug })) || []
          })));
        }
      } catch (e) {
        console.error("Failed fetching nav categories", e);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchNavData();
  }, []);

  const allNavItems = [
    { label: "Home", slug: "", href: "/", children: [] },
    ...dynamicCategories,
  ];

  return (
    <>
      {/* ────────── DESKTOP + MOBILE NAVBAR ────────── */}
      <header className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-shadow duration-300 ${scrolled ? "shadow-md" : ""}`}>
        {/* Utility bar — desktop only */}
        <div className="hidden md:block bg-gray-50 border-b border-gray-200">
          <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-8">
            <span className="text-[11px] text-gray-500 font-[Inter]">
              {new Date().toLocaleDateString("en-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
            <div className="flex items-center gap-4 text-[11px] text-gray-500 font-[Inter]">
              <button className="hover:text-gray-800 transition-colors">বাংলা</button>
              <span className="text-gray-300">|</span>
              <button className="hover:text-gray-800 transition-colors focus:outline-none">English</button>
              <span className="text-gray-300">|</span>
              
              {loadingUser ? (
                 <div className="flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin text-primary" />
                    <span className="opacity-50">Checking...</span>
                 </div>
              ) : user ? (
                <Link 
                  href="/dashboard"
                  className="font-bold text-gray-800 hover:text-primary transition-colors flex items-center gap-1.5 focus:outline-none py-1 px-2.5 bg-gray-100 rounded-full"
                >
                  <div className="w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                    {user.name.charAt(0)}
                  </div>
                  Hi, {user.name.split(' ')[0]}
                </Link>
              ) : (
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="font-semibold hover:text-primary transition-colors flex items-center gap-1 focus:outline-none"
                >
                  <User size={12} className="text-gray-400" />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-center h-[58px] gap-4">
            {/* ── Hamburger (mobile, left) ── */}
            <button
              className="md:hidden flex flex-col gap-[5px] justify-center p-1 flex-shrink-0"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span className="block w-5 h-0.5 bg-gray-800 rounded-full"></span>
              <span className="block w-5 h-0.5 bg-gray-800 rounded-full"></span>
              <span className="block w-5 h-0.5 bg-gray-800 rounded-full"></span>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <span className="bg-primary text-white font-bold text-lg md:text-xl px-2.5 md:px-3 py-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Labour
              </span>
              <span className="text-gray-900 font-bold text-lg md:text-xl pl-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Pulse
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center h-full flex-1 overflow-visible gap-4 ml-6">
              <Link href="/" className="h-full flex items-center px-3 border-b-2 border-primary text-[13px] font-bold text-primary font-[Inter] whitespace-nowrap">
                Home
              </Link>
              <Link href="/breaking" className="h-full flex items-center px-3 text-[13px] font-bold text-breaking hover:text-primary transition-colors font-[Inter] whitespace-nowrap">
                Breaking News
              </Link>
              {dynamicCategories.map((cat) => (
                <div key={cat.slug} className="nav-item flex-shrink-0 group">
                  <div
                    className="h-full flex items-center gap-1 text-[13px] font-bold text-gray-700 hover:text-primary px-3 transition-colors font-[Inter] whitespace-nowrap cursor-default group-hover:text-primary"
                  >
                    {cat.label}
                    {cat.children.length > 0 && <ChevronDown size={12} strokeWidth={2.5} className="group-hover:rotate-180 transition-transform" />}
                  </div>
                  {cat.children.length > 0 && (
                    <div className="mega-menu absolute top-full left-0 bg-white border border-gray-200 border-t-[3px] border-t-primary shadow-2xl z-50 p-6 min-w-[700px] rounded-b-xl">
                      <div className="flex gap-8">
                        {/* Left: Subcategories (Scalable 3-column grid) */}
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 font-[Inter] border-b pb-2">
                             Discover {cat.label}
                          </p>
                          <div className="grid grid-cols-3 gap-x-6 gap-y-1">
                            {cat.children.map((child) => (
                              <Link
                                key={child.slug}
                                href={child.href || `/${cat.slug}/${child.slug}`}
                                className="text-[13px] text-gray-600 hover:text-primary py-2 transition-colors font-[Inter] block group/link flex items-center justify-between"
                              >
                                {child.label}
                                <ArrowRight size={10} className="opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Right: Featured Spotlight (Premium touch) */}
                        <div className="w-[280px] bg-gray-50 p-4 rounded-lg flex flex-col">
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 font-[Inter]">Featured Coverage</p>
                           <div className="relative aspect-[4/3] rounded-md overflow-hidden mb-3">
                              <Image 
                                src={`https://picsum.photos/seed/${cat.slug}_menu/400/300`} 
                                alt="Featured" 
                                fill 
                                className="object-cover"
                              />
                           </div>
                           <h4 className="text-[13px] font-bold text-gray-900 font-[Playfair_Display] leading-tight mb-2">
                             Special Report: The future of {cat.label} in 2026.
                           </h4>
                           <Link href={`/${cat.slug}/national`} className="text-[11px] font-bold text-primary uppercase flex items-center gap-1 hover:underline">
                              Read Analysis <ChevronRight size={12} />
                           </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Search */}
              <button
                className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <Search size={20} strokeWidth={2} />
              </button>

              {/* Desktop Menu Button */}
              <button
                className="hidden md:flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:text-primary transition-all border border-transparent hover:border-gray-200 rounded-lg group focus:outline-none"
                onClick={() => setMobileOpen(true)}
              >
                <span className="text-[13px] font-bold tracking-tight font-[Inter]">MENU</span>
                <div className="flex flex-col gap-[3px]">
                  <span className="block w-4 h-0.5 bg-gray-600 group-hover:bg-primary transition-colors"></span>
                  <span className="block w-4 h-0.5 bg-gray-600 group-hover:bg-primary transition-colors"></span>
                </div>
              </button>

              {/* Subscribe — desktop */}
              <Link
                href="/subscribe"
                className="hidden md:block bg-primary hover:bg-[#8B0000] text-white text-[12px] font-bold px-4 py-2 tracking-wide transition-colors font-[Inter] flex-shrink-0"
              >
                SUBSCRIBE
              </Link>
            </div>
          </div>

          {/* Search bar (expandable) */}
          {searchOpen && (
            <div className="py-2 pb-3 border-t border-gray-100 relative">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  autoFocus
                  type="search"
                  placeholder="Search LabourPulse news, analysis, and tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 bg-gray-50 outline-none focus:border-primary focus:bg-white transition-all font-[Inter] rounded-md"
                />
              </div>

              {/* Live Search Results Dropsdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-2xl z-[60] rounded-b-xl overflow-hidden">
                  <div className="p-2 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-widest font-[Inter]">
                    Suggested Results
                  </div>
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={`/news/${result.slug}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                      className="flex items-center gap-4 p-3 hover:bg-red-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="w-12 h-10 relative flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                        <Image src={result.image} alt={result.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-gray-900 font-[Playfair_Display] truncate">{result.title}</p>
                        <p className="text-[11px] text-gray-500 font-[Inter]">{result.timestamp}</p>
                      </div>
                      <ChevronRight size={14} className="text-gray-300" />
                    </Link>
                  ))}
                  <Link 
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                    className="block text-center py-2.5 text-[12px] font-bold text-primary hover:bg-gray-50 transition-colors border-t border-gray-100"
                  >
                    View All Results for "{searchQuery}"
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ────────── MOBILE OVERLAY ────────── */}
      <div
        className={`mobile-overlay ${mobileOpen ? "open" : ""}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* ────────── MOBILE SIDEBAR (Right → Left) ────────── */}
      <div
        ref={sidebarRef}
        className={`mobile-sidebar ${mobileOpen ? "open" : ""}`}
        aria-label="Navigation menu"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <Link href="/" onClick={closeSidebar} className="flex items-center">
            <span className="bg-primary text-white font-bold text-lg px-2.5 py-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>Labour</span>
            <span className="font-bold text-lg pl-2 text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Pulse</span>
          </Link>
          <button
            onClick={closeSidebar}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search in sidebar */}
        <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 bg-gray-50 outline-none focus:border-primary rounded font-[Inter]"
            />
          </div>
        </div>

        {/* Nav Items only (Dropdown style) */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="flex flex-col">
            {allNavItems.map((cat) => (
              <div key={cat.slug || "home"} className="border-b border-gray-50 last:border-0 px-2">
                <div className="flex items-center justify-between group">
                  {cat.children.length > 0 ? (
                    <button
                      onClick={() => setOpenAccordion(openAccordion === cat.slug ? null : cat.slug)}
                      className="flex-1 text-left px-4 py-4 text-[15px] font-bold text-gray-900 hover:text-primary transition-colors font-[Inter] flex items-center justify-between"
                    >
                      {cat.label}
                      <ChevronRight
                        size={18}
                        className={`transition-transform duration-300 ${openAccordion === cat.slug ? "rotate-90 text-primary" : ""}`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={cat.href || `/${cat.parent || cat.slug}`}
                      className="flex-1 px-4 py-4 text-[15px] font-bold text-gray-900 hover:text-primary transition-colors font-[Inter]"
                      onClick={closeSidebar}
                    >
                      {cat.label}
                    </Link>
                  )}
                </div>

                {/* Sub-items (Dropdown) */}
                {cat.children.length > 0 && openAccordion === cat.slug && (
                  <div className="bg-gray-50/50 rounded-xl mb-2 overflow-hidden animate-in slide-in-from-top-2 duration-300">
                    {cat.children.map((child) => (
                      <Link
                        key={child.slug}
                        href={`/${cat.slug}/${child.slug}`}
                        onClick={closeSidebar}
                        className="flex items-center gap-3 px-8 py-3.5 text-[14px] text-gray-600 hover:text-primary hover:bg-white transition-all font-[Inter]"
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full opacity-40"></div>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar footer (Minimal) */}
        <div className="flex-shrink-0 border-t border-gray-100 px-6 py-6 bg-white">
          <Link
            href="/subscribe"
            onClick={closeSidebar}
            className="block w-full text-center bg-primary hover:bg-primary-dark text-white py-4 text-[14px] font-bold tracking-wide transition-all font-[Inter] rounded-xl shadow-lg hover:shadow-primary/20"
          >
            SUBSCRIBE TO NEWSLETTER
          </Link>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </>
  );
}
