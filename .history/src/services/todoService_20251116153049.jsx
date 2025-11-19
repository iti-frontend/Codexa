// services/todoService.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// دالة لتحضير الهيدرز
const getAuthHeaders = () => {
  // جرب ناخد التوكن من userInfo cookie
  const userInfo = Cookies.get('userInfo');
  let token = null;
  
  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      token = parsed.token || parsed.accessToken;
      console.log('Token from userInfo:', token);
    } catch (error) {
      console.error('Error parsing userInfo:', error);
    }
  }
  
  // لو مفيش token، جرب cookies تانيه
  if (!token) {
    token = Cookies.get('token') || Cookies.get('authToken') || Cookies.get('accessToken');
    console.log('Token from other cookies:', token);
  }
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  console.log('Final headers:', headers);
  return headers;
};

// دالة للـ API calls
const apiCall = async (method, url, data = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${url}`,
      headers: getAuthHeaders()
    };
    
    if (data) {
      config.data = data;
    }
    
    console.log(`Making ${method} request to:`, config.url);
    console.log('With data:', data);
    
    const response = await axios(config);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error in ${method} ${url}:`, {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const todoService = {
  // Get all todos
  getTodos: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `/todos${queryString ? `?${queryString}` : ''}`;
    return await apiCall('get', url);
  },

  // Create todo
  createTodo: async (todoData) => {
    return await apiCall('post', '/todos', todoData);
  },

  // Update todo
  updateTodo: async (id, todoData) => {
    return await apiCall('put', `/todos/${id}`, todoData);
  },

  // Delete todo
  deleteTodo: async (id) => {
    return await apiCall('delete', `/todos/${id}`);
  },

  // Get stats
  getTodoStats: async () => {
    return await apiCall('get', '/todos/stats/summary');
  },
};