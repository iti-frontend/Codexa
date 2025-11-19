// services/todoService.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// استخدم axios مباشرة من غير إنشاء instance
export const todoService = {
  // Get all todos
  getTodos: async (params = {}) => {
    const token = Cookies.get('token');
    const response = await axios.get(`${API_BASE_URL}/todos`, {
      params,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Create todo
  createTodo: async (todoData) => {
    const token = Cookies.get('token');
    const response = await axios.post(`${API_BASE_URL}/todos`, todoData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Update todo
  updateTodo: async (id, todoData) => {
    const token = Cookies.get('token');
    const response = await axios.put(`${API_BASE_URL}/todos/${id}`, todoData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Mark as done/undone
  markTodoDone: async (id, isDone) => {
    const token = Cookies.get('token');
    const response = await axios.patch(`${API_BASE_URL}/todos/${id}/done`, { isDone }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Delete todo
  deleteTodo: async (id) => {
    const token = Cookies.get('token');
    const response = await axios.delete(`${API_BASE_URL}/todos/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Get stats
  getTodoStats: async () => {
    const token = Cookies.get('token');
    const response = await axios.get(`${API_BASE_URL}/todos/stats/summary`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },
};