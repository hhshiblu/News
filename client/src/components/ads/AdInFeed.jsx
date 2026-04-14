export default function AdInFeed({ compact = false, hideLabel = false }) {
  return (
    <div className={`w-full ${compact ? "mt-0 mb-2" : "my-6"}`}>
      {!hideLabel && (
        <p className="text-center text-[8px] uppercase tracking-[0.12em] text-gray-400 mb-0.5 font-[Inter]">
          Advertisement
        </p>
      )}
      <div className="w-full h-[90px] bg-gradient-to-r from-gray-100 to-gray-200 border border-dashed border-gray-300 flex items-center justify-center hover:from-gray-200 transition-all cursor-pointer rounded-md">
        <span className="text-xs text-gray-300 font-[Inter]">728 × 90 In-Feed</span>
      </div>
    </div>
  );
}
