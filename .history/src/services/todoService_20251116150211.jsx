// services/todoService.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// دالة لتحضير الهيدرز
const getAuthHeaders = () => {
  // جرب كل الأسماء الممكنة للتوكن
  const token = Cookies.get('token') || Cookies.get('authToken') || Cookies.get('accessToken');
  
  if (!token) {
    console.warn('No token found in cookies');
    return { 'Content-Type': 'application/json' };
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const todoService = {
  // Get all todos
  getTodos: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/todos`, {
        params,
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  // Create todo
  createTodo: async (todoData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/todos`, todoData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  // Update todo
  updateTodo: async (id, todoData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/todos/${id}`, todoData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  // Delete todo
  deleteTodo: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/todos/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  // Get stats
  getTodoStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/todos/stats/summary`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },
};