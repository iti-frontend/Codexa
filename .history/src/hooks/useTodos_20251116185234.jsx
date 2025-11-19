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
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const data = await getTodos({});
        const todosArray = data.items || data || [];
        setTodos(todosArray);
        calculateStats(todosArray);
      } catch (err) {
        console.error("Error loading todos:", err);
        setError(err.response?.data?.message || "Failed to load todos");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Add Todo - تحديث فوري كامل
  const addTodo = async (todoData) => {
    try {
      // 1. أولاً: تحديث فوري للـ UI
      const tempTodo = {
        ...todoData,
        _id: `temp-${Date.now()}`,
        id: `temp-${Date.now()}`,
        isDone: false,
        createdAt: new Date().toISOString(),
      };
      
      setTodos(prev => {
        const newTodos = [...prev, tempTodo];
        calculateStats(newTodos);
        return newTodos;
      });

      // 2. ثانياً: الإرسال للخادم في الخلفية
      const response = await createTodo(todoData);
      
      // 3. التأكد من شكل البيانات المرجعة
      const newTodo = response.data || response;
      
      // 4. استبدال البيانات المؤقتة بالحقيقية
      setTodos(prev => {
        const finalTodos = prev.map(t => 
          t._id === tempTodo._id ? { ...newTodo, _id: newTodo._id || newTodo.id } : t
        );
        calculateStats(finalTodos);
        return finalTodos;
      });

      return { success: true, data: newTodo };
    } catch (err) {
      // التراجع في حالة الخطأ
      setTodos(prev => prev.filter(t => !t._id.includes('temp-')));
      return {
        success: false,
        message: err.response?.data?.message || "Failed to create todo",
      };
    }
  };

  // Toggle Done - تحديث فوري
  const toggleDone = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    
    // تحديث فوري أولاً
    setTodos(prev => {
      const updatedTodos = prev.map(t => 
        (t._id === id || t.id === id) ? { ...t, isDone: newStatus } : t
      );
      calculateStats(updatedTodos);
      return updatedTodos;
    });

    try {
      // الإرسال للخادم في الخلفية
      await toggleTodoDone(id, newStatus);
      return { success: true };
    } catch (err) {
      // التراجع في حالة الخطأ
      setTodos(prev => {
        const revertedTodos = prev.map(t => 
          (t._id === id || t.id === id) ? { ...t, isDone: currentStatus } : t
        );
        calculateStats(revertedTodos);
        return revertedTodos;
      });
      
      return {
        success: false,
        message: err.response?.data?.message || "Failed to toggle status",
      };
    }
  };

  // Delete Todo - تحديث فوري
  const removeTodo = async (id) => {
    // حفظ المهمة المحذوفة للتراجع
    const deletedTodo = todos.find(t => t._id === id || t.id === id);
    
    // حذف فوري أولاً
    setTodos(prev => {
      const updatedTodos = prev.filter(t => t._id !== id && t.id !== id);
      calculateStats(updatedTodos);
      return updatedTodos;
    });

    try {
      // الإرسال للخادم في الخلفية
      await deleteTodo(id);
      return { success: true };
    } catch (err) {
      // التراجع في حالة الخطأ
      if (deletedTodo) {
        setTodos(prev => {
          const revertedTodos = [...prev, deletedTodo];
          calculateStats(revertedTodos);
          return revertedTodos;
        });
      }
      
      return {
        success: false,
        message: err.response?.data?.message || "Failed to delete todo",
      };
    }
  };

  // Edit Todo - تحديث فوري
  const editTodo = async (id, updates) => {
    // حفظ البيانات الأصلية للتراجع
    const originalTodo = todos.find(t => t._id === id || t.id === id);
    
    // تحديث فوري أولاً
    setTodos(prev => {
      const updatedTodos = prev.map(t => 
        (t._id === id || t.id === id) ? { ...t, ...updates } : t
      );
      calculateStats(updatedTodos);
      return updatedTodos;
    });

    try {
      // الإرسال للخادم في الخلفية
      await updateTodo(id, updates);
      return { success: true };
    } catch (err) {
      // التراجع في حالة الخطأ
      if (originalTodo) {
        setTodos(prev => {
          const revertedTodos = prev.map(t => 
            (t._id === id || t.id === id) ? originalTodo : t
          );
          calculateStats(revertedTodos);
          return revertedTodos;
        });
      }
      
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update todo",
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
  };
}