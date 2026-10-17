import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { isEmployee, isLead, same } from "../../utils/roles";
import "./Teams.css";

const API = "http://localhost:8000";
const emptyForm = { name: "", leadId: "" };

function Teams() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [teamResponse, userResponse] = await Promise.all([
        axios.get(`${API}/teams`),
        axios.get(`${API}/users`),
      ]);
      setTeams(teamResponse.data);
      setUsers(userResponse.data);
      setError("");
    } catch (loadError) {
      console.error("Unable to load teams:", loadError);
      setError("Cannot load teams. Check that JSON Server is running.");
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadData();
    };
    load();
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (team) => {
    setEditId(team.id);
    setForm({ name: team.name, leadId: team.leadId ?? "" });
    setError("");
    setShowForm(true);
  };

  const saveTeam = async (event) => {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setError("Team name is required.");
      return;
    }
    if (teams.some((team) => team.name.trim().toLowerCase() === name.toLowerCase() && !same(team.id, editId))) {
      setError("A team with this name already exists.");
      return;
    }

    const leadId = form.leadId === "" ? null : form.leadId;
    if (leadId) {
      const lead = users.find((user) => same(user.id, leadId));
      if (!lead || !isLead(lead)) {
        setError("Choose a valid team leader.");
        return;
      }
      if (teams.some((team) => same(team.leadId, leadId) && !same(team.id, editId))) {
        setError("This team leader already leads another team.");
        return;
      }
    }

    try {
      if (editId) {
        await axios.patch(`${API}/teams/${editId}`, { name, leadId });
      } else {
        await axios.post(`${API}/teams`, { name, leadId });
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditId(null);
      await loadData();
    } catch (saveError) {
      console.error("Unable to save team:", saveError);
      setError("Could not save the team.");
    }
  };

  const deleteTeam = async (team) => {
    if (!window.confirm(`Delete ${team.name}? Employees assigned to it will be unassigned.`)) return;
    const members = users.filter((user) => same(user.teamId, team.id));
    try {
      await Promise.all(members.map((member) => axios.patch(`${API}/users/${member.id}`, { teamId: null })));
      await axios.delete(`${API}/teams/${team.id}`);
      await loadData();
    } catch (deleteError) {
      console.error("Unable to delete team:", deleteError);
      setError("Could not delete the team. Check the server and try again.");
    }
  };

  const availableLeads = users.filter((user) => {
    if (!isLead(user)) return false;
    return !teams.some((team) => same(team.leadId, user.id) && !same(team.id, editId));
  });

  return (
    <div className="teams-page">
      <div className="teams-top">
        <h1>Teams</h1>
        <button className="teams-btn" onClick={openAdd}>+ Add Team</button>
      </div>

      {error && <p className="teams-error">{error}</p>}

      {showForm && (
        <form className="teams-card" onSubmit={saveTeam}>
          <h2>{editId ? "Edit team" : "New team"}</h2>
          <div className="teams-form-row">
            <label>
              Team name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label>
              Team leader
              <select value={form.leadId} onChange={(event) => setForm({ ...form, leadId: event.target.value })}>
                <option value="">-- No team leader --</option>
                {availableLeads.map((lead) => (
                  <option key={lead.id} value={lead.id}>{lead.name}</option>
                ))}
              </select>
            </label>
          </div>
          <button className="teams-btn" type="submit">Save</button>{" "}
          <button className="teams-btn teams-gray" type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      <div className="teams-card teams-table-wrap">
        <table className="teams-table">
          <thead>
            <tr><th>Team</th><th>Team leader</th><th>Employees</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {teams.length === 0 ? (
              <tr><td colSpan="4" className="teams-empty">No teams yet. Add a team to get started.</td></tr>
            ) : teams.map((team) => {
              const lead = users.find((user) => same(user.id, team.leadId));
              const employeeCount = users.filter((user) => same(user.teamId, team.id) && isEmployee(user)).length;
              return (
                <tr key={team.id}>
                  <td><Link to={`/admin/teams/${team.id}`}>{team.name}</Link></td>
                  <td>{lead?.name ?? "Not assigned"}</td>
                  <td>{employeeCount}</td>
                  <td>
                    <button className="teams-btn teams-gray" onClick={() => openEdit(team)}>Edit</button>{" "}
                    <button className="teams-btn teams-red" onClick={() => deleteTeam(team)}>Delete</button>
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

export default Teams;
