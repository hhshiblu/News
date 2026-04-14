import { TrendingUp, TrendingDown, BarChart2 } from "lucide-react";
import { getMarketData } from "@/data/queries";

export default function MarketSnapshot() {
  const keyItems = getMarketData().slice(0, 6);

  return (
    <div className="bg-gray-50 border border-gray-200 p-4 h-full">
      <div className="flex items-center gap-1.5 mb-3 pb-2.5 border-b border-gray-200">
        <BarChart2 size={15} className="text-accent" />
        <h3 className="text-[13px] font-bold uppercase tracking-wide text-gray-800 font-[Inter]">
          Market Snapshot
        </h3>
      </div>
      <div className="space-y-2.5">
        {keyItems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-[12px] text-gray-500 font-medium font-[Inter]">{item.label}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-gray-900 font-[Inter]">{item.value}</span>
              <span className={`flex items-center gap-0.5 text-[11px] font-semibold ${item.up ? "text-market-up" : "text-market-down"}`}>
                {item.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-3 font-[Inter]">Updated: {new Date().toLocaleTimeString("en-BD")}</p>
    </div>
  );
}
