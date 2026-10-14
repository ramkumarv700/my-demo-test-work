
import { useState } from "react"
import { Outlet } from "react-router-dom"

import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function closeSidebar() {
    setSidebarOpen(false)
  }

  function toggleSidebar() {
    setSidebarOpen((previous) => !previous)
  }

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#F5F6FF]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className="min-w-0 lg:ml-64">
        <Header onMenuClick={toggleSidebar} />

        <main className="min-h-[calc(100vh-64px)] min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
