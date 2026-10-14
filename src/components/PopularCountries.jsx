
import { countriesData } from "../data/dashboardData"

export default function PopularCountries() {
  return (
    <section className="flex h-full min-w-0 flex-col rounded-2xl  bg-white p-4  sm:p-5">
      <h2 className="font-semibold text-slate-900">
        Popular countries
      </h2>

      <p className="mt-1 text-xs text-slate-400">
        Statistics
      </p>

      <div className="mt-3 flex-1 divide-y divide-transparent">
        {countriesData.map((item) => (
          <div
            key={item.name}
            className="grid min-h-[45px] grid-cols-[88px_minmax(0,1fr)] items-center gap-3 py-3 sm:grid-cols-[100px_minmax(0,1fr)]"
          >
            <span className="truncate text-xs text-slate-500">
              {item.name}
            </span>

            <div className="h-3 w-full overflow-hidden rounded-full bg-violet-50">
              <div
                className="h-full rounded-full bg-violet-600 transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, Number(item.value) || 0)
                  )}%`,
                }}
                role="progressbar"
                aria-label={item.name}
                aria-valuenow={Math.min(
                  100,
                  Math.max(0, Number(item.value) || 0)
                )}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-[88px_minmax(0,1fr)] gap-3 sm:grid-cols-[100px_minmax(0,1fr)]">
        <span aria-hidden="true" />

        <div className="flex justify-between text-[10px] text-slate-400">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </section>
  )
}
