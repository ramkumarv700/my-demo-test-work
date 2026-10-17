
import { ArrowUpRight, BriefcaseBusiness } from "lucide-react"

const colorStyles = {
  purple: "bg-violet-50 text-violet-600",
  blue: "bg-blue-50 text-blue-600",
  pink: "bg-pink-50 text-pink-600",
  violet: "bg-purple-50 text-purple-600",
}

export default function StatCard({ title, value, color }) {
  return (
    <article className="stat-card group relative min-w-0 rounded-xl bg-white p-4 sm:p-5">

      {/* Animated border */}
      {/*<span className="stat-card-border" aria-hidden="true" />*/}

      {/* Card content */}
      <div className="stat-card-content relative z-10 rounded-lg bg-white">

        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-slate-400 sm:text-sm">
              {title}
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              {value}
            </h2>
          </div>

          <div
            className={`rounded-full p-2 transition-transform duration-300 group-hover:scale-110 ${
              colorStyles[color] || colorStyles.purple
            }`}
          >
            <ArrowUpRight size={17} />
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between">
          <span className="text-xs font-medium text-emerald-600">
            Overview
          </span>

          <BriefcaseBusiness
            size={23}
            className="text-violet-300"
            strokeWidth={1.5}
          />
        </div>

      </div>
    </article>
  )
}
