import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/useAuth";
import { isEmployee, same } from "../../utils/roles";
import "./Lead.css";

const API = "http://localhost:8000";

function TeamLeader() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [userResponse, teamResponse, taskResponse] = await Promise.all([
          axios.get(`${API}/users`),
          axios.get(`${API}/teams`),
          axios.get(`${API}/tasks`),
        ]);
        setUsers(userResponse.data);
        setTeams(teamResponse.data);
        setTasks(taskResponse.data);
      } catch (loadError) {
        console.error("Unable to load team leader dashboard:", loadError);
        setError("Could not load your team. Check that JSON Server is running.");
      }
    };
    load();
  }, []);

  const team = teams.find((item) => same(item.leadId, user?.id));
  const members = team
    ? users.filter((item) => isEmployee(item) && same(item.teamId, team.id))
    : [];
  const memberIds = members.map((member) => member.id);
  const teamTasks = tasks.filter((task) =>
    memberIds.some((memberId) => same(memberId, task.assignedTo)),
  );
  const completedTasks = teamTasks.filter((task) => task.status === "completed").length;

  return (
    <div className="lead-page">
      <div className="lead-page-heading">
        <div>
          <p className="lead-eyebrow">TEAM LEAD</p>
          <h1>My Team</h1>
          <p className="lead-intro">Your team, members, and current workload.</p>
        </div>
      </div>

      {error && <p className="lead-error" role="alert">{error}</p>}

      {!error && !team && (
        <div className="lead-card lead-notice">
          <div className="lead-notice-icon">i</div>
          <div>
            <h2>No team assigned yet</h2>
            <p>Ask an administrator to create a team and assign you as its team leader. Your team members and tasks will appear here.</p>
          </div>
        </div>
      )}

      {team && (
        <>
          <section className="lead-stats" aria-label="Team summary">
            <article className="lead-stat-card">
              <span className="lead-stat-icon lead-icon-purple">T</span>
              <div><p>Team</p><h2>{team.name}</h2></div>
            </article>
            <article className="lead-stat-card">
              <span className="lead-stat-icon lead-icon-blue">M</span>
              <div><p>Team members</p><h2>{members.length}</h2></div>
            </article>
            <article className="lead-stat-card">
              <span className="lead-stat-icon lead-icon-green">✓</span>
              <div><p>Completed tasks</p><h2>{completedTasks} <small>of {teamTasks.length}</small></h2></div>
            </article>
          </section>

          <section className="lead-card lead-members">
            <div className="lead-section-heading">
              <div>
                <h2>Team members</h2>
                <p>Employees assigned to {team.name}</p>
              </div>
              <span className="lead-count">{members.length} members</span>
            </div>
            <div className="lead-table-wrap">
              <table className="lead-table">
                <thead><tr><th>Employee</th><th>Email</th><th>Tasks</th><th>Completed</th></tr></thead>
                <tbody>
                  {members.length === 0 ? (
                    <tr><td className="lead-empty" colSpan="4">No employees have been assigned to this team yet.</td></tr>
                  ) : members.map((member) => {
                    const assignedTasks = teamTasks.filter((task) => same(task.assignedTo, member.id));
                    const completed = assignedTasks.filter((task) => task.status === "completed").length;
                    return (
                      <tr key={member.id}>
                        <td><span className="lead-avatar">{member.name?.trim().charAt(0).toUpperCase() || "E"}</span>{member.name}</td>
                        <td>{member.email}</td>
                        <td>{assignedTasks.length}</td>
                        <td>{completed}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default TeamLeader;
