
import { CalendarDays, Plus, ArrowUpRight } from "lucide-react"

import StatCard from "../components/StatsCard"
import JobProgress from "../components/JobProgress"
import PopularCountries from "../components/PopularCountries"
import TopCandidates from "../components/TopCandidates"
import RecentInterviews from "../components/RecentInterviews"

import {
  dashboardStats,
  jobProgress,
  countriesData,
  candidatesData,
  interviewsData
} from "../data/dashboardData"


const activityItems = [
  { label: "Interviewed", count: "77 (35%)", icon: "▦" },
  { label: "Not Shortlisted", count: "50 (65%)", icon: "≋" },
  { label: "Under Review", count: "18 (23%)", icon: "◎" },
  { label: "Shortlisted", count: "9 (12%)", icon: "✓" },
]

function ActivitySummary() {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="rounded-xl border border-fuchsia-200 p-4">
        <p className="text-xs text-slate-500">Total Jobs</p>
        <div className="mt-1 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">154</h2>
          <ArrowUpRight className="text-purple-500" size={20} />
        </div>
      </div>

      <p className="mb-3 mt-5 text-xs text-slate-400">Recent activity</p>

      <div className="space-y-3">
        {activityItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 text-sm text-violet-600">
              {item.icon}
            </div>

            <p className="min-w-0 flex-1 text-xs font-medium text-slate-600">
              {item.label}
            </p>

            <span className="shrink-0 text-[11px] font-semibold text-slate-700">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5">

      {/* Dashboard heading */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Hi Andrei,</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Welcome to Demo
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => alert("Date range selection will be connected next.")}
            className="flex items-center gap-2 rounded-full border border-fuchsia-200 bg-white px-3 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50 sm:px-4"
          >
            <CalendarDays size={15} />
            Feb 01 – Mar 09, 2026
          </button>

          <button
            type="button"
            onClick={() => alert("Next, we will connect this to the Create Interview page.")}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:opacity-90"
          >
            <Plus size={15} />
            Create Interview
          </button>
        </div>
      </section>

      {/* 4 summary cards */}
      <section className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      {/* Job progress and activity */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
        <JobProgress />
        <ActivitySummary />
      </section>

      {/* Countries and candidates */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PopularCountries />
        <TopCandidates />
      </section>

      {/* Interviews table */}
      <RecentInterviews />

    </div>
  )
}