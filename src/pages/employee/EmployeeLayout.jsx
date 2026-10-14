// src/pages/employee/EmployeeLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function EmployeeLayout() {
  const { user } = useAuth();

  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <header className="layout-header">
          <h1>Employee Panel</h1>
          <span className="user-info">
            Welcome, <b>{user?.name}</b>
          </span>
        </header>
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}