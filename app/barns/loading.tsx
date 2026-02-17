export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="h-10 bg-gray-200 rounded-lg w-48 mb-4 animate-pulse" />
      <div className="h-12 bg-gray-200 rounded-lg w-full max-w-xl mb-8 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
