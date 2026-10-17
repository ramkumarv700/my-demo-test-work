
import { Link, useLocation } from "react-router-dom";
import { House, ChevronRight } from "lucide-react";

function Breadcrumb({ items = [] }) {
  const location = useLocation();

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 flex min-w-0 flex-wrap items-center gap-1.5 text-xs sm:gap-2 sm:text-sm"
    >
      {items.map((item, index) => {
        const isActive = item.to
          ? location.pathname.replace(/\/+$/, "") ===
            item.to.replace(/\/+$/, "")
          : index === items.length - 1;

        return (
          <div
            key={`${item.label}-${index}`}
            className="flex min-w-0 items-center gap-1.5 sm:gap-2"
          >
            {index > 0 && (
              <ChevronRight
                size={15}
                className="shrink-0 text-slate-400"
                aria-hidden="true"
              />
            )}

            {item.to ? (
              <Link
                to={item.to}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex min-w-0 items-center gap-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 ${
                  isActive
                    ? "font-semibold text-slate-800"
                    : "font-normal text-slate-500 hover:text-slate-800"
                }`}
              >
                {index === 0 && (
                  <House
                    size={15}
                    className="shrink-0"
                    aria-hidden="true"
                  />
                )}

                <span className="truncate">{item.label}</span>
              </Link>
            ) : (
              <span
                aria-current={isActive ? "page" : undefined}
                className={`max-w-full truncate ${
                  isActive
                    ? "font-semibold text-slate-800"
                    : "font-normal text-slate-500"
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
