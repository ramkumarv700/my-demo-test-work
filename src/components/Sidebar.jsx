
import { NavLink } from "react-router-dom"

function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Users", path: "/users" },
    { name: "Settings", path: "/settings" },
    { name: "Profile", path: "/profile" },
    { name: "Contact", path: "/contact" },
    { name: "C2", path: "/c2" },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-64 flex-col
          border-r border-slate-200
          bg-white
          transition-transform duration-300
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
          <h1 className="text-xl font-bold text-slate-900">
            Workinfo
          </h1>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `
                  flex min-h-10 items-center
                  rounded-full px-4 py-3
                  text-sm font-medium
                  transition-colors
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-violet-600
                  ${
                    isActive
                      ? "bg-violet-600 text-white hover:bg-violet-700"
                      : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                  }
                `
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
