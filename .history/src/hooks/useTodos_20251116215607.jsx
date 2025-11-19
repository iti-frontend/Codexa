"use client";
import { useState, useEffect, useMemo } from "react";
import {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodoDone,
  deleteTodo,
} from "@/services/todoService";

export default function useTodos() {

  // State
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [filterDone, setFilterDone] = useState(null); 
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterDate, setFilterDate] = useState(null);

  const [stats, setStats] = useState({ total: 0, done: 0, notDone: 0 });

  const calculateStats = (todosArray) => {
    const total = todosArray.length;
    const done = todosArray.filter(t => t.isDone).length;
    const notDone = total - done;
    setStats({ total, done, notDone });
  };

  // Fetch initial todos  
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const data = await getTodos({});
        const todosArray = data.items || data || [];
        setTodos(todosArray);
        calculateStats(todosArray);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load todos");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);


  // Filtered todos (auto update)
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const doneMatch = filterDone === null ? true : todo.isDone === filterDone;
      const priorityMatch = filterPriority === "all" ? true : todo.priority === filterPriority;
      const dateMatch = filterDate ? todo.date === filterDate : true;
      return doneMatch && priorityMatch && dateMatch;
    });
  }, [todos, filterDone, filterPriority, filterDate]);


  // Add new todo 
 
  const addTodo = async (todoData) => {
    // Create temporary todo for instant UI update
    const tempId = `temp-${Date.now()}`;
    const tempTodo = {
      ...todoData,
      _id: tempId,
      id: tempId,
      isDone: false,
      createdAt: new Date().toISOString(),
    };

    setTodos(prev => {
      const newTodos = [...prev, tempTodo];
      calculateStats(newTodos);
      return newTodos;
    });

    try {
      const response = await createTodo(todoData);
      const newTodo = response.data || response;

      setTodos(prev =>
        prev.map(t => (t._id === tempId ? { ...newTodo, _id: newTodo._id || newTodo.id } : t))
      );
      calculateStats(todos); // recalc stats
      return { success: true, data: newTodo };
    } catch (err) {
      // rollback on error
      setTodos(prev => {
        const reverted = prev.filter(t => t._id !== tempId);
        calculateStats(reverted);
        return reverted;
      });
      return { success: false, message: err.response?.data?.message || "Failed to create todo" };
    }
  };

  // -----------------------------
  // Toggle todo done (optimistic update)
  // -----------------------------
  const toggleDone = async (id, currentStatus) => {
    const newStatus = !currentStatus;

    // Optimistic update
    setTodos(prev => {
      const updated = prev.map(t => (t._id === id || t.id === id ? { ...t, isDone: newStatus } : t));
      calculateStats(updated);
      return updated;
    });

    try {
      await toggleTodoDone(id, newStatus);
      return { success: true };
    } catch (err) {
      // rollback
      setTodos(prev => {
        const reverted = prev.map(t => (t._id === id || t.id === id ? { ...t, isDone: currentStatus } : t));
        calculateStats(reverted);
        return reverted;
      });
      return { success: false, message: err.response?.data?.message || "Failed to toggle todo" };
    }
  };

  // -----------------------------
  // Delete todo (optimistic update)
  // -----------------------------
  const removeTodo = async (id) => {
    const deletedTodo = todos.find(t => t._id === id || t.id === id);

    // Instant removal
    setTodos(prev => {
      const updated = prev.filter(t => t._id !== id && t.id !== id);
      calculateStats(updated);
      return updated;
    });

    try {
      await deleteTodo(id);
      return { success: true };
    } catch (err) {
      // rollback
      if (deletedTodo) {
        setTodos(prev => {
          const reverted = [...prev, deletedTodo];
          calculateStats(reverted);
          return reverted;
        });
      }
      return { success: false, message: err.response?.data?.message || "Failed to delete todo" };
    }
  };

  // -----------------------------
  // Edit todo (optimistic update)
  // -----------------------------
  const editTodo = async (id, updates) => {
    const originalTodo = todos.find(t => t._id === id || t.id === id);

    // Instant update
    setTodos(prev => {
      const updated = prev.map(t => (t._id === id || t.id === id ? { ...t, ...updates } : t));
      calculateStats(updated);
      return updated;
    });

    try {
      await updateTodo(id, updates);
      return { success: true };
    } catch (err) {
      // rollback
      if (originalTodo) {
        setTodos(prev => {
          const reverted = prev.map(t => (t._id === id || t.id === id ? originalTodo : t));
          calculateStats(reverted);
          return reverted;
        });
      }
      return { success: false, message: err.response?.data?.message || "Failed to update todo" };
    }
  };

  // -----------------------------
  // Return hook API
  // -----------------------------
  return {
    todos: filteredTodos, // return filtered todos
    stats,
    loading,
    error,
    filterDone,
    setFilterDone,
    filterPriority,
    setFilterPriority,
    filterDate,
    setFilterDate,
    addTodo,
    editTodo,
    toggleDone,
    removeTodo,
  };
}
