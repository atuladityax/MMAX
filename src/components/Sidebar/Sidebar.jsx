import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const menus = {
  admin: [
    { label: "Dashboard", path: "/admin" },
    { label: "Teams", path: "/admin/teams" },
    { label: "Employees", path: "/admin/employees" },
    { label: "Employee Tasks", path: "/admin/tasks" },
  ],
  lead: [
    { label: "My Team", path: "/lead" },
    { label: "Tasks", path: "/lead/tasks" },
  ],
  employee: [
    { label: "My Tasks", path: "/employee/tasks" },
  ],
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const roleKey = user?.role?.replace(/\s+/g, "").toLowerCase();
  const normalizedRole =
    roleKey === "teamleader" ? "teamLeader" : roleKey;

  const menuItems = menus[normalizedRole] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`sidebar${normalizedRole === "employee" ? " sidebar-employee" : ""}`}>
      <div className="sidebar-brand">
        <h2>MMAX</h2>
        {normalizedRole === "employee" && <p>Employee</p>}
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-profile">
        <div>
          <h3>{user?.name || "User"}</h3>
          <p>{user?.role || "Guest"}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          {normalizedRole === "employee" ? "Sign out" : "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;