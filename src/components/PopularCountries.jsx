import { countriesData } from "../data/dashboardData"

export default function PopularCountries() {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="font-semibold text-slate-900">Popular countries</h2>
      <p className="mt-1 text-xs text-slate-400">Statistics</p>

      <div className="mt-6 space-y-5">
        {countriesData.map((item) => (
          <div
            key={item.name}
            className="grid grid-cols-[90px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[100px_minmax(0,1fr)]"
          >
            <span className="text-xs text-slate-500">{item.name}</span>

            <div className="h-2.5 overflow-hidden rounded-full bg-violet-50">
              <div
                className="h-full rounded-full bg-violet-600 transition-all"
                style={{ width: `${item.value}%` }}
                role="progressbar"
                aria-label={item.name}
                aria-valuenow={item.value}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-between pl-[102px] text-[10px] text-slate-400 sm:pl-[112px]">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </section>
  )
}