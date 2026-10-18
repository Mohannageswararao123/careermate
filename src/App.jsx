
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/dashboard";
import Practice from "./pages/practice";
import History from "./pages/history";
import Profile from "./pages/profile";
import AddQuestion from "./pages/add-questions";<q></q>

export default function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-area">
        <header className="topbar">
          <span className="brand-name">CareerMate</span>
          <span className="status-label">
            <span className="status-dot" />
            Career Preparation Manager
          </span>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/questions/new" element={<AddQuestion />} />
          <Route path="/questions/:id/edit" element={<AddQuestion />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
