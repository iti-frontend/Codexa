"use client";// Re-fetch when filter changes
  useEffect(() => {
    if (filterDone !== null) {
      fetchTodos();
    }
  }, [filterDone, fetchTodos]);// hooks/useTodos.js

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

  // Fetch Todos when filter changes
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterDone !== null) params.done = filterDone;
      
      const data = await getTodos(params);
      console.log("Fetched Todos Data:", data);
      
      const todosArray = data.items || data || [];
      console.log("Todos Array:", todosArray);
      
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
      // On error, calculate from todos instead
      calculateStats(todos);
    }
  }, [todos, calculateStats]);

  // Add Todo
  const addTodo = async (todoData) => {
    try {
      console.log("Adding todo:", todoData);
      const newTodo = await createTodo(todoData);
      console.log("Created todo:", newTodo);
      
      // newTodo should be the todo object directly
      if (!newTodo._id && !newTodo.id) {
        console.error("Invalid todo response:", newTodo);
        throw new Error("Invalid response from server");
      }
      
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      calculateStats(updatedTodos);
      
      return { success: true, data: newTodo };
    } catch (err) {
      console.error("Error adding todo:", err);
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Failed to create todo",
      };
    }
  };

  // Update Todo
  const editTodo = async (id, updates) => {
    // Optimistic update
    const optimisticTodos = todos.map(t => 
      (t._id === id || t.id === id) ? { ...t, ...updates } : t
    );
    setTodos(optimisticTodos);
    calculateStats(optimisticTodos);

    try {
      console.log("Editing todo:", id, updates);
      const updatedTodo = await updateTodo(id, updates);
      console.log("Updated todo from API:", updatedTodo);
      
      // Update with real data from API
      const finalTodos = todos.map(t => 
        (t._id === id || t.id === id) ? updatedTodo : t
      );
      
      setTodos(finalTodos);
      calculateStats(finalTodos);
      
      return { success: true };
    } catch (err) {
      console.error("Error editing todo:", err);
      
      // Revert on error
      setTodos(todos);
      calculateStats(todos);
      
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Failed to update todo",
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
    // Optimistic update
    const updatedTodos = todos.filter(t => t._id !== id && t.id !== id);
    setTodos(updatedTodos);
    calculateStats(updatedTodos);

    try {
      console.log("Deleting todo:", id);
      await deleteTodo(id);
      
      return { success: true };
    } catch (err) {
      console.error("Error deleting todo:", err);
      
      // Revert on error
      setTodos(todos);
      calculateStats(todos);
      
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Failed to delete todo",
      };
    }
  };

  // Initial Load - fetch once on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch todos
        const data = await getTodos({});
        const todosArray = data.items || data || [];
        setTodos(todosArray);
        
        // Calculate stats from todos
        calculateStats(todosArray);
      } catch (err) {
        console.error("Error loading initial data:", err);
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [calculateStats]);

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