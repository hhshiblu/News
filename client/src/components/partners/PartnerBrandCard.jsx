/**
 * Landscape partner tile: image fills the frame; hover blurs image and shows name.
 * aspect-[5/3] keeps width > height.
 * @param {"row"|"grid"} layout — row: fixed width strip item; grid: full cell width
 */
export default function PartnerBrandCard({ partner, layout = "row", className = "" }) {
  const href = partner.websiteUrl || "#";
  const external = !!partner.websiteUrl;
  const sizeCls =
    layout === "grid"
      ? "w-full max-w-none"
      : "w-full max-w-[176px] shrink-0 sm:max-w-[184px]";

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group relative block overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm aspect-[5/3] ${sizeCls} ${className}`}
      aria-label={partner.name}
    >
      <img
        src={partner.logoUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition duration-300 ease-out group-hover:blur-md group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
        <span className="max-w-[95%] px-2 text-center text-[11px] font-bold leading-tight text-white opacity-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] transition duration-300 group-hover:opacity-100 sm:text-xs">
          {partner.name}
        </span>
      </div>
    </a>
  );
}
