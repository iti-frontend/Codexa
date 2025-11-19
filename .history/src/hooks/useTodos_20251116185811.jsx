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

  // Calculate stats - لازم تتحدث مع كل تغيير في todos
  const calculateStats = (todosArray) => {
    const total = todosArray.length;
    const done = todosArray.filter(t => t.isDone === true).length;
    const notDone = total - done;
    console.log("🔄 Updating stats:", { total, done, notDone });
    setStats({ total, done, notDone });
  };

  // Fetch Todos مرة واحدة فقط
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const data = await getTodos({});
        const todosArray = data.items || data || [];
        console.log("📥 Initial todos loaded:", todosArray);
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
      
      console.log("➕ Adding todo optimistically:", tempTodo);
      
      setTodos(prev => {
        const newTodos = [...prev, tempTodo];
        calculateStats(newTodos); // تحديث الـ stats فوراً
        return newTodos;
      });

      // 2. ثانياً: الإرسال للخادم في الخلفية
      const response = await createTodo(todoData);
      
      // 3. التأكد من شكل البيانات المرجعة
      const newTodo = response.data || response;
      console.log("✅ Todo created on server:", newTodo);
      
      // 4. استبدال البيانات المؤقتة بالحقيقية
      setTodos(prev => {
        const finalTodos = prev.map(t => 
          t._id === tempTodo._id ? { ...newTodo, _id: newTodo._id || newTodo.id } : t
        );
        calculateStats(finalTodos); // تحديث الـ stats مرة أخرى
        return finalTodos;
      });

      return { success: true, data: newTodo };
    } catch (err) {
      // التراجع في حالة الخطأ
      console.error("❌ Error adding todo:", err);
      setTodos(prev => {
        const revertedTodos = prev.filter(t => !t._id.includes('temp-'));
        calculateStats(revertedTodos); // تحديث الـ stats بعد التراجع
        return revertedTodos;
      });
      return {
        success: false,
        message: err.response?.data?.message || "Failed to create todo",
      };
    }
  };

  // Toggle Done - تحديث فوري
  const toggleDone = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    console.log("🔄 Toggling todo:", { id, currentStatus, newStatus });
    
    // تحديث فوري أولاً
    setTodos(prev => {
      const updatedTodos = prev.map(t => 
        (t._id === id || t.id === id) ? { ...t, isDone: newStatus } : t
      );
      calculateStats(updatedTodos); // تحديث الـ stats فوراً
      return updatedTodos;
    });

    try {
      // الإرسال للخادم في الخلفية
      await toggleTodoDone(id, newStatus);
      return { success: true };
    } catch (err) {
      // التراجع في حالة الخطأ
      console.error("❌ Error toggling todo:", err);
      setTodos(prev => {
        const revertedTodos = prev.map(t => 
          (t._id === id || t.id === id) ? { ...t, isDone: currentStatus } : t
        );
        calculateStats(revertedTodos); // تحديث الـ stats بعد التراجع
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
    console.log("🗑️ Deleting todo:", id);
    
    // حذف فوري أولاً
    setTodos(prev => {
      const updatedTodos = prev.filter(t => t._id !== id && t.id !== id);
      calculateStats(updatedTodos); // تحديث الـ stats فوراً
      return updatedTodos;
    });

    try {
      // الإرسال للخادم في الخلفية
      await deleteTodo(id);
      return { success: true };
    } catch (err) {
      // التراجع في حالة الخطأ
      console.error("❌ Error deleting todo:", err);
      if (deletedTodo) {
        setTodos(prev => {
          const revertedTodos = [...prev, deletedTodo];
          calculateStats(revertedTodos); // تحديث الـ stats بعد التراجع
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
    console.log("✏️ Editing todo:", { id, updates });
    
    // تحديث فوري أولاً
    setTodos(prev => {
      const updatedTodos = prev.map(t => 
        (t._id === id || t.id === id) ? { ...t, ...updates } : t
      );
      calculateStats(updatedTodos); // تحديث الـ stats فوراً
      return updatedTodos;
    });

    try {
      // الإرسال للخادم في الخلفية
      await updateTodo(id, updates);
      return { success: true };
    } catch (err) {
      // التراجع في حالة الخطأ
      console.error("❌ Error editing todo:", err);
      if (originalTodo) {
        setTodos(prev => {
          const revertedTodos = prev.map(t => 
            (t._id === id || t.id === id) ? originalTodo : t
          );
          calculateStats(revertedTodos); // تحديث الـ stats بعد التراجع
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