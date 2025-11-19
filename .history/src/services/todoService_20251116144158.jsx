// services/todoService.js
import axios from 'axios';
import { ENDPOINTS } from '@/Constants/api-e';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create axios instance with auth
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = Cookies.get('token'); // Adjust based on your token storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const todoService = {
  // Get all todos
  getTodos: async (params = {}) => {
    const response = await api.get(ENDPOINTS.TODOS.BASE, { params });
    return response.data;
  },

  // Create todo
  createTodo: async (todoData) => {
    const response = await api.post(ENDPOINTS.TODOS.BASE, todoData);
    return response.data;
  },

  // Update todo
  updateTodo: async (id, todoData) => {
    const response = await api.put(`${ENDPOINTS.TODOS.BASE}/${id}`, todoData);
    return response.data;
  },

  // Mark as done/undone
  markTodoDone: async (id, isDone) => {
    const response = await api.patch(ENDPOINTS.TODOS.MARK_DONE(id), { isDone });
    return response.data;
  },

  // Delete todo
  deleteTodo: async (id) => {
    const response = await api.delete(`${ENDPOINTS.TODOS.BASE}/${id}`);
    return response.data;
  },

  // Get stats
  getTodoStats: async () => {
    const response = await api.get(ENDPOINTS.TODOS.STATS);
    return response.data;
  },
};