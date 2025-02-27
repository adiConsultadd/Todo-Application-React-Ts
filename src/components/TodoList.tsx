import { useState, useEffect } from "react";
import TodoListItem from "@components/TodoListItem";

interface Task {
  text: string;
  completed: boolean;
}

type FilterType = "all" | "active" | "completed";

export default function TodoList() {
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
      setTasks([...tasks, { text: newTask, completed: false }]);
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
        [updatedTasks[index], updatedTasks[index - 1]] = [
          updatedTasks[index - 1],
          updatedTasks[index],
        ];
        return updatedTasks;
      });
    }
  }

  function moveTaskDown(index: number) {
    if (index < tasks.length - 1) {
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];
        [updatedTasks[index], updatedTasks[index + 1]] = [
          updatedTasks[index + 1],
          updatedTasks[index],
        ];
        return updatedTasks;
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-950 text-white rounded-lg shadow-lg border border-gray-600">
      <h1 className="text-3xl font-bold text-center text-gray-300 mb-6">To-Do</h1>
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          placeholder="Enter a Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-500"
          onKeyPress={(e) => e.key === "Enter" && addTask()}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition" onClick={addTask}>
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
      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks to display</p>
      ) : (
        <ul className="space-y-3">
          {filteredTasks.map((task, index) => (
            <TodoListItem
              key={index}
              task={task}
              index={index}
              editIndex={editIndex}
              editText={editText}
              setEditText={setEditText}
              startEditing={startEditing}
              saveEdit={saveEdit}
              deleteTask={deleteTask}
              toggleComplete={toggleComplete}
              moveTaskUp={moveTaskUp}
              moveTaskDown={moveTaskDown}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
