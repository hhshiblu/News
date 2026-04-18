/** Label + helper for consistent dashboard forms */
export default function FormField({ label, hint, htmlFor, children, className = "" }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
          {label}
        </label>
      )}
      {children}
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}
