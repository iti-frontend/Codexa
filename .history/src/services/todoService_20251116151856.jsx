// services/todoService.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// دالة لتحضير الهيدرز
const getAuthHeaders = () => {
  // جرب كل الأسماء الممكنة للتوكن
  const userInfo = Cookies.get('userInfo');
  let token = null;
  
  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      token = parsed.token || parsed.accessToken;
    } catch (error) {
      console.error('Error parsing userInfo:', error);
    }
  }
  
  // جرب cookies مباشرة
  token = token || Cookies.get('token') || Cookies.get('authToken') || Cookies.get('accessToken');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('No token found in cookies');
  }
  
  return headers;
};

export const todoService = {
  // Get all todos
  getTodos: async (params = {}) => {
    try {
      console.log('Fetching todos with params:', params);
      const response = await axios.get(`${API_BASE_URL}/todos`, {
        params,
        headers: getAuthHeaders()
      });
      console.log('Todos response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error.response?.data || error.message);
      // Return empty data instead of throwing error
      return { items: [], total: 0, page: 1, pageSize: 20 };
    }
  },

  // Create todo
  createTodo: async (todoData) => {
    try {
      console.log('Creating todo:', todoData);
      const response = await axios.post(`${API_BASE_URL}/todos`, todoData, {
        headers: getAuthHeaders()
      });
      console.log('Create todo response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update todo
  updateTodo: async (id, todoData) => {
    try {
      console.log('Updating todo:', id, todoData);
      const response = await axios.put(`${API_BASE_URL}/todos/${id}`, todoData, {
        headers: getAuthHeaders()
      });
      console.log('Update todo response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating todo:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete todo
  deleteTodo: async (id) => {
    try {
      console.log('Deleting todo:', id);
      const response = await axios.delete(`${API_BASE_URL}/todos/${id}`, {
        headers: getAuthHeaders()
      });
      console.log('Delete todo response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting todo:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get stats
  getTodoStats: async () => {
    try {
      console.log('Fetching stats');
      const response = await axios.get(`${API_BASE_URL}/todos/stats/summary`, {
        headers: getAuthHeaders()
      });
      console.log('Stats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error.response?.data || error.message);
      // Return default stats
      return { total: 0, done: 0, notDone: 0 };
    }
  },
};