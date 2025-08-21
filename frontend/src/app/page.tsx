"use client";

import { useEffect, useState } from "react";
import { Task, ApiResponse } from "./types";
import axios from "axios";

// Lucide Icons
import { Edit, Trash2, Check, X } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const API = "http://localhost:5000/api";

  const fetchTasks = async () => {
    try {
      const res = await axios.get<ApiResponse<Task[]>>(API);
      if (res.data.status === "success" && res.data.data) {
        setTasks(res.data.data);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    if (!newTask.trim()) return setErrorMessage("Task text is required");

    try {
      await axios.post(API, { text: newTask });
      setNewTask("");
      await fetchTasks();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to add task");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API}/${id}`);
      await fetchTasks();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to delete task");
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editingText.trim()) return setErrorMessage("Task text is required");

    try {
      await axios.put(`${API}/${id}`, { text: editingText });
      setEditingId(null);
      setEditingText("");
      await fetchTasks();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update task");
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await axios.put(`${API}/${task.id}`, { done: !task.done });
      await fetchTasks();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update task status");
    }
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
          <li key={task.id} className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={task.done} onChange={() => handleToggleComplete(task)} className="w-5 h-5 accent-blue-500" />
              {editingId === task.id ? (
                <input className="border p-1 rounded flex-1 focus:outline-none focus:ring focus:ring-green-300" value={editingText} onChange={(e) => setEditingText(e.target.value)} />
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
