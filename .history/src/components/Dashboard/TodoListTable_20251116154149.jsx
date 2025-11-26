"use client";
const [editDate, setEditDate] = useState(new Date());
const [saving, setSaving] = useState(false);


// Fetch todos from API
const fetchTodos = useCallback(async () => {
try {
setLoading(true);
const params = {};


if (filterStatus !== "all") {
// API expects isDone (matches our model)
params.isDone = filterStatus === "Completed";
}


// If you want server-side priority filtering, add it here
if (filterPriority !== "all") {
params.priority = filterPriority.toLowerCase();
}


if (filterDate) {
// send as YYYY-MM-DD to API if supported
params.dueDate = format(filterDate, "yyyy-MM-dd");
}


const response = await todoService.getTodos(params);
// normalize items: ensure array
setTasks(response?.items || response || []);
} catch (error) {
console.error("Error fetching todos:", error);
setTasks([]);
} finally {
setLoading(false);
}
}, [filterStatus, filterPriority, filterDate]);


// Add new task
const handleAddTask = async () => {
if (!newTask.trim()) return;


try {
const todoData = {
title: newTask.trim(),
priority: newPriority,
dueDate: newDate ? newDate.toISOString() : null,
};


await todoService.createTodo(todoData);
setNewTask("");
setNewPriority("medium");
setNewDate(new Date());
await fetchTodos();
onTodoUpdate?.();
} catch (error) {
console.error("Error creating todo:", error);
alert("Failed to create task. Check console for details.");
}
};


// Delete task
const handleDeleteTask = async (task) => {
const id = getId(task);
if (!id) return;


if (!confirm("Are you sure you want to delete this task?")) return;


try {
await todoService.deleteTodo(id);
await fetchTodos();
onTodoUpdate?.();
} catch (error) {
console.error("Error deleting todo:", error);
alert("Failed to delete task. Check console for details.");
}
};


// Start editing task
const handleEditTask = (task) => {
const id = getId(task);
setEditingTaskId(id);
setEditTitle(task.title || "");
setEditPriority(task.priority || "medium");
setEditDate(task.dueDate ? new Date(task.dueDate) : new Date());
};


// Save edited task
const handleSaveEdit = async (task) => {
const id = getId(task);
if (!id) return;