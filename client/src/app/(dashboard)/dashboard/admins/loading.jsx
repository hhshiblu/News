export default function AdminsLoading() {
  return (
    <div className="space-y-6 animate-pulse pb-10">
      <div className="flex items-center justify-between">
        <div className="h-7 w-40 rounded-md bg-gray-200"></div>
        <div className="h-9 w-32 rounded-xl bg-gray-200"></div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
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
                      <div className="h-10 w-10 rounded-xl bg-gray-200"></div>
                      <div className="space-y-1">
                        <div className="h-4 w-24 rounded bg-gray-200"></div>
                        <div className="h-3 w-32 rounded bg-gray-200"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="h-6 w-20 rounded-lg bg-gray-200"></div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="h-4 w-16 rounded-full bg-gray-200"></div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <div className="h-8 w-20 rounded-xl bg-gray-200"></div>
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
