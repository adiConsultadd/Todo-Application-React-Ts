interface Task {
    text: string;
    completed: boolean;
}

type TodoListItemProps = {
    task: Task;
    index: number;
    editIndex: number | null;
    editText: string;
    setEditText: (text: string) => void;
    startEditing: (index: number) => void;
    saveEdit: () => void;
    deleteTask: (index: number) => void;
    toggleComplete: (index: number) => void;
    moveTaskUp: (index: number) => void;
    moveTaskDown: (index: number) => void;
};

export default function TodoListItem({
    task,
    index,
    editIndex,
    editText,
    setEditText,
    startEditing,
    saveEdit,
    deleteTask,
    toggleComplete,
    moveTaskUp,
    moveTaskDown,
}: TodoListItemProps) {
    return (
        <li className="bg-gray-100 rounded-lg border border-gray-300 shadow-md p-4 flex items-center justify-between">
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
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition" onClick={() => startEditing(index)}>
                        Edit
                    </button>
                )}
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition" onClick={() => deleteTask(index)}>
                    Delete
                </button>
                <button className="bg-gray-700 text-white px-3 py-1 rounded-md" onClick={() => moveTaskUp(index)}>
                    ⬆️
                </button>
                <button className="bg-gray-700 text-white px-3 py-1 rounded-md" onClick={() => moveTaskDown(index)}>
                    ⬇️
                </button>
            </div>
        </li>
    );
}
