export default function AuthorLoading() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 animate-pulse">
      <div className="h-28 bg-gray-200 rounded-2xl mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="h-52 bg-gray-200 rounded-xl" />
        <div className="h-52 bg-gray-200 rounded-xl" />
        <div className="h-52 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}
