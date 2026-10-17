
import { useMemo, useState, useEffect } from "react";
import { Search, MoreVertical } from "lucide-react";
import { interviewsData } from "../data/dashboardData";
import Pagination from "./ui/Pagination";

const statusStyles = {
  Passed: "bg-violet-600 text-white",
  "Under Review": "bg-purple-100 text-purple-700",
  Pending: "bg-amber-100 text-amber-700",
};

export default function RecentInterviews() {
  // Search input ki value
  const [search, setSearch] = useState("");

  // Current page number
  const [currentPage, setCurrentPage] = useState(1);

  // Ek page par kitne records dikhane hain
  const [pageSize, setPageSize] = useState(5);

  // Search ke hisaab se records filter karna
  const filteredInterviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return interviewsData;

    return interviewsData.filter((item) =>
      [
        item.candidate,
        item.email,
        item.position,
        item.status,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      )
    );
  }, [search]);

  // Filtered records ke basis par total pages calculate karna
  const totalPages = Math.ceil(
    filteredInterviews.length / pageSize
  );

  // Search karne par current page ko valid rakhna
  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  // Agar data kam ho jaye to invalid page par nahi rahenge
  useEffect(() => {
    setCurrentPage((page) =>
      Math.max(1, Math.min(page, Math.max(totalPages, 1)))
    );
  }, [totalPages]);

  // Current page ke records ki starting position
  const startIndex = (currentPage - 1) * pageSize;

  // Sirf current page ke records dikhana
  const currentInterviews = filteredInterviews.slice(
    startIndex,
    startIndex + pageSize
  );

  // Pagination mein visible record range
  const startItem =
    filteredInterviews.length === 0 ? 0 : startIndex + 1;

  const endItem = Math.min(
    startIndex + pageSize,
    filteredInterviews.length
  );

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl bg-white">
      {/* Header and search */}
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <h2 className="section-title">
          Recent Interviews
        </h2>

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

      {/* Interviews table */}
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
            {currentInterviews.map((item) => (
              <tr
                key={item.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">
                    {item.candidate}
                  </p>

                  <p className="mt-1 text-slate-400">
                    {item.email}
                  </p>
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
                    className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium ${statusStyles[item.status] ||
                      "bg-slate-100 text-slate-600"
                      }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        `Actions for ${item.candidate} will be connected next.`
                      )
                    }
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    aria-label={`More actions for ${item.candidate}`}
                    title="More actions"
                  >
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {currentInterviews.length === 0 && (
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

      {/* Reusable pagination component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[5, 10, 20]}
        startItem={startItem}
        endItem={endItem}
        totalItems={filteredInterviews.length}
        itemLabel="interviews"
      />
    </section>
  );
}
