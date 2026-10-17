import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/useAuth";
import { same } from "../../utils/roles";
import "./MyTasks.css";

const API = "http://localhost:8000";
const statuses = ["todo", "in-progress", "completed"];

function displayStatus(status) {
  if (status === "completed") return "Completed";
  if (status === "in-progress" || status === "ongoing") return "Ongoing";
  return "Pending";
}

function MyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await axios.get(`${API}/tasks`);
        setTasks(response.data.filter((task) => same(task.assignedTo, user?.id)));
      } catch (loadError) {
        console.error("Unable to load employee tasks:", loadError);
        setError("Could not load your tasks. Check that JSON Server is running.");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [user?.id]);

  const updateStatus = async (task, status) => {
    setError("");
    try {
      await axios.patch(`${API}/tasks/${task.id}`, { status });
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          same(currentTask.id, task.id) ? { ...currentTask, status } : currentTask,
        ),
      );
    } catch (updateError) {
      console.error("Unable to update employee task status:", updateError);
      setError("Could not update the task status. Try again.");
    }
  };

  return (
    <section className="employee-tasks-page">
      <h1>My Tasks</h1>

      {error && <p className="employee-tasks-error" role="alert">{error}</p>}

      {loading ? (
        <p className="employee-tasks-message">Loading your tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="employee-tasks-message">No tasks have been assigned to you yet.</p>
      ) : (
        <div className="employee-task-grid">
          {tasks.map((task) => (
            <article className="employee-task-card" key={task.id}>
              <div className="employee-task-heading">
                <h2>{task.title}</h2>
                <span className={`employee-task-status employee-task-status-${task.status || "todo"}`}>
                  {displayStatus(task.status)}
                </span>
              </div>
              {task.description && <p className="employee-task-description">{task.description}</p>}
              <label className="employee-task-status-label" htmlFor={`task-status-${task.id}`}>
                Change status
              </label>
              <select
                id={`task-status-${task.id}`}
                value={statuses.includes(task.status) ? task.status : task.status || "todo"}
                onChange={(event) => updateStatus(task, event.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{displayStatus(status)}</option>
                ))}
                {task.status && !statuses.includes(task.status) && (
                  <option value={task.status}>{displayStatus(task.status)}</option>
                )}
              </select>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyTasks;
