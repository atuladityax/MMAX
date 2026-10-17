import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LabelList, CartesianGrid,
} from "recharts";
import { isLead, isEmployee, same } from "../../utils/roles";
import "./Dashboard.css";

const API = "http://localhost:8000";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [u, t] = await Promise.all([
          axios.get(`${API}/users`),
          axios.get(`${API}/teams`),
        ]);
        setUsers(u.data);
        setTeams(t.data);
      } catch {
        setError("Cannot load data. Is JSON Server running?");
      }
    };
    load();
  }, []);

  const totalEmployees = users.filter(isEmployee).length;
  const totalLeads = users.filter(isLead).length;
  const chartData = teams.map((t) => ({
    name: t.name,
    employees: users.filter((u) => isEmployee(u) && same(u.teamId, t.id)).length,
  }));

  return (
    <div className="dash-page">
      <h1>Dashboard</h1>
      {error && <p className="dash-error">{error}</p>}

      <div className="dash-cards">
        <div className="dash-card dash-purple">
          <p>Total teams</p>
          <h2>{teams.length}</h2>
        </div>
        <div className="dash-card dash-green">
          <p>Total employees</p>
          <h2>{totalEmployees}</h2>
        </div>
        <div className="dash-card dash-orange">
          <p>Team leaders</p>
          <h2>{totalLeads}</h2>
        </div>
      </div>

      <div className="dash-chart-box">
        <h3>Team vs Employee</h3>
        <p className="dash-sub">Number of employees in each team</p>

        {chartData.length === 0 ? (
          <p className="dash-empty">No teams yet. Add a team to see the graph.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="employees" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={70}>
                <LabelList dataKey="employees" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default Dashboard;