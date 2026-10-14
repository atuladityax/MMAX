import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

import ProtectedRoute from "./components/ProtectedRoute";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Teams from "./pages/admin/Teams";
import TeamDetails from "./pages/admin/TeamDetails";
import Employees from "./pages/admin/Employees";
import Approvals from "./pages/admin/Approvals";
import EmployeeTasks from "./pages/admin/EmployeeTasks";

// Employee
import EmployeeLayout from "./pages/employee/EmployeeLayout";
import Employee from "./pages/employee/Employee";
import MyTasks from "./pages/employee/MyTasks";

// Lead
import LeadLayout from "./pages/lead/LeadLayout";
import TeamLeader from "./pages/lead/TeamLeader";
import Tasks from "./pages/lead/Tasks";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/teams" element={<Teams />} />
          <Route path="/admin/teams/:id" element={<TeamDetails />} />
          <Route path="/admin/employees" element={<Employees />} />
          <Route path="/admin/approvals" element={<Approvals />} />
          <Route path="/admin/tasks" element={<EmployeeTasks />} />
        </Route>
      </Route>

      {/* Team Leader */}
      <Route element={<ProtectedRoute allowedRoles={["lead", "teamLeader"]} />}>
        <Route element={<LeadLayout />}>
          <Route path="/lead" element={<TeamLeader />} />
          <Route path="/lead/tasks" element={<Tasks />} />
        </Route>
      </Route>

     
      <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
        <Route element={<EmployeeLayout />}>
          <Route path="/employee" element={<Employee />} />
          <Route path="/employee/tasks" element={<MyTasks />} />
        </Route>
      </Route>

      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;