import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/useAuth";
import { isEmployee, same } from "../../utils/roles";
import "./Lead.css";

const API = "http://localhost:8000";
const emptyForm = { title: "", description: "", assignedTo: "" };
const statuses = ["todo", "in-progress", "completed"];

function displayStatus(status) {
  if (status === "completed") return "Completed";
  if (status === "in-progress" || status === "ongoing") return "Ongoing";
  return "Pending";
}

function Tasks() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    try {
      const [userResponse, teamResponse, taskResponse] = await Promise.all([
        axios.get(`${API}/users`),
        axios.get(`${API}/teams`),
        axios.get(`${API}/tasks`),
      ]);
      setUsers(userResponse.data);
      setTeams(teamResponse.data);
      setTasks(taskResponse.data);
      setError("");
    } catch (loadError) {
      console.error("Unable to load team tasks:", loadError);
      setError("Could not load team tasks. Check that JSON Server is running.");
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadData();
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

  const resetForm = () => {
    setForm(emptyForm);
    setEditingTask(null);
    setError("");
  };

  const editTask = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title ?? "",
      description: task.description ?? "",
      assignedTo: task.assignedTo == null ? "" : String(task.assignedTo),
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveTask = async (event) => {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setError("Enter a title for the task.");
      return;
    }
    if (!form.assignedTo || !members.some((member) => same(member.id, form.assignedTo))) {
      setError("Select an employee from your team.");
      return;
    }

    setIsSaving(true);
    try {
      const taskData = {
        title,
        description: form.description.trim(),
        assignedTo: form.assignedTo,
        teamId: team.id,
      };
      if (editingTask) {
        await axios.patch(`${API}/tasks/${editingTask.id}`, taskData);
      } else {
        await axios.post(`${API}/tasks`, { ...taskData, status: "todo" });
      }
      resetForm();
      await loadData();
    } catch (saveError) {
      console.error("Unable to save team task:", saveError);
      setError("Could not save the task. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTask = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await axios.delete(`${API}/tasks/${task.id}`);
      await loadData();
    } catch (deleteError) {
      console.error("Unable to delete team task:", deleteError);
      setError("Could not delete the task. Try again.");
    }
  };

  const updateStatus = async (task, status) => {
    try {
      await axios.patch(`${API}/tasks/${task.id}`, { status });
      await loadData();
    } catch (updateError) {
      console.error("Unable to update task status:", updateError);
      setError("Could not update the task status. Try again.");
    }
  };

  return (
    <div className="lead-page lead-tasks-page">
      <div className="lead-page-heading">
        <div>
          <p className="lead-eyebrow">TEAM WORKSPACE</p>
          <h1>Tasks</h1>
          <p className="lead-intro">{team ? `Manage assignments for ${team.name}.` : "Manage and track your team's work."}</p>
        </div>
      </div>

      {error && <p className="lead-error" role="alert">{error}</p>}

      {!team ? (
        <div className="lead-card lead-notice">
          <div className="lead-notice-icon">i</div>
          <div>
            <h2>No team assigned yet</h2>
            <p>An administrator needs to assign you to a team before you can create tasks for its employees.</p>
          </div>
        </div>
      ) : (
        <div className="lead-task-grid">
          <form className="lead-card lead-task-form" onSubmit={saveTask}>
            <div className="lead-section-heading">
              <div>
                <h2>{editingTask ? "Edit task" : "New task"}</h2>
                <p>{editingTask ? "Update the task details." : "Add a task for a team member."}</p>
              </div>
            </div>

            <label htmlFor="lead-task-title">Title</label>
            <input
              id="lead-task-title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="e.g. Prepare project update"
            />

            <label htmlFor="lead-task-description">Description</label>
            <textarea
              id="lead-task-description"
              rows="3"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Add instructions or details"
            />

            <label htmlFor="lead-task-assignee">Assign to</label>
            <select
              id="lead-task-assignee"
              value={form.assignedTo}
              onChange={(event) => setForm({ ...form, assignedTo: event.target.value })}
            >
              <option value="">Select a team member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>

            {members.length === 0 && (
              <p className="lead-form-hint">No employees are assigned to this team yet.</p>
            )}

            <button className="lead-primary-button" type="submit" disabled={isSaving || members.length === 0}>
              {isSaving ? "Saving..." : editingTask ? "Save changes" : "Create task"}
            </button>
            {editingTask && (
              <button className="lead-secondary-button" type="button" onClick={resetForm}>
                Cancel editing
              </button>
            )}
          </form>

          <section className="lead-card lead-task-list">
            <div className="lead-section-heading">
              <div>
                <h2>Team tasks</h2>
                <p>Tasks assigned to employees on your team</p>
              </div>
              <span className="lead-count">{teamTasks.length} tasks</span>
            </div>

            <div className="lead-table-wrap">
              <table className="lead-table">
                <thead>
                  <tr><th>Task</th><th>Assigned to</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {teamTasks.length === 0 ? (
                    <tr><td colSpan="4" className="lead-empty">No tasks yet. Create the first task for your team.</td></tr>
                  ) : teamTasks.map((task) => {
                    const assignee = members.find((member) => same(member.id, task.assignedTo));
                    const statusLabel = displayStatus(task.status);
                    return (
                      <tr key={task.id}>
                        <td>
                          <strong>{task.title}</strong>
                          {task.description && <small>{task.description}</small>}
                        </td>
                        <td>{assignee?.name ?? "Team member"}</td>
                        <td>
                          <select
                            className={`lead-status-select lead-status-${task.status || "todo"}`}
                            value={task.status || "todo"}
                            aria-label={`Status for ${task.title}`}
                            onChange={(event) => updateStatus(task, event.target.value)}
                          >
                            {statuses.map((status) => <option key={status} value={status}>{displayStatus(status)}</option>)}
                            {task.status && !statuses.includes(task.status) && (
                              <option value={task.status}>{statusLabel}</option>
                            )}
                          </select>
                        </td>
                        <td className="lead-actions">
                          <button className="lead-action-edit" onClick={() => editTask(task)}>Edit</button>
                          <button className="lead-action-delete" onClick={() => deleteTask(task)}>Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Tasks;
