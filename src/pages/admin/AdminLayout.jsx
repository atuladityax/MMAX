import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useAuth } from "../../context/useAuth";

export default function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <header className="layout-header">
          <h1>Admin Panel</h1>
          <span className="user-info">
            Logged in as <b>{user?.name}</b>
          </span>
        </header>
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
