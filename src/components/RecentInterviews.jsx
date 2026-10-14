import { useMemo, useState } from "react"
import { Search, MoreVertical, FileText } from "lucide-react"
import { interviewsData } from "../data/dashboardData"

const statusStyles = {
  Passed: "bg-violet-600 text-white",
  "Under Review": "bg-purple-100 text-purple-700",
  Pending: "bg-amber-100 text-amber-700",
}

export default function RecentInterviews() {
  const [search, setSearch] = useState("")

  const filteredInterviews = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return interviewsData

    return interviewsData.filter((item) =>
      [
        item.candidate,
        item.email,
        item.position,
        item.status,
      ].some((value) => value.toLowerCase().includes(query))
    )
  }, [search])

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl  bg-white ">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <h2 className="font-semibold text-slate-900">Recent Interviews</h2>

        <label className="flex w-full items-center gap-2 rounded-full border border-fuchsia-200 px-3 py-2 sm:max-w-sm">
          <Search size={16} className="shrink-0 text-purple-500" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search candidate, email, designation..."
            className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-slate-400"
            aria-label="Search interviews"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="border-y border-slate-100 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Candidate</th>
              <th className="px-4 py-3 font-medium">Position</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Reports</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredInterviews.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">
                    {item.candidate}
                  </p>
                  <p className="mt-1 text-slate-400">{item.email}</p>
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {item.position}
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {item.date}
                </td>

                <td className="px-4 py-3 font-medium text-slate-700">
                  {item.score}%
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium ${
                      statusStyles[item.status] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => alert(`Report for ${item.candidate} will be connected next.`)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-violet-50 hover:text-violet-700"
                    aria-label={`Open report for ${item.candidate}`}
                  >
                    <FileText size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredInterviews.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  No interviews match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
        <span>
          Showing {filteredInterviews.length} of {interviewsData.length} interviews
        </span>
        <span>Demo data</span>
      </div>
    </section>
  )
}