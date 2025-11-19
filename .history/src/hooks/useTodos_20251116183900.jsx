// hooks/useTodos.js
"use client";
import { useState, useEffect, useCallback } from "react";
import {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodoDone,
  deleteTodo,
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

  // Calculate stats - بدون useCallback
  const calculateStats = (todosArray) => {
    const total = todosArray.length;
    const done = todosArray.filter(t => t.isDone === true).length;
    const notDone = total - done;
    setStats({ total, done, notDone });
  };

  // Fetch Todos - بدون useCallback
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterDone !== null) params.done = filterDone;
      
      const data = await getTodos(params);
      const todosArray = data.items || data || [];
      
      setTodos(todosArray);
      calculateStats(todosArray);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError(err.response?.data?.message || "Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  // Add Todo - تحديث فوري
  const addTodo = async (todoData) => {
    try {
      // Optimistic update أولاً
      const tempId = Date.now().toString(); // ID مؤقت
      const optimisticTodo = {
        ...todoData,
        _id: tempId,
        id: tempId,
        isDone: false,
        createdAt: new Date().toISOString(),
      };
      
      const updatedTodos = [...todos, optimisticTodo];
      setTodos(updatedTodos);
      calculateStats(updatedTodos);

      // ثم الإرسال للخادم
      const newTodo = await createTodo(todoData);
      
      // استبدال البيانات المؤقتة بالحقيقية
      const finalTodos = updatedTodos.map(t => 
        t._id === tempId ? { ...newTodo, _id: newTodo._id || newTodo.id } : t
      );
      
      setTodos(finalTodos);
      calculateStats(finalTodos);
      
      return { success: true, data: newTodo };
    } catch (err) {
      // التراجع في حالة الخطأ
      setTodos(todos);
      calculateStats(todos);
      
      return {
        success: false,
        message: err.response?.data?.message || "Failed to create todo",
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
      const updatedTodo = await updateTodo(id, updates);
      
      // التأكيد من الخادم
      const finalTodos = todos.map(t => 
        (t._id === id || t.id === id) ? updatedTodo : t
      );
      
      setTodos(finalTodos);
      calculateStats(finalTodos);
      
      return { success: true };
    } catch (err) {
      // التراجع
      setTodos(todos);
      calculateStats(todos);
      
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update todo",
      };
    }
  };

  // Toggle Done Status - تحديث فوري
  const toggleDone = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    
    // تحديث فوري للUI
    const updatedTodos = todos.map(t => 
      (t._id === id || t.id === id) ? { ...t, isDone: newStatus } : t
    );
    setTodos(updatedTodos);
    calculateStats(updatedTodos);

    try {
      await toggleTodoDone(id, newStatus);
      return { success: true };
    } catch (err) {
      // التراجع في حالة الخطأ
      setTodos(todos);
      calculateStats(todos);
      
      return {
        success: false,
        message: err.response?.data?.message || "Failed to toggle status",
      };
    }
  };

  // Delete Todo - تحديث فوري
  const removeTodo = async (id) => {
    // حفظ البيانات للتراجع
    const originalTodos = [...todos];
    
    // Optimistic update
    const updatedTodos = todos.filter(t => t._id !== id && t.id !== id);
    setTodos(updatedTodos);
    calculateStats(updatedTodos);

    try {
      await deleteTodo(id);
      return { success: true };
    } catch (err) {
      // التراجع
      setTodos(originalTodos);
      calculateStats(originalTodos);
      
      return {
        success: false,
        message: err.response?.data?.message || "Failed to delete todo",
      };
    }
  };

  // جلب البيانات مرة واحدة عند التحميل
  useEffect(() => {
    fetchTodos();
  }, []); // فارغ - يعمل مرة واحدة فقط

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
  };
}