// services/todoService.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// دالة بسيطة للـ headers
const getAuthHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // جرب ناخد التوكن من userInfo
  try {
    const userInfo = Cookies.get('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      const token = parsed.token || parsed.accessToken;
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        return headers;
      }
    }
  } catch (error) {
    // skip
  }
  
  // جرب cookies تانيه
  const token = Cookies.get('token') || Cookies.get('authToken') || Cookies.get('accessToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const todoService = {
  // Get all todos
  getTodos: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/todos`, {
      params,
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Create todo
  createTodo: async (todoData) => {
    const response = await axios.post(`${API_BASE_URL}/todos`, todoData, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Update todo
  updateTodo: async (id, todoData) => {
    const response = await axios.put(`${API_BASE_URL}/todos/${id}`, todoData, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Delete todo
  deleteTodo: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/todos/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Get stats
  getTodoStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/todos/stats/summary`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },
};