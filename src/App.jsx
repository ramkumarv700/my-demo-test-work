
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import C2 from "./pages/C2";
import CreateInterview from "./pages/CreateInterview";
import JobDescriptionEditor from "./pages/JobDescriptionEditor";

import Breadcrumb from "./components/common/Breadcrumb";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected Application */}
        <Route element={<ProtectedRoute />}>
          {/* Common Layout: Sidebar + Header */}
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

            {/* Existing Create Interview Page */}
            <Route
              path="/create-interview"
              element={<CreateInterview />}
            />

            {/* New Job Description Editor Page */}
            <Route
              path="/job-description-editor"
              element={<JobDescriptionEditor />}
            />
          </Route>
        </Route>

        {/* Default Route */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Unknown Route */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
