export default function KeyFactsBox({ facts, title = "Key Facts" }) {
  return (
    <div className="my-8 border border-l-[4px] border-l-primary border-gray-200 bg-gray-50 p-5">
      <h3 className="text-[13px] font-bold uppercase tracking-widest text-primary mb-4 font-[Inter] flex items-center gap-2">
        <span className="w-4 h-0.5 bg-primary inline-block"></span>
        {title}
        <span className="w-4 h-0.5 bg-primary inline-block"></span>
      </h3>
      <ul className="space-y-3">
        {facts.map((fact, idx) => (
          <li key={idx} className="flex items-start gap-3">
            {fact.icon && <span className="text-base flex-shrink-0 mt-0.5">{fact.icon}</span>}
            <div className="flex-1">
              <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide font-[Inter] block">
                {fact.label}
              </span>
              <span className="text-[14px] font-semibold text-gray-900 font-[Inter]">
                {fact.value}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
