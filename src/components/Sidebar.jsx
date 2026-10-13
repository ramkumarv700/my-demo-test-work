import { NavLink } from "react-router-dom"

function Sidebar({ isOpen, onClose }) {

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard"
    },
    {
      name: "Users",
      path: "/users"
    },
    {
      name: "Settings",
      path: "/settings"
    },
    {
      name: "Profile",
      path: "/profile"
    },
    {
      name: "Contact",
      path: "/contact"
    },
    {
      name: "C2",
      path: "/c2"
    }
  ]

  return (
    <>
      {/* Mobile Overlay */}

      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}


      {/* Sidebar */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          h-screen
          w-64
          border-r
          bg-white
          transition-transform
          duration-300

          ${isOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >

        {/* Logo */}

        <div className="flex h-16 items-center justify-between border-b px-5">

          <h1 className="text-xl font-bold text-gray-900">
            Workinfo
          </h1>

          {/* Close button */}

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            ✕
          </button>

        </div>


        {/* Menu */}

        <nav className="space-y-1 p-4">

          {menuItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `
                block
                rounded-lg
                px-4
                py-3
                text-sm
                font-medium
                transition

                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
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