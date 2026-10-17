import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { isEmployee, same } from "../../utils/roles";
import "./Teams.css";

const API = "http://localhost:8000";

function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [teamResponse, userResponse, taskResponse] = await Promise.all([
          axios.get(`${API}/teams/${id}`),
          axios.get(`${API}/users`),
          axios.get(`${API}/tasks`),
        ]);
        setTeam(teamResponse.data);
        setUsers(userResponse.data);
        setTasks(taskResponse.data);
      } catch (loadError) {
        console.error("Unable to load team details:", loadError);
        setError("Could not load team details. Check that the team exists and JSON Server is running.");
      }
    };
    load();
  }, [id]);

  if (error) {
    return (
      <div className="teams-page">
        <p className="teams-error">{error}</p>
        <button className="teams-btn" onClick={() => navigate("/admin/teams")}>
          Back to Teams
        </button>
      </div>
    );
  }

  if (!team) return <p>Loading...</p>;

  const lead = users.find((u) => same(u.id, team.leadId));
  const members = users.filter((u) => isEmployee(u) && same(u.teamId, team.id));

  return (
    <div className="teams-page">
      <div className="teams-top">
        <h1>{team.name}</h1>
        <button className="teams-btn teams-gray" onClick={() => navigate("/admin/teams")}>
          ← Back
        </button>
      </div>

      <div className="teams-card">
        <h2>Team information</h2>
        <p><b>Team Lead:</b> {lead ? lead.name : "Not assigned"}</p>
        <p><b>Total employees:</b> {members.length}</p>
      </div>

      <div className="teams-card">
        <h2>Employees in this team</h2>
        <table className="teams-table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Tasks</th><th>Action</th></tr>
          </thead>
          <tbody>
            {members.length === 0 && (
              <tr><td colSpan="5" className="teams-empty">No employees in this team yet.</td></tr>
            )}
            {members.map((m, i) => (
              <tr key={m.id}>
                <td>{i + 1}</td>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{tasks.filter((t) => same(t.assignedTo, m.id)).length}</td>
                <td>
                  <button className="teams-btn" onClick={() => navigate(`/admin/tasks?employeeId=${m.id}`)}>
                    View tasks
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeamDetails;