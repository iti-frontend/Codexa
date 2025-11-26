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
  const [filterDone, setFilterDone] = useState(null);
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterDate, setFilterDate] = useState(null);

  // Calculate stats from todos array
  const calculateStats = useCallback((todosArray) => {
    const total = todosArray.length;
    const done = todosArray.filter(t => t.isDone === true).length;
    const notDone = total - done;
    console.log("Calculated Stats:", { total, done, notDone, todosArray });
    setStats({ total, done, notDone });
  }, []);

  // Fetch Todos
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterDone !== null) params.done = filterDone;
      
      const data = await getTodos(params);
      console.log("Fetched Todos:", data);
      
      const todosArray = data.items || data || [];
      setTodos(todosArray);
      calculateStats(todosArray);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError(err.response?.data?.message || "Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  }, [filterDone, calculateStats]);

  // Fetch Stats from API
  const fetchStats = useCallback(async () => {
    try {
      const data = await getTodoStats();
      console.log("Fetched Stats from API:", data);
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  // Add Todo
  const addTodo = async (todoData) => {
    try {
      console.log("Adding todo:", todoData);
      const result = await createTodo(todoData);
      console.log("Add result:", result);
      
      // Extract the new todo from response
      const newTodo = result.todo || result.data || result;
      const updatedTodos = [...todos, newTodo];
      
      setTodos(updatedTodos);
      calculateStats(updatedTodos);
      
      return { success: true, data: newTodo };
    } catch (err) {
      console.error("Error adding todo:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to create todo",
      };
    }
  };

  // Update Todo
  const editTodo = async (id, updates) => {
    try {
      console.log("Editing todo:", id, updates);
      const result = await updateTodo(id, updates);
      console.log("Edit result:", result);
      
      const updatedTodo = result.todo || result.data || result;
      const updatedTodos = todos.map(t => 
        (t._id === id || t.id === id) ? { ...t, ...updatedTodo } : t
      );
      
      setTodos(updatedTodos);
      calculateStats(updatedTodos);
      
      return { success: true };
    } catch (err) {
      console.error("Error editing todo:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update todo",
      };
    }
  };

  // Toggle Done Status
  const toggleDone = async (id, currentStatus) => {
    // Update UI immediately (optimistic update)
    const newStatus = !currentStatus;
    const updatedTodos = todos.map(t => 
      (t._id === id || t.id === id) ? { ...t, isDone: newStatus } : t
    );
    setTodos(updatedTodos);
    calculateStats(updatedTodos);

    try {
      console.log("Toggling todo:", { id, currentStatus, newStatus });
      
      const result = await toggleTodoDone(id, newStatus);
      console.log("Toggle API result:", result);
      
      return { success: true };
    } catch (err) {
      console.error("Error toggling todo:", err);
      
      // Revert on error
      setTodos(todos);
      calculateStats(todos);
      
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Failed to toggle status",
      };
    }
  };

  // Delete Todo
  const removeTodo = async (id) => {
    try {
      console.log("Deleting todo:", id);
      await deleteTodo(id);
      
      const updatedTodos = todos.filter(t => t._id !== id && t.id !== id);
      
      setTodos(updatedTodos);
      calculateStats(updatedTodos);
      
      return { success: true };
    } catch (err) {
      console.error("Error deleting todo:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to delete todo",
      };
    }
  };

  // Initial Load
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

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