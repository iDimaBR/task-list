"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2, Check, X } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const handleAdd = () => {
    if (!newTask.trim()) return setErrorMessage("Task text is required");

    const newItem = { id: Date.now(), text: newTask, done: false };
    saveTasks([...tasks, newItem]);
    setNewTask("");
    setErrorMessage("");
  };

  const handleDelete = (id) => {
    saveTasks(tasks.filter((t) => t.id !== id));
  };

  const handleUpdate = (id) => {
    if (!editingText.trim()) return setErrorMessage("Task text is required");

    const updatedTasks = tasks.map((t) => (t.id === id ? { ...t, text: editingText } : t));
    saveTasks(updatedTasks);
    setEditingId(null);
    setEditingText("");
    setErrorMessage("");
  };

  const handleToggleComplete = (id) => {
    const updatedTasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    saveTasks(updatedTasks);
  };

  return (
    <div className="p-6 max-w-xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Task List</h1>
      {errorMessage && <p className="mb-4 text-red-600 text-center">{errorMessage}</p>}

      <div className="flex mb-6 gap-2">
        <input
          className="border p-2 flex-1 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
          placeholder="New task"
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow" onClick={handleAdd}>
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={task.done} onChange={() => handleToggleComplete(task.id)} className="w-5 h-5 accent-blue-500" />
              {editingId === task.id ? (
                <input
                  className="border p-1 rounded flex-1 focus:outline-none focus:ring focus:ring-green-300"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUpdate(task.id);
                  }}
                />
              ) : (
                <span className={`flex-1 ${task.done ? "line-through text-gray-400" : ""}`}>{task.text}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {editingId === task.id ? (
                <>
                  <button className="text-green-600 hover:text-green-800" onClick={() => handleUpdate(task.id)} title="Save">
                    <Check size={18} />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700" onClick={() => setEditingId(null)} title="Cancel">
                    <X size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="text-yellow-500 hover:text-yellow-700"
                    onClick={() => {
                      setEditingId(task.id);
                      setEditingText(task.text);
                    }}
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(task.id)} title="Delete">
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
