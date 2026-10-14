import { ArrowRight } from "lucide-react"
import { candidatesData } from "../data/dashboardData"

export default function TopCandidates() {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-semibold text-slate-900">Top 5 Candidates</h2>

        <button
          type="button"
          onClick={() => alert("Connect this to the candidates page next.")}
          className="flex shrink-0 items-center gap-1 rounded-full border border-fuchsia-200 px-3 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50"
        >
          View all <ArrowRight size={13} />
        </button>
      </div>

      <div className="mt-3 divide-y divide-slate-100">
        {candidatesData.map((candidate, index) => (
          <div
            key={`${candidate.name}-${index}`}
            className="flex items-center gap-3 py-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
              {candidate.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-800">
                {candidate.name}
              </p>
              <p className="mt-1 truncate text-[11px] text-slate-400">
                {candidate.role}
              </p>
            </div>

            <span className="shrink-0 text-xs font-medium text-slate-600">
              {candidate.progress}%
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}