import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isEmployee, same } from "../../utils/roles";
import "./Teams.css";

const API = "http://localhost:8000";
const emptyForm = { name: "", email: "", password: "", teamId: "" };

function Employees() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadData = async () => {
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

  useEffect(() => {
    const load = async () => {
      await loadData();
    };
    load();
  }, []);

  const employees = users.filter(isEmployee);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (emp) => {
    setEditId(emp.id);
    setForm({ name: emp.name, email: emp.email, password: "", teamId: emp.teamId ?? "" });
    setError("");
    setShowForm(true);
  };

  const saveEmployee = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) return setError("Name is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email");
    if (!editId && form.password.length < 4) return setError("Password must be at least 4 characters");
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase() && !same(u.id, editId)))
      return setError("This email is already registered");

    const teamId = form.teamId === "" ? null : form.teamId;

    try {
      if (editId) {
        await axios.patch(`${API}/users/${editId}`, { name, email, teamId });
      } else {
        await axios.post(`${API}/users`, {
          name, email, password: form.password,
          role: "employee", status: "approved", teamId,
        });
      }
      setShowForm(false);
      setError("");
      loadData();
    } catch {
      setError("Could not save the employee");
    }
  };

  const deleteEmployee = async (emp) => {
    if (!window.confirm(`Delete ${emp.name}?`)) return;
    try {
      await axios.delete(`${API}/users/${emp.id}`);
      await loadData();
    } catch (deleteError) {
      console.error("Unable to delete employee:", deleteError);
      setError("Could not delete the employee");
    }
  };

  return (
    <div className="teams-page">
      <div className="teams-top">
        <h1>Employees</h1>
        <button className="teams-btn" onClick={openAdd}>+ Add Employee</button>
      </div>

      {showForm && (
        <form className="teams-card" onSubmit={saveEmployee}>
          <h2>{editId ? "Edit employee" : "New employee"}</h2>
          <div className="teams-form-row">
            <label>
              Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              Email
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
          </div>
          <div className="teams-form-row">
            {!editId && (
              <label>
                Password
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </label>
            )}
            <label>
              Team (Team Lead comes with the team)
              <select value={form.teamId} onChange={(e) => setForm({ ...form, teamId: e.target.value })}>
                <option value="">-- No team --</option>
                {teams.map((t) => {
                  const lead = users.find((u) => same(u.id, t.leadId));
                  return (
                    <option key={t.id} value={t.id}>
                      {t.name} {lead ? `(${lead.name})` : ""}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          {error && <p className="teams-error">{error}</p>}
          <button type="submit" className="teams-btn">Save</button>{" "}
          <button type="button" className="teams-btn teams-gray" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </form>
      )}

      {!showForm && error && <p className="teams-error">{error}</p>}

      <div className="teams-card teams-table-wrap">
        <table className="teams-table employee-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Team Lead</th><th>Team</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 && (
              <tr><td colSpan="5" className="teams-empty">No employees yet.</td></tr>
            )}
            {employees.map((emp) => {
              const team = teams.find((t) => same(t.id, emp.teamId));
              const lead = team ? users.find((u) => same(u.id, team.leadId)) : null;
              return (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{lead ? lead.name : "-"}</td>
                  <td>{team ? team.name : "No team"}</td>
                  <td>
                    <div className="employee-actions">
                      <button className="teams-btn" onClick={() => navigate(`/admin/tasks?employeeId=${emp.id}`)}>View tasks</button>
                      <button className="teams-btn teams-gray" onClick={() => openEdit(emp)}>Edit</button>
                      <button className="teams-btn teams-red" onClick={() => deleteEmployee(emp)}>Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employees;