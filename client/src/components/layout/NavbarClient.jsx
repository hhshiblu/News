"use client";

import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, X, ChevronDown, ChevronRight, ArrowRight, Loader2, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { searchArticles } from "@/data/queries";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function NavbarClient({ initialCategories = [] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [todayLabel, setTodayLabel] = useState("");
  const router = useRouter();
  const sidebarRef = useRef(null);
  const headerRef = useRef(null);
  const searchInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [dynamicCategories, setDynamicCategories] = useState(initialCategories);
  const [portalReady, setPortalReady] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    setPortalReady(true);
    const fetchTags = async () => {
      try {
        const res = await fetch(`${API_BASE}/public/tags`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setTags(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // set initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDynamicCategories(Array.isArray(initialCategories) ? initialCategories : []);
  }, [initialCategories]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/auth/me`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
        }
      } catch (_) {
        // ignore
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
    const now = new Date();
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    setTodayLabel(`${weekdays[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    const t = setTimeout(() => {
      const list = searchArticles(q, 6);
      setSearchResults(list || []);
    }, 180);
    return () => clearTimeout(t);
  }, [searchQuery, searchOpen]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchResults([]);
    }
  };

  const closeSidebar = () => {
    setMobileOpen(false);
    setOpenAccordion(null);
  };

  /** Only categories returned by the API (no static fallback). */
  const allNavItems = Array.isArray(dynamicCategories) ? dynamicCategories : [];
  
  // Calculate visible count
  const visibleCount = windowWidth >= 1024 ? 6 : windowWidth >= 768 ? 3 : 0;
  const visibleCategories = allNavItems.slice(0, visibleCount);
  const moreCategories = allNavItems.slice(visibleCount);

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-shadow duration-300 ${scrolled ? "shadow-md" : ""}`}
      >
        <div className="max-w-[1280px] mx-auto px-4 min-w-0">
          <div className="flex items-center h-[58px] gap-2 sm:gap-4 min-w-0">
            <button
              className="md:hidden flex flex-col gap-[5px] justify-center p-1 flex-shrink-0"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span className="block w-5 h-0.5 bg-gray-800 rounded-full"></span>
              <span className="block w-5 h-0.5 bg-gray-800 rounded-full"></span>
              <span className="block w-5 h-0.5 bg-gray-800 rounded-full"></span>
            </button>

            <Link href="/" className="flex items-center flex-shrink-0">
              <span className="bg-primary text-white font-bold text-lg md:text-xl px-2.5 md:px-3 py-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                The Labour
              </span>
              <span className="text-gray-900 font-bold text-lg md:text-xl pl-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Pulse
              </span>
            </Link>

            <nav className="hidden md:flex items-center h-full flex-1 gap-2 ml-2 sm:ml-4 overflow-visible">
              <div className="flex items-center gap-2 overflow-visible">
              {visibleCategories.map((cat) => (
                <div key={cat.slug} className="nav-item flex-shrink-0 group">
                  <Link
                    href={`/${cat.slug}`}
                    className="h-full flex items-center gap-1 text-[11px] font-bold text-gray-700 hover:text-primary px-3 transition-colors font-[Inter] whitespace-nowrap uppercase"
                  >
                    {cat.label || cat.name}
                  </Link>
                </div>
              ))}
              
              {moreCategories.length > 0 && windowWidth >= 768 && (
                <div className="relative nav-item flex-shrink-0 flex items-center h-full" ref={moreRef}>
                  <button
                    onClick={() => setMoreOpen(!moreOpen)}
                    className="flex items-center gap-1 text-[11px] font-bold text-gray-700 hover:text-primary px-3 transition-colors font-[Inter]"
                  >
                    MORE
                    <div className="relative flex items-center justify-center">
                      <div className="absolute -top-3 -right-3 w-4 h-4 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white shadow-sm z-10">
                        {moreCategories.length}
                      </div>
                      <ChevronDown size={14} className={`transition-transform duration-300 ${moreOpen ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  {moreOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 shadow-xl rounded-xl py-2 z-[200] animate-in fade-in slide-in-from-top-2 duration-200">
                      {moreCategories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/${cat.slug}`}
                          onClick={() => setMoreOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-[11px] font-bold text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors font-[Inter] uppercase group"
                        >
                          {cat.label || cat.name}
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
              </div>
            </nav>

            <div className="flex items-center gap-2 ml-auto shrink-0">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-gray-700 hover:text-primary border border-gray-200 rounded-md hover:border-primary/40 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu size={16} strokeWidth={2.5} />
                Menu
              </button>
              <button
                className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <Search size={20} strokeWidth={2} />
              </button>
            </div>
          </div>

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

              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-2xl z-[60] rounded-b-xl overflow-hidden">
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
                      </div>
                      <ChevronRight size={14} className="text-gray-300" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {portalReady &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div className={`mobile-overlay ${mobileOpen ? "open" : ""}`} onClick={closeSidebar} aria-hidden="true" />

            <div ref={sidebarRef} className={`mobile-sidebar ${mobileOpen ? "open" : ""}`} aria-label="Navigation menu">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                <Link href="/" onClick={closeSidebar} className="flex items-center">
                  <span className="bg-primary text-white font-bold text-lg px-2.5 py-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>The Labour</span>
                  <span className="font-bold text-lg pl-2 text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Pulse</span>
                </Link>
                <button onClick={closeSidebar} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600" aria-label="Close menu">
                  <X size={16} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-4 flex flex-col">
                <div className="flex-1">
                  <Link
                    href="/breaking"
                    onClick={closeSidebar}
                    className="mx-2 mb-2 px-4 py-3 rounded-xl text-[12px] font-bold text-breaking bg-red-50/80 hover:bg-red-100/80 transition-colors font-[Inter] block"
                  >
                    Breaking News
                  </Link>
                  {allNavItems.map((cat) => (
                    <div key={cat.slug} className="border-b border-gray-50 last:border-0 px-2">
                      <div className="flex items-center justify-between group">
                        {cat.children?.length > 0 ? (
                          <button
                            onClick={() => setOpenAccordion(openAccordion === cat.slug ? null : cat.slug)}
                            className="flex-1 text-left px-4 py-4 text-[12px] font-bold text-gray-900 hover:text-primary transition-colors font-[Inter] flex items-center justify-between uppercase"
                          >
                            {cat.label || cat.name}
                            <ChevronRight size={18} className={`transition-transform duration-300 ${openAccordion === cat.slug ? "rotate-90 text-primary" : ""}`} />
                          </button>
                        ) : (
                          <Link
                            href={`/${cat.slug}`}
                            className="flex-1 px-4 py-4 text-[12px] font-bold text-gray-900 hover:text-primary transition-colors font-[Inter] block uppercase"
                            onClick={closeSidebar}
                          >
                            {cat.label || cat.name}
                          </Link>
                        )}
                      </div>
                      {cat.children?.length > 0 && openAccordion === cat.slug && (
                        <div className="bg-gray-50/50 rounded-xl mb-2 overflow-hidden animate-in slide-in-from-top-2 duration-300">
                          {cat.children.map((child) => (
                            <Link
                              key={child.slug}
                              href={`/${cat.slug}/${child.slug}`}
                              onClick={closeSidebar}
                              className="flex items-center gap-3 px-8 py-3.5 text-[12px] text-gray-600 hover:text-primary hover:bg-white transition-all font-[Inter] uppercase"
                            >
                              <div className="w-1.5 h-1.5 bg-primary rounded-full opacity-40"></div>
                              {child.label || child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Tags Section */}
                {tags.length > 0 && (
                  <div className="px-5 mt-8 mb-4 border-t border-gray-100 pt-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 font-[Inter]">Popular Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <Link 
                          key={tag.slug} 
                          href={`/tag/${tag.slug}`}
                          onClick={closeSidebar}
                          className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-[11px] font-bold rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-colors font-[Inter]"
                        >
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
