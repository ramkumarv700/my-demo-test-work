
import { Link } from "react-router-dom";
import { House, ChevronRight } from "lucide-react";

function Breadcrumb({ items = [] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 flex min-w-0 items-center gap-1.5 overflow-x-auto text-xs sm:gap-2 sm:text-sm"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div
            key={`${item.label}-${index}`}
            className="flex shrink-0 items-center gap-1.5 sm:gap-2"
          >
            {index > 0 && (
              <ChevronRight
                size={15}
                className="shrink-0 text-slate-400"
                aria-hidden="true"
              />
            )}

            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="inline-flex items-center gap-1.5 rounded-md text-slate-500 transition-colors hover:text-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
              >
                {index === 0 && (
                  <House size={15} className="shrink-0" />
                )}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={`max-w-[180px] truncate ${
                  isLast
                    ? "font-semibold text-slate-800"
                    : "text-slate-500"
                }`}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
