export default function DashboardRouteSkeleton({ title = "Loading" }) {
  return (
    <div className="animate-pulse space-y-6 pb-16" aria-busy="true" aria-label={title}>
      <div className="h-9 w-48 rounded-lg bg-gray-200" />
      <div className="h-4 w-72 max-w-full rounded bg-gray-100" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-gray-100 border border-gray-100" />
        ))}
      </div>
      <div className="h-64 rounded-[24px] bg-gray-100 border border-gray-100" />
    </div>
  );
}
