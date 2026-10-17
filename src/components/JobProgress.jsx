import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import { jobProgress } from "../data/dashboardData"

export default function JobProgress() {
  const total = jobProgress.reduce((sum, item) => sum + item.value, 0)

  return (
    <section className="min-w-0 rounded-2xl  bg-white p-4  sm:p-5">
      <h2 className="section-title">Job Progress</h2>
      <p className="mt-1 text-xs text-slate-400 sm:text-sm">
        Overviews of jobs by current status
      </p>

      <div className="mt-4 grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
        <div className="relative h-56 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={jobProgress}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="47%"
                outerRadius="72%"
                paddingAngle={3}
                stroke="none"
              >
                {jobProgress.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [
                  Number(value).toLocaleString(),
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-800">
              {total.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">Total jobs</span>
          </div>
        </div>

        <div className="space-y-4">
          {jobProgress.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate text-slate-500">
                  {item.name}
                </span>
              </div>

              <span className="font-semibold text-slate-700">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}