import { TrendingUp, TrendingDown } from "lucide-react";
import { getMarketData } from "@/data/queries";

export default function MarketTicker() {
  const marketData = getMarketData();
  const doubled = [...marketData, ...marketData];

  return (
    <div className="bg-gray-900 text-white overflow-hidden flex items-center h-10 mb-5">
      {/* Label */}
      <div className="flex-shrink-0 bg-market-up px-3 h-full flex items-center gap-1.5">
        <TrendingUp size={13} className="text-white" />
        <span className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap font-[Inter]">Markets</span>
      </div>

      {/* Scrolling strip */}
      <div className="flex-1 overflow-hidden">
        <div className="market-ticker-track">
          {doubled.map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 px-5 text-[12px] font-medium whitespace-nowrap font-[Inter]">
              <span className="text-gray-400">{item.label}</span>
              <span className="font-bold text-white">{item.value}</span>
              <span className={`flex items-center gap-0.5 text-[11px] font-semibold ${item.up ? "text-market-up" : "text-market-down"}`}>
                {item.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {item.change}
              </span>
              <span className="text-gray-700 ml-3">|</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
