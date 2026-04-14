"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { searchArticles } from "@/data/queries";
import CategoryGrid from "@/components/category/CategoryGrid";
import { Search, Loader2 } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate a small delay for premium feel
    const timer = setTimeout(() => {
      const data = searchArticles(query);
      setResults(data);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-1 min-w-0">
          <div className="mb-8 pb-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 font-[Playfair_Display] flex items-center gap-3">
              <Search className="text-primary" size={28} />
              {query ? `Search Results for "${query}"` : "Search LabourPulse"}
            </h1>
            <p className="text-gray-500 mt-2 font-[Inter]">
              {loading ? "Searching our archives..." : `Showing ${results.length} results`}
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="font-[Inter]">Searching database...</p>
            </div>
          ) : results.length > 0 ? (
            <CategoryGrid articles={results} />
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg py-20 px-4 text-center">
              <h2 className="text-xl font-bold text-gray-800 font-[Playfair_Display] mb-2">No results found</h2>
              <p className="text-gray-500 font-[Inter] max-w-md mx-auto">
                We couldn't find any articles matching your search. Try using different keywords or checking for spelling errors.
              </p>
            </div>
          )}
        </main>

        <aside className="lg:w-[310px] flex-shrink-0">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
