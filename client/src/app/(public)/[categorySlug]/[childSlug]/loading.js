export default function ChildCategoryLoading() {
  return (
    <div className="bg-white w-full">
      <div className="max-w-[1280px] mx-auto px-4 py-8 pb-16 animate-pulse">
        <div className="h-4 w-40 bg-gray-100 rounded mb-4" />
        <div className="h-10 w-72 bg-gray-100 rounded-lg mb-8" />
        <div className="h-80 bg-gray-100 rounded-2xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-xl" />
          ))}
        </div>
        <div className="h-48 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  );
}
