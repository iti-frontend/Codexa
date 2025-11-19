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

    // Calculate stats from current todos
    const calculateStats = (todosArray) => {
        const total = todosArray.length;
        const done = todosArray.filter(t => t.isDone).length;
        const notDone = total - done;
        return { total, done, notDone };
    };

    // Update stats whenever todos change
    useEffect(() => {
        setStats(calculateStats(todos));
    }, [todos]);

    // Fetch initial todos  
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const data = await getTodos({});
                const todosArray = data.items || data || [];
                setTodos(todosArray);
                // Stats will be updated automatically by the useEffect above
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

        // Optimistic update
        setTodos(prev => [...prev, tempTodo]);

        try {
            const response = await createTodo(todoData);
            const newTodo = response.data || response;

            // Replace temp todo with actual todo from API
            setTodos(prev =>
                prev.map(t => (t._id === tempId ? { ...newTodo, _id: newTodo._id || newTodo.id } : t))
            );
            
            return { success: true, data: newTodo };
        } catch (err) {
            // Rollback on error
            setTodos(prev => prev.filter(t => t._id !== tempId));
            return { success: false, message: err.response?.data?.message || "Failed to create todo" };
        }
    };

    // Toggle todo done - FIXED VERSION
    const toggleDone = async (id, currentStatus) => {
        const newStatus = !currentStatus;

        // Optimistic update - update UI immediately
        setTodos(prev => 
            prev.map(t => 
                (t._id === id || t.id === id) ? { ...t, isDone: newStatus } : t
            )
        );

        try {
            // Call API immediately
            await toggleTodoDone(id, newStatus);
            console.log(`Todo ${id} status updated to ${newStatus} in API`);
            return { success: true };
        } catch (err) {
            console.error("Failed to update todo status:", err);
            
            // Rollback on error
            setTodos(prev => 
                prev.map(t => 
                    (t._id === id || t.id === id) ? { ...t, isDone: currentStatus } : t
                )
            );
            
            return { 
                success: false, 
                message: err.response?.data?.message || "Failed to toggle todo" 
            };
        }
    };

    // Delete todo (optimistic update)
    const removeTodo = async (id) => {
        const deletedTodo = todos.find(t => t._id === id || t.id === id);

        // Instant removal
        setTodos(prev => prev.filter(t => t._id !== id && t.id !== id));

        try {
            await deleteTodo(id);
            return { success: true };
        } catch (err) {
            // Rollback on error
            if (deletedTodo) {
                setTodos(prev => [...prev, deletedTodo]);
            }
            return { success: false, message: err.response?.data?.message || "Failed to delete todo" };
        }
    };

    // Edit todo 
    const editTodo = async (id, updates) => {
        const originalTodo = todos.find(t => t._id === id || t.id === id);

        // Instant update
        setTodos(prev => 
            prev.map(t => 
                (t._id === id || t.id === id) ? { ...t, ...updates } : t
            )
        );

        try {
            await updateTodo(id, updates);
            return { success: true };
        } catch (err) {
            // Rollback on error
            if (originalTodo) {
                setTodos(prev => 
                    prev.map(t => 
                        (t._id === id || t.id === id) ? originalTodo : t
                    )
                );
            }
            return { success: false, message: err.response?.data?.message || "Failed to update todo" };
        }
    };

    // Return hook API
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