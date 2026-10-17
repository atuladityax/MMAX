import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { isEmployee, same } from "../../utils/roles";
import "./Teams.css";

const API = "http://localhost:8000";
const emptyForm = { title: "", description: "", assignedTo: "", dueDate: "" };
const taskStatuses = ["todo", "in-progress", "completed"];

function EmployeeTasks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const employeeId = searchParams.get("employeeId") ?? "";

  const loadData = async () => {
    try {
      const [userResponse, taskResponse] = await Promise.all([
        axios.get(`${API}/users`),
        axios.get(`${API}/tasks`),
      ]);
      setUsers(userResponse.data);
      setTasks(taskResponse.data);
      setError("");
    } catch (loadError) {
      console.error("Unable to load employee tasks:", loadError);
      setError("Cannot load tasks. Check that JSON Server is running.");
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadData();
    };
    load();
  }, []);

  const employees = users.filter(isEmployee);
  const visibleTasks = tasks.filter((task) => !employeeId || same(task.assignedTo, employeeId));

  const createTask = async (event) => {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setError("Task title is required.");
      return;
    }
    if (!form.assignedTo || !employees.some((employee) => same(employee.id, form.assignedTo))) {
      setError("Choose an employee for this task.");
      return;
    }
    try {
      await axios.post(`${API}/tasks`, {
        title,
        description: form.description.trim(),
        assignedTo: form.assignedTo,
        dueDate: form.dueDate || null,
        status: "todo",
      });
      setForm(emptyForm);
      setShowForm(false);
      await loadData();
    } catch (createError) {
      console.error("Unable to create task:", createError);
      setError("Could not create the task.");
    }
  };

  const updateStatus = async (task, status) => {
    try {
      await axios.patch(`${API}/tasks/${task.id}`, { status });
      await loadData();
    } catch (updateError) {
      console.error("Unable to update task:", updateError);
      setError("Could not update the task status.");
    }
  };

  const deleteTask = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    try {
      await axios.delete(`${API}/tasks/${task.id}`);
      await loadData();
    } catch (deleteError) {
      console.error("Unable to delete task:", deleteError);
      setError("Could not delete the task.");
    }
  };

  const changeEmployee = (value) => {
    if (value) setSearchParams({ employeeId: value });
    else setSearchParams({});
  };

  return (
    <div className="teams-page">
      <div className="teams-top">
        <h1>Employee Tasks</h1>
        <button className="teams-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Assign Task"}
        </button>
      </div>

      {error && <p className="teams-error">{error}</p>}

      {showForm && (
        <form className="teams-card" onSubmit={createTask}>
          <h2>Assign a task</h2>
          <div className="teams-form-row">
            <label>
              Task title
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            </label>
            <label>
              Employee
              <select value={form.assignedTo} onChange={(event) => setForm({ ...form, assignedTo: event.target.value })}>
                <option value="">Select employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="teams-form-row">
            <label>
              Description
              <input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </label>
            <label>
              Due date
              <input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
            </label>
          </div>
          <button className="teams-btn" type="submit">Create task</button>
        </form>
      )}

      <div className="teams-card teams-table-wrap">
        <div className="teams-form-row">
          <label>
            Filter by employee
            <select value={employeeId} onChange={(event) => changeEmployee(event.target.value)}>
              <option value="">All employees</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>{employee.name}</option>
              ))}
            </select>
          </label>
        </div>
        <table className="teams-table">
          <thead><tr><th>Task</th><th>Employee</th><th>Due date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {visibleTasks.length === 0 ? (
              <tr><td colSpan="5" className="teams-empty">No tasks found.</td></tr>
            ) : visibleTasks.map((task) => {
              const employee = employees.find((item) => same(item.id, task.assignedTo));
              return (
                <tr key={task.id}>
                  <td>
                    <strong>{task.title}</strong>
                    {task.description && <div>{task.description}</div>}
                  </td>
                  <td>{employee?.name ?? "Unknown employee"}</td>
                  <td>{task.dueDate || "—"}</td>
                  <td>
                    <select value={task.status || "todo"} onChange={(event) => updateStatus(task, event.target.value)}>
                      {taskStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                      {task.status && !taskStatuses.includes(task.status) && <option value={task.status}>{task.status}</option>}
                    </select>
                  </td>
                  <td><button className="teams-btn teams-red" onClick={() => deleteTask(task)}>Delete</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeTasks;
