// hooks/useTodos.js
"use client";
import { useState, useEffect, useCallback } from "react";
import {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodoDone,
  deleteTodo,
  getTodoStats,
} from "@/services/todoService";

export default function useTodos() {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, done: 0, notDone: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filters
  const [filterDone, setFilterDone] = useState(null); // null = all, true = done, false = not done
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterDate, setFilterDate] = useState(null);

  // Fetch Todos
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterDone !== null) params.done = filterDone;
      
      const data = await getTodos(params);
      setTodos(data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch todos");
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  }, [filterDone]);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const data = await getTodoStats();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  // Update stats locally without API call
  const updateStatsLocally = useCallback((todos) => {
    const total = todos.length;
    const done = todos.filter(t => t.isDone).length;
    const notDone = total - done;
    setStats({ total, done, notDone });
  }, []);

  // Add Todo
  const addTodo = async (todoData) => {
    try {
      const newTodo = await createTodo(todoData);
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      updateStatsLocally(updatedTodos);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to create todo",
      };
    }
  };

  // Update Todo
  const editTodo = async (id, updates) => {
    try {
      const updated = await updateTodo(id, updates);
      const updatedTodos = todos.map(t => t._id === id ? updated : t);
      setTodos(updatedTodos);
      updateStatsLocally(updatedTodos);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update todo",
      };
    }
  };

  // Toggle Done Status
  const toggleDone = async (id, currentStatus) => {
    try {
      await toggleTodoDone(id, !currentStatus);
      const updatedTodos = todos.map(t => 
        t._id === id ? { ...t, isDone: !currentStatus } : t
      );
      setTodos(updatedTodos);
      updateStatsLocally(updatedTodos);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to toggle status",
      };
    }
  };

  // Delete Todo
  const removeTodo = async (id) => {
    try {
      await deleteTodo(id);
      const updatedTodos = todos.filter(t => t._id !== id);
      setTodos(updatedTodos);
      updateStatsLocally(updatedTodos);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to delete todo",
      };
    }
  };

  // Initial Load
  useEffect(() => {
    fetchTodos();
    fetchStats();
  }, [fetchTodos, fetchStats]);

  return {
    todos,
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
    refreshTodos: fetchTodos,
    refreshStats: fetchStats,
  };
}