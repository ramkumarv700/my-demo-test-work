
import { useState } from "react"
import {
  CalendarDays,
  Plus,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react"

import Button from "../components/ui/Button"
import StatCard from "../components/StatsCard"
import JobProgress from "../components/JobProgress"
import PopularCountries from "../components/PopularCountries"
import TopCandidates from "../components/TopCandidates"
import RecentInterviews from "../components/RecentInterviews"

import { dashboardStats } from "../data/dashboardData"

function Dashboard() {
  const [dateRange, setDateRange] = useState("Feb 01 – Mar 09, 2026")

  return (
    <main className="w-full min-w-0 space-y-5 overflow-x-hidden bg-[#F5F6FF] p-3 sm:p-5 lg:p-7">

      {/* Heading and actions */}
      <section className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs text-slate-500">Hi, Admin</p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Welcome to Demo
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex h-10 max-w-full items-center gap-2 rounded-full border border-fuchsia-200 bg-white px-3">
            <CalendarDays size={16} className="shrink-0 text-violet-600" />

            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
              aria-label="Select date range"
              className="min-w-0 max-w-52 bg-transparent text-xs text-slate-700 outline-none"
            >
              <option>Feb 01 – Mar 09, 2026</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This month</option>
            </select>

            <ChevronDown size={14} className="shrink-0 text-slate-400" />
          </label>

          <Button
            type="button"
            onClick={() => console.log("Create Interview clicked")}
          >
            <Plus size={16} />
            Create Interview
          </Button>
        </div>
      </section>

      {/* Statistics */}
      <section
        aria-label="Dashboard statistics"
        className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.label}
            {...stat}
          />
        ))}
      </section>

      {/* Job progress and activity */}
      <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,0.9fr)]">
        <div className="min-w-0 overflow-hidden rounded-2xl">
          <JobProgress />
        </div>

        <section className="min-w-0 rounded-2xl  bg-white p-4  sm:p-5">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-fuchsia-200 p-4">
            <div>
              <p className="text-xs text-slate-500">Total Jobs</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                154
              </h2>
            </div>

            <ArrowUpRight size={20} className="text-violet-600" />
          </div>

          <h3 className="mb-4 mt-6 text-xs text-slate-400">
            Recent activity
          </h3>

          <div className="space-y-5">
            {[
              { label: "Interviewed", value: "77 (35%)" },
              { label: "Not Shortlisted", value: "50 (65%)" },
              { label: "Under Review", value: "18 (23%)" },
              { label: "Shortlisted", value: "9 (12%)" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex min-w-0 items-center justify-between gap-3"
              >
                <span className="truncate text-xs text-slate-600">
                  {item.label}
                </span>

                <span className="shrink-0 text-xs font-medium text-slate-700">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      </section>

      {/* Countries and candidates */}
      <section className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-w-0 overflow-hidden rounded-2xl">
          <PopularCountries />
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl">
          <TopCandidates />
        </div>
      </section>

      {/* Recent interviews */}
      <section className="min-w-0 overflow-hidden rounded-2xl">
        <RecentInterviews />
      </section>

    </main>
  )
}

export default Dashboard
