// services/todoService.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  try {
    const userInfo = Cookies.get('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      const token = parsed.token || parsed.accessToken;
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.log('No token found in userInfo');
  }
  
  return headers;
};

export const todoService = {
  getTodos: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/todos`, {
        params,
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error.response?.data || error.message);
      throw error;
    }
  },

  createTodo: async (todoData) => {
    try {
      // تأكد إن البيانات بتكون valid JSON
      const cleanData = {
        title: todoData.title?.trim() || '',
        priority: todoData.priority || 'medium',
        dueDate: todoData.dueDate || new Date().toISOString(),
      };
      
      const response = await axios.post(`${API_BASE_URL}/todos`, cleanData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error.response?.data || error.message);
      throw error;
    }
  },

  updateTodo: async (id, todoData) => {
    try {
      // تأكد إن البيانات بتكون valid JSON
      const cleanData = {
        ...todoData,
        title: todoData.title?.trim() || '',
      };
      
      const response = await axios.put(`${API_BASE_URL}/todos/${id}`, cleanData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating todo:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteTodo: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/todos/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting todo:', error.response?.data || error.message);
      throw error;
    }
  },

  getTodoStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/todos/stats/summary`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error.response?.data || error.message);
      throw error;
    }
  },
};