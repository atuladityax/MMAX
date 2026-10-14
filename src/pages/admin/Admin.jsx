// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import "../components/Layout.css";

const AdminLayout = () => {
  const { user } = useAuth();

  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <header className="layout-header">
          <h1>Admin Panel</h1>
          <span className="user-info">
            Logged in as <b>{user?.name}</b> (Admin)
          </span>
        </header>

        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;