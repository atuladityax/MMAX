import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function AdminLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <header className="layout-header"></header>
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
