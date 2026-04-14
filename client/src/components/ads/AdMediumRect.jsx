export default function AdMediumRect() {
  return (
    <div className="w-full h-[250px] bg-gradient-to-br from-gray-100 to-gray-200 border border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:from-gray-200 hover:to-gray-300 transition-all">
      <span className="text-[9px] uppercase tracking-[0.15em] text-gray-400 font-medium font-[Inter]">Advertisement</span>
      <span className="text-xs text-gray-300 font-[Inter]">300 × 250</span>
    </div>
  );
}
