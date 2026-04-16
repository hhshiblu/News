export default function CategoryLoading() {
  return (
    <div className="bg-white w-full">
      <div className="max-w-[1280px] mx-auto px-4 py-8 pb-16 animate-pulse">
        <div className="h-10 w-64 bg-gray-100 rounded-lg mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2 h-80 bg-gray-100 rounded-2xl" />
          <div className="h-80 bg-gray-100 rounded-2xl" />
        </div>
        <div className="h-12 bg-gray-100 rounded-xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 bg-gray-100 rounded-xl" />
          ))}
        </div>
        <div className="h-56 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  );
}
