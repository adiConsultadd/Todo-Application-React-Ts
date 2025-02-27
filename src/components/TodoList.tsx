import { useState, useEffect } from "react";

interface Task {
  text: string;
  completed: boolean;
}

type FilterType = "all" | "active" | "completed";

export default function TodoList() {
  // Stores All The Tasks  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [filter, setFilter] = useState<FilterType>("all");
  const [newTask, setNewTask] = useState<string>("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  function addTask() {
    if (newTask.trim() !== "") {
      setTasks((oldTasks) => [...oldTasks, { text: newTask, completed: false }]);
      setNewTask("");
    }
  }

  function deleteTask(index: number) {
    setTasks(tasks.filter((_, i) => i !== index));
  }

  function startEditing(index: number) {
    setEditIndex(index);
    setEditText(tasks[index].text);
  }

  function saveEdit() {
    if (editText.trim() !== "" && editIndex !== null) {
      setTasks((prevTasks) =>
        prevTasks.map((task, index) =>
          index === editIndex ? { ...task, text: editText } : task
        )
      );
      setEditIndex(null);
      setEditText("");
    }
  }

  function toggleComplete(index: number) {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function moveTaskUp(index: number) {
    if (index > 0) {
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];
        [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]];
        return updatedTasks;
      });
    }
  }

  function moveTaskDown(index: number) {
    if (index < tasks.length - 1) {
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];
        [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
        return updatedTasks;
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-black text-white rounded-lg shadow-lg border border-gray-600">
      <h1 className="text-3xl font-bold text-center text-gray-300 mb-6">To-Do Application</h1>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4 w-full">
          <input
            type="text"
            placeholder="Enter a Task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-500"
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            onClick={addTask}
          >
            Add Task
          </button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="px-4 py-2 bg-gray-100 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks to display</p>
      ) : (
        <ul className="space-y-3">
          {filteredTasks.map((task, index) => (
            <li key={index} className="bg-gray-100 rounded-lg border border-gray-300 shadow-md p-4 flex items-center justify-between">
              {editIndex === index ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 px-2 py-1 bg-white border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              ) : (
                <span
                  className={`flex-1 cursor-pointer ${task.completed ? "line-through text-black" : "text-black"}`}
                  onClick={() => toggleComplete(index)}
                >
                  {task.text}
                </span>
              )}

              <div className="flex gap-2 ml-4">
                {editIndex === index ? (
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition" onClick={saveEdit}>
                    Save
                  </button>
                ) : (
                  <button className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400 transition" onClick={() => startEditing(index)}>
                    Edit
                  </button>
                )}
                <button className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition" onClick={() => deleteTask(index)}>
                  Delete
                </button>
                <button className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400 transition" onClick={() => moveTaskUp(index)}>
                  ⬆️
                </button>
                <button className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400 transition" onClick={() => moveTaskDown(index)}>
                  ⬇️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
