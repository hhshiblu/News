"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BASE = "/dashboard/posts";

const OPTIONS = [
  { value: "all", label: "All articles" },
  { value: "PUBLISHED", label: "Published" },
  { value: "PENDING", label: "Pending" },
  { value: "BLOCKED", label: "Blocked" },
];

export default function PostsStatusFilter({ statusFilter }) {
  const router = useRouter();
  const current = (statusFilter || "all").toString().toLowerCase();
  const [pending, setPending] = useState(current);

  useEffect(() => {
    setPending(current);
  }, [current]);

  const apply = () => {
    if (pending === "all") router.push(BASE);
    else router.push(`${BASE}?status=${encodeURIComponent(pending.toUpperCase())}`);
  };

  return (
    <div className="px-3 sm:px-4 py-3 border-b border-gray-200 bg-gray-50/50">
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Filter by status</p>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
        <label className="flex-1 min-w-0">
          <span className="sr-only">Status</span>
          <select
            value={pending}
            onChange={(e) => setPending(e.target.value.toLowerCase())}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-[13px] font-medium text-gray-800 outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
          >
            {OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value.toLowerCase()}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={apply}
          className="shrink-0 rounded-xl bg-primary px-5 py-2.5 text-[12px] font-bold text-white shadow-sm hover:bg-primary-dark transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
