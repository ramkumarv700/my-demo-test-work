import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import MainLayout from "./layout/MainLayout"
import ProtectedRoute from "./components/ProtectedRoute"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Users from "./pages/Users"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"
import Contact from "./pages/Contact"
import C2 from "./pages/C2"

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Login */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* Protected Application */}

        <Route element={<ProtectedRoute />}>

          {/* Common Layout */}

          <Route element={<MainLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/users"
              element={<Users />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/contact"
              element={<Contact />}
            />

            <Route
              path="/c2"
              element={<C2 />}
            />

          </Route>

        </Route>


        {/* Default */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        {/* Unknown */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App