import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function SectionHeader({ title, href, emoji }) {
  return (
    <div className="flex items-center justify-between border-b-[3px] border-primary pb-2.5 mb-5">
      <h2 className="text-[15px] font-bold uppercase tracking-wide text-gray-900 font-[Inter] flex items-center gap-1.5">
        {emoji && <span>{emoji}</span>}
        {title}
      </h2>
      {href && (
        <Link href={href} className="text-[12px] font-semibold text-primary flex items-center gap-0.5 hover:opacity-75 transition-opacity font-[Inter]">
          View All <ChevronRight size={13} />
        </Link>
      )}
    </div>
  );
}
