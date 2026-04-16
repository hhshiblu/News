export default function PublicHomeLoading() {
  return (
    <div className="bg-white w-full">
      <div className="max-w-[1280px] mx-auto px-4 pt-6 pb-16 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2 h-80 bg-gray-100 rounded-2xl" />
          <div className="h-80 bg-gray-100 rounded-2xl" />
        </div>
        <div className="h-14 bg-gray-100 rounded-xl mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-gray-100 rounded-2xl mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="h-44 bg-gray-100 rounded-xl" />
          <div className="h-44 bg-gray-100 rounded-xl" />
          <div className="h-44 bg-gray-100 rounded-xl" />
        </div>
        <div className="h-72 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  );
}
