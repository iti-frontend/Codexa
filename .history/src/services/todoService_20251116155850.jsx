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
    console.log('No token found');
  }
  
  return headers;
};

// دالة للـ API calls مع error handling بسيط
const makeRequest = async (method, url, data = null, params = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${url}`,
      headers: getAuthHeaders()
    };
    
    if (data) {
      config.data = data;
    }
    
    if (params) {
      config.params = params;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log(`API Error (${method} ${url}):`, error.message);
    throw new Error(`API not available: ${error.message}`);
  }
};

export const todoService = {
  getTodos: async (params = {}) => {
    return await makeRequest('get', '/todos', null, params);
  },

  createTodo: async (todoData) => {
    return await makeRequest('post', '/todos', todoData);
  },

  updateTodo: async (id, todoData) => {
    return await makeRequest('put', `/todos/${id}`, todoData);
  },

  deleteTodo: async (id) => {
    return await makeRequest('delete', `/todos/${id}`);
  },

  getTodoStats: async () => {
    return await makeRequest('get', '/todos/stats/summary');
  },
  markTodoDone: async (id, isDone) => {
  return await makeRequest('patch', `/todos/${id}/done`, { isDone });
},
};