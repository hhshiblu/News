/**
 * AdBanner — placeholder ad slot.
 * `fullWidth` — leaderboard spans viewport (home top strip).
 */
export default function AdBanner({
  size = "leaderboard",
  label = "Advertisement",
  fullWidth = false,
  hideLabel = false,
  className = "",
}) {
  const isLeader = size === "leaderboard";
  return (
    <div
      className={`w-full flex flex-col items-center ${isLeader && !fullWidth ? "py-4" : ""} ${!isLeader ? "py-6" : ""} ${fullWidth ? "py-0" : ""} ${className}`}
    >
      {!hideLabel && (
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.25em] mb-2 font-[Inter]">
          {label}
        </p>
      )}
      <div
        className={`
          relative overflow-hidden border border-dashed border-gray-200 bg-gray-50
          flex items-center justify-center
          ${isLeader && fullWidth ? "w-full h-[90px] rounded-none" : ""}
          ${isLeader && !fullWidth ? "w-full max-w-[728px] h-[90px]" : ""}
          ${!isLeader ? "w-full max-w-[300px] h-[250px]" : ""}
        `}
      >
        {/* Diagonal stripe pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #e5e7eb 0, #e5e7eb 1px, transparent 0, transparent 50%)",
            backgroundSize: "12px 12px",
          }}
        />
        <div className="relative z-10 text-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-[Inter]">
            {isLeader ? "728 × 90" : "300 × 250"}
          </p>
          <p className="text-[10px] text-gray-300 font-[Inter] mt-0.5">Ad Space</p>
        </div>
      </div>
    </div>
  );
}
