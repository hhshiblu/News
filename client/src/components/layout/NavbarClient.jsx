"use client";

import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, X, ChevronDown, ChevronRight, ArrowRight, Loader2, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/data/db";
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
  const closeMegaTimer = useRef(null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [dynamicCategories, setDynamicCategories] = useState(initialCategories);
  const [portalReady, setPortalReady] = useState(false);
  const [navBottom, setNavBottom] = useState(0);
  const [megaCategory, setMegaCategory] = useState(null);

  const updateNavBottom = useCallback(() => {
    const el = headerRef.current;
    if (el) setNavBottom(el.getBoundingClientRect().bottom);
  }, []);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useLayoutEffect(() => {
    updateNavBottom();
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateNavBottom);
    ro.observe(el);
    window.addEventListener("scroll", updateNavBottom, { passive: true });
    window.addEventListener("resize", updateNavBottom);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", updateNavBottom);
      window.removeEventListener("resize", updateNavBottom);
    };
  }, [updateNavBottom]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (!mq.matches) setMegaCategory(null);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (mobileOpen) setMegaCategory(null);
  }, [mobileOpen]);

  useEffect(
    () => () => {
      if (closeMegaTimer.current) clearTimeout(closeMegaTimer.current);
    },
    []
  );

  useEffect(() => {
    setDynamicCategories(initialCategories?.length ? initialCategories : CATEGORIES || []);
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

  const openMega = (cat) => {
    if (closeMegaTimer.current) {
      clearTimeout(closeMegaTimer.current);
      closeMegaTimer.current = null;
    }
    if (!cat?.children?.length) {
      setMegaCategory(null);
      return;
    }
    setMegaCategory(cat);
    requestAnimationFrame(updateNavBottom);
  };

  const scheduleCloseMega = () => {
    closeMegaTimer.current = setTimeout(() => {
      setMegaCategory(null);
      closeMegaTimer.current = null;
    }, 140);
  };

  const cancelCloseMega = () => {
    if (closeMegaTimer.current) {
      clearTimeout(closeMegaTimer.current);
      closeMegaTimer.current = null;
    }
  };

  const allNavItems = dynamicCategories?.length
    ? dynamicCategories
    : CATEGORIES;

  const topCategories = allNavItems.slice(0, 4);

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-shadow duration-300 ${scrolled ? "shadow-md" : ""}`}
      >
        <div className="hidden md:block bg-gray-50 border-b border-gray-200">
          <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-8">
            <span className="text-[11px] text-gray-500 font-[Inter]">{todayLabel || "Loading date..."}</span>
            <div className="flex items-center gap-4 text-[11px] text-gray-500 font-[Inter]">
              <button className="hover:text-gray-800 transition-colors">বাংলা</button>
              <span className="text-gray-300">|</span>
              <button className="hover:text-gray-800 transition-colors focus:outline-none">English</button>
              {!loadingUser && user ? (
                <>
                  <span className="text-gray-300">|</span>
                  <Link href="/dashboard" className="font-bold text-gray-800 hover:text-primary transition-colors flex items-center gap-1.5 focus:outline-none py-1 px-2.5 bg-gray-100 rounded-full">
                    <div className="w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                      {user.name.charAt(0)}
                    </div>
                    Hi, {user.name.split(" ")[0]}
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>

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
                Labour
              </span>
              <span className="text-gray-900 font-bold text-lg md:text-xl pl-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Pulse
              </span>
            </Link>

            <nav className="hidden md:flex items-center h-full flex-1 min-w-0 gap-2 ml-2 sm:ml-4">
              <Link
                href="/breaking"
                className="h-full flex shrink-0 items-center px-3 text-[13px] font-bold text-breaking hover:text-primary transition-colors font-[Inter] whitespace-nowrap"
              >
                Breaking News
              </Link>
              <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto [scrollbar-width:thin]">
              {topCategories.map((cat) => (
                <div
                  key={cat.slug}
                  className="nav-item flex-shrink-0 group"
                  onMouseEnter={() => openMega(cat)}
                  onMouseLeave={scheduleCloseMega}
                >
                  <Link
                    href={`/${cat.slug}`}
                    className="h-full flex items-center gap-1 text-[13px] font-bold text-gray-700 hover:text-primary px-3 transition-colors font-[Inter] whitespace-nowrap"
                  >
                    {cat.label || cat.name}
                    {cat.children?.length > 0 && (
                      <ChevronDown
                        size={12}
                        strokeWidth={2.5}
                        className={`transition-transform ${megaCategory?.slug === cat.slug ? "rotate-180" : "group-hover:rotate-180"}`}
                      />
                    )}
                  </Link>
                </div>
              ))}
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

            {megaCategory?.children?.length > 0 && !mobileOpen && navBottom > 0 && (
              <div
                className="hidden md:block fixed left-1/2 z-[140] w-[min(94vw,42rem)] -translate-x-1/2 animate-in fade-in slide-in-from-top-1 duration-200"
                style={{ top: navBottom }}
                onMouseEnter={cancelCloseMega}
                onMouseLeave={scheduleCloseMega}
              >
                <div className="flex min-h-[min(480px,72vh)] flex-col rounded-b-2xl border border-gray-200 border-t-[3px] border-t-primary bg-white px-6 py-5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.22)]">
                  <p className="shrink-0 text-[10px] font-bold text-primary uppercase tracking-widest mb-3 font-[Inter] border-b border-gray-100 pb-2">
                    Discover {megaCategory.label || megaCategory.name}
                  </p>
                  <div className="min-h-[min(380px,55vh)] max-h-[min(560px,62vh)] flex-1 overflow-y-auto [scrollbar-width:thin] grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0.5 content-start">
                    {megaCategory.children.map((child) => (
                      <Link
                        key={child.slug}
                        href={`/${megaCategory.slug}/${child.slug}`}
                        className="text-[13px] text-gray-600 hover:text-primary py-2.5 px-1 transition-colors font-[Inter] flex items-center justify-between gap-2 rounded-lg hover:bg-gray-50 group/link"
                        onClick={() => setMegaCategory(null)}
                      >
                        <span className="truncate">{child.label || child.name}</span>
                        <ArrowRight size={10} className="shrink-0 opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={sidebarRef} className={`mobile-sidebar ${mobileOpen ? "open" : ""}`} aria-label="Navigation menu">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <Link href="/" onClick={closeSidebar} className="flex items-center">
            <span className="bg-primary text-white font-bold text-lg px-2.5 py-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>Labour</span>
            <span className="font-bold text-lg pl-2 text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Pulse</span>
          </Link>
          <button onClick={closeSidebar} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600" aria-label="Close menu">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <div className="flex flex-col">
            <Link
              href="/breaking"
              onClick={closeSidebar}
              className="mx-2 mb-2 px-4 py-3 rounded-xl text-[15px] font-bold text-breaking bg-red-50/80 hover:bg-red-100/80 transition-colors font-[Inter]"
            >
              Breaking News
            </Link>
            {allNavItems.map((cat) => (
              <div key={cat.slug} className="border-b border-gray-50 last:border-0 px-2">
                <div className="flex items-center justify-between group">
                  {cat.children?.length > 0 ? (
                    <button
                      onClick={() => setOpenAccordion(openAccordion === cat.slug ? null : cat.slug)}
                      className="flex-1 text-left px-4 py-4 text-[15px] font-bold text-gray-900 hover:text-primary transition-colors font-[Inter] flex items-center justify-between"
                    >
                      {cat.label || cat.name}
                      <ChevronRight size={18} className={`transition-transform duration-300 ${openAccordion === cat.slug ? "rotate-90 text-primary" : ""}`} />
                    </button>
                  ) : (
                    <Link
                      href={`/${cat.slug}`}
                      className="flex-1 px-4 py-4 text-[15px] font-bold text-gray-900 hover:text-primary transition-colors font-[Inter]"
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
                        className="flex items-center gap-3 px-8 py-3.5 text-[14px] text-gray-600 hover:text-primary hover:bg-white transition-all font-[Inter]"
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
        </div>
            </div>
          </>,
          document.body
        )}

    </>
  );
}
