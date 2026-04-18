"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardSelect from "@/components/ui/DashboardSelect";

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
    <div className="border-b border-gray-200 bg-gray-50/50 px-2 py-3 sm:px-4">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">Filter by status</p>
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 sm:flex-initial sm:min-w-[11rem]">
          <span className="sr-only">Status</span>
          <DashboardSelect
            aria-label="Filter articles by status"
            value={pending}
            onChange={(v) => setPending(String(v).toLowerCase())}
            options={OPTIONS}
          />
        </div>
        <button
          type="button"
          onClick={apply}
          className="shrink-0 rounded-xl bg-primary px-5 py-2.5 text-[12px] font-bold text-white shadow-sm transition-colors hover:bg-primary-dark"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
