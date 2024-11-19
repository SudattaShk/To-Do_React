import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]); // To store the list of tasks
  const [newTask, setNewTask] = useState(""); // To handle input for new tasks
  const [editingTask, setEditingTask] = useState(null); // To track the task being edited
  const [taskDetails, setTaskDetails] = useState(null); // To show details of a task

  // Load tasks from local storage when the app loads
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to local storage whenever the task list changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = () => {
    if (!newTask.trim()) return;
    const task = { id: Date.now(), title: newTask, details: "" };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  // Edit an existing task
  const saveEdit = (id, newTitle) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
    setEditingTask(null);
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Show task details
  const viewDetails = (id) => {
    const task = tasks.find((task) => task.id === id);
    setTaskDetails(task);
  };

  // Update task details in the task list
  const updateDetails = (id, newDetails) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, details: newDetails } : task
      )
    );
    setTaskDetails({ ...taskDetails, details: newDetails }); // Update modal view
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>

      {/* Add New Task */}
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* List of Tasks */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {editingTask === task.id ? (
              <input
                type="text"
                defaultValue={task.title}
                onBlur={(e) => saveEdit(task.id, e.target.value)}
                autoFocus
              />
            ) : (
              <>
                <span>{task.title}</span>
                <button onClick={() => setEditingTask(task.id)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
                <button onClick={() => viewDetails(task.id)}>Details</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Task Details Modal */}
      {taskDetails && (
        <div className="modal">
          <h2>Task Details</h2>
          <p><strong>Title:</strong> {taskDetails.title}</p>
          <textarea
            value={taskDetails.details}
            onChange={(e) => updateDetails(taskDetails.id, e.target.value)}
            placeholder="Add more details..."
          />
          <button onClick={() => setTaskDetails(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;
