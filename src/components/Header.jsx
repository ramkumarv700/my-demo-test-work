import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { logout } from "../redux/slices/authSlice"

function Header({ onMenuClick }) {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(
    (state) => state.auth.user
  )

  const handleLogout = () => {

    dispatch(logout())

    navigate("/login")
  }

  return (

    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-5 md:px-6">

      {/* Left */}

      <div className="flex items-center gap-3">

        {/* Mobile Menu */}

        <button
          onClick={onMenuClick}
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          ☰
        </button>

        <h2 className="section-title">
          Admin Dashboard
        </h2>

      </div>


      {/* Right */}

      <div className="flex items-center gap-2 sm:gap-4">

        {/* User info */}

        <div className="hidden text-right sm:block">

          <p className="text-sm font-semibold">
            {user?.name || "Admin"}
          </p>

          <p className="text-xs text-gray-500">
            {user?.role || "Administrator"}
          </p>

        </div>


        {/* Avatar */}

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {user?.name?.charAt(0) || "A"}
        </div>


        {/* Logout */}

        <button
          onClick={handleLogout}
          className="rounded-full border border-[#CBD5E1] px-2 py-1 text-xs font-medium text-[#000000] hover:bg-red-50 sm:px-4 sm:text-sm"
        >
          <span className="hidden sm:inline">
            Logout
          </span>

          <span className="sm:hidden">
            ↪
          </span>
        </button>

      </div>

    </header>

  )
}

export default Header