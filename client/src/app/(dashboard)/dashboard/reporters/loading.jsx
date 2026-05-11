export default function ReportersLoading() {
  return (
    <div className="space-y-6 animate-pulse pb-10">
      <div className="flex items-center justify-between">
        <div className="h-7 w-32 rounded-md bg-gray-200"></div>
        <div className="h-9 w-32 rounded-xl bg-gray-200"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-3 w-16 rounded bg-gray-200"></div>
              <div className="h-6 w-12 rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50/50 px-2 py-3 sm:px-4">
          <div className="h-4 w-24 rounded bg-gray-200 mb-2"></div>
          <div className="flex gap-2">
            <div className="h-9 w-44 rounded-xl bg-gray-200"></div>
            <div className="h-9 w-20 rounded-xl bg-gray-200"></div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-[#fcfdfd] border-b border-gray-200">
              <tr>
                <th className="px-3 sm:px-4 py-3"><div className="h-4 w-20 rounded bg-gray-200"></div></th>
                <th className="px-3 sm:px-4 py-3"><div className="h-4 w-20 rounded bg-gray-200"></div></th>
                <th className="px-3 sm:px-4 py-3"><div className="h-4 w-20 rounded bg-gray-200"></div></th>
                <th className="px-3 sm:px-4 py-3 text-right"><div className="h-4 w-16 rounded bg-gray-200 ml-auto"></div></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                      <div className="space-y-1">
                        <div className="h-4 w-24 rounded bg-gray-200"></div>
                        <div className="h-3 w-32 rounded bg-gray-200"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="h-5 w-16 rounded-md bg-gray-200"></div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="h-4 w-16 rounded-full bg-gray-200"></div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <div className="h-7 w-7 rounded bg-gray-200"></div>
                      <div className="h-7 w-7 rounded-xl bg-gray-200"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
