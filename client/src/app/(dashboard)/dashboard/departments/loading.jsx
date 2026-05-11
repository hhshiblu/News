export default function DepartmentsLoading() {
  return (
    <div className="space-y-5 pb-10 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-7 w-32 rounded-md bg-gray-200"></div>
        <div className="h-9 w-32 rounded-xl bg-gray-200"></div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3"><div className="h-4 w-16 rounded bg-gray-200"></div></th>
                <th className="w-[1%] px-4 py-3 text-right"><div className="h-4 w-16 rounded bg-gray-200 ml-auto"></div></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3">
                    <div className="h-4 w-32 rounded bg-gray-200"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <div className="h-8 w-8 rounded-lg bg-gray-200"></div>
                      <div className="h-8 w-8 rounded-lg bg-gray-200"></div>
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
