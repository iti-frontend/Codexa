// components/TodoListTable.jsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from '../ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { todoService } from "@/services/todoService";

export default function TodoListTable({ onRefetch }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    priority: 'medium',
    dueDate: ''
  });

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await todoService.getTodos({ 
        done: showCompleted
      });
      setTodos(response.items || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [showCompleted]);

  const handleMarkDone = async (id, isDone) => {
    try {
      await todoService.markTodoDone(id, isDone);
      fetchTodos();
      onRefetch();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      try {
        await todoService.deleteTodo(id);
        fetchTodos();
        onRefetch();
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title || '',
      body: todo.body || '',
      priority: todo.priority || 'medium',
      dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : ''
    });
    setEditModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await todoService.createTodo({
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined
      });
      setCreateModalOpen(false);
      setFormData({ title: '', body: '', priority: 'medium', dueDate: '' });
      fetchTodos();
      onRefetch();
    } catch (error) {
      console.error('Error creating todo:', error);
      alert('Error creating todo');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingTodo?._id) return;

    try {
      await todoService.updateTodo(editingTodo._id, {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined
      });
      setEditModalOpen(false);
      setEditingTodo(null);
      setFormData({ title: '', body: '', priority: 'medium', dueDate: '' });
      fetchTodos();
      onRefetch();
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Error updating todo');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button
            variant={!showCompleted ? "default" : "outline"}
            onClick={() => setShowCompleted(false)}
          >
            Pending
          </Button>
          <Button
            variant={showCompleted ? "default" : "outline"}
            onClick={() => setShowCompleted(true)}
          >
            Completed
          </Button>
        </div>
        
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Todo
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl bg-foreground/5 p-5 shadow-sm w-full"
      >
        {loading ? (
          <div className="text-center py-8 text-foreground/60">
            Loading todos...
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-8 text-foreground/60">
            No {showCompleted ? 'completed' : 'pending'} todos found.
          </div>
        ) : (
          <div className="space-y-2">
            {todos.map((todo, index) => (
              <motion.div
                key={todo._id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-lg border ${
                  todo.isDone ? 'bg-green-50 border-green-200' : 'bg-background'
                }`}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={todo.isDone || false}
                  onChange={(e) => handleMarkDone(todo._id, e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />

                {/* Title and Description */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium truncate ${
                    todo.isDone ? 'line-through text-gray-500' : 'text-foreground'
                  }`}>
                    {todo.title}
                  </h3>
                  {todo.body && (
                    <p className="text-sm text-foreground/60 truncate">
                      {todo.body}
                    </p>
                  )}
                </div>

                {/* Due Date */}
                {todo.dueDate && (
                  <div className="text-sm text-foreground/60 whitespace-nowrap">
                    {new Date(todo.dueDate).toLocaleDateString()}
                  </div>
                )}

                {/* Priority */}
                <div className={`text-sm font-medium whitespace-nowrap ${getPriorityColor(todo.priority)}`}>
                  {todo.priority ? todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1) : 'Medium'}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(todo)}
                    disabled={todo.isDone}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(todo._id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Create Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Create New Todo</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows={3}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                >
                  Create Todo
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Edit Todo</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows={3}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditModalOpen(false);
                    setEditingTodo(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                >
                  Update Todo
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}