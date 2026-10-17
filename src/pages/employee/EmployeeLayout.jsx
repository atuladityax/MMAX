import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function EmployeeLayout() {
  return (
    <div className="layout employee-layout">
      <Sidebar />
      <div className="layout-main">
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}