// hooks/useTodos.js
"use client";
import { useState, useEffect } from "react";
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

  // Calculate stats
  const calculateStats = (todosArray) => {
    const total = todosArray.length;
    const done = todosArray.filter(t => t.isDone === true).length;
    const notDone = total - done;
    setStats({ total, done, notDone });
  };

  // Fetch Todos مرة واحدة فقط
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTodos({});
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

    fetchTodos();
  }, []); // فارغ - يعمل مرة واحدة فقط

  // Add Todo - تحديث فوري
  const addTodo = async (todoData) => {
    try {
      // إنشاء ID مؤقت
      const tempId = `temp-${Date.now()}`;
      const optimisticTodo = {
        ...todoData,
        _id: tempId,
        id: tempId,
        isDone: false,
        createdAt: new Date().toISOString(),
      };
      
      // تحديث فوري للـ UI
      setTodos(prev => {
        const updatedTodos = [...prev, optimisticTodo];
        calculateStats(updatedTodos);
        return updatedTodos;
      });

      // إرسال للخادم
      const newTodo = await createTodo(todoData);
      
      // استبدال البيانات المؤقتة بالحقيقية
      setTodos(prev => {
        const finalTodos = prev.map(t => 
          t._id === tempId ? { ...newTodo, _id: newTodo._id || newTodo.id } : t
        );
        calculateStats(finalTodos);
        return finalTodos;
      });
      
      return { success: true, data: newTodo };
    } catch (err) {
      // التراجع في حالة الخطأ
      setTodos(prev => {
        const originalTodos = prev.filter(t => !t._id.includes('temp-'));
        calculateStats(originalTodos);
        return originalTodos;
      });
      
      return {
        success: false,
        message: err.response?.data?.message || "Failed to create todo",
      };
    }
  };

  // Update Todo - تحديث فوري
  const editTodo = async (id, updates) => {
    // حفظ النسخة الأصلية للتراجع
    const originalTodos = todos;
    
    // تحديث فوري
    setTodos(prev => {
      const optimisticTodos = prev.map(t => 
        (t._id === id || t.id === id) ? { ...t, ...updates } : t
      );
      calculateStats(optimisticTodos);
      return optimisticTodos;
    });

    try {
      await updateTodo(id, updates);
      return { success: true };
    } catch (err) {
      // التراجع
      setTodos(originalTodos);
      calculateStats(originalTodos);
      
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update todo",
      };
    }
  };

  // Toggle Done Status - تحديث فوري
  const toggleDone = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    
    // حفظ النسخة الأصلية للتراجع
    const originalTodos = todos;
    
    // تحديث فوري
    setTodos(prev => {
      const updatedTodos = prev.map(t => 
        (t._id === id || t.id === id) ? { ...t, isDone: newStatus } : t
      );
      calculateStats(updatedTodos);
      return updatedTodos;
    });

    try {
      await toggleTodoDone(id, newStatus);
      return { success: true };
    } catch (err) {
      // التراجع
      setTodos(originalTodos);
      calculateStats(originalTodos);
      
      return {
        success: false,
        message: err.response?.data?.message || "Failed to toggle status",
      };
    }
  };

  // Delete Todo - تحديث فوري
  const removeTodo = async (id) => {
    // حفظ النسخة الأصلية للتراجع
    const originalTodos = todos;
    
    // حذف فوري
    setTodos(prev => {
      const updatedTodos = prev.filter(t => t._id !== id && t.id !== id);
      calculateStats(updatedTodos);
      return updatedTodos;
    });

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
    // لا يوجد refresh هنا نهائياً
  };
}