export default function NewsDetailLoading() {
  return (
    <div className="bg-white w-full">
      <div className="max-w-[1280px] mx-auto px-4 py-6 pb-16 animate-pulse">
      <div className="h-3 w-56 bg-gray-200 rounded mb-5" />

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        <main className="flex-1 min-w-0">
          <div className="w-full max-w-[min(100%,52rem)] xl:max-w-[56rem]">
            <div className="space-y-3 mb-4">
              <div className="h-8 w-[92%] bg-gray-200 rounded" />
              <div className="h-8 w-[75%] bg-gray-200 rounded" />
            </div>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-full bg-gray-200" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>

            <div className="h-[240px] sm:h-[300px] md:h-[340px] lg:h-[380px] w-full bg-gray-200 rounded-xl mb-5" />

            <div className="space-y-3">
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-[97%] bg-gray-200 rounded" />
              <div className="h-3 w-[92%] bg-gray-200 rounded" />
              <div className="h-3 w-[95%] bg-gray-200 rounded" />
              <div className="h-3 w-[88%] bg-gray-200 rounded" />
              <div className="h-3 w-[80%] bg-gray-200 rounded" />
            </div>
          </div>
        </main>

        <aside className="w-full lg:min-w-[280px] lg:w-[300px] xl:min-w-[300px] xl:w-[320px] shrink-0">
          <div className="space-y-3">
            <div className="h-5 w-36 bg-gray-200 rounded" />
            <div className="h-20 w-full bg-gray-200 rounded-lg" />
            <div className="h-20 w-full bg-gray-200 rounded-lg" />
            <div className="h-20 w-full bg-gray-200 rounded-lg" />
          </div>
        </aside>
      </div>
      <div className="mt-10 space-y-3 max-w-[min(100%,52rem)]">
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-[90%] bg-gray-100 rounded" />
        <div className="h-3 w-[85%] bg-gray-100 rounded" />
      </div>
    </div>
    </div>
  );
}
