// services/todoService.js
import axios from 'axios';
import { ENDPOINTS } from '@/Constants/a';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const userInfo = Cookies.get("userInfo");
  if (userInfo) {
    try {
      const parsedUser = JSON.parse(userInfo);
      if (parsedUser.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    } catch (error) {
      console.error("Error parsing userInfo for token:", error);
    }
  }
  return config;
});

export const todoService = {
  createTodo: async (todoData) => {
    const response = await api.post(ENDPOINTS.TODOS.BASE, todoData);
    return response.data;
  },

  getTodos: async (params) => {
    const response = await api.get(ENDPOINTS.TODOS.BASE, { params });
    return response.data;
  },

  updateTodo: async (id, updateData) => {
    const response = await api.put(`${ENDPOINTS.TODOS.BASE}/${id}`, updateData);
    return response.data;
  },

  markTodoDone: async (id, isDone) => {
    const response = await api.patch(ENDPOINTS.TODOS.MARK_DONE(id), { isDone });
    return response.data;
  },

  deleteTodo: async (id) => {
    await api.delete(`${ENDPOINTS.TODOS.BASE}/${id}`);
  },

  getTodoStats: async () => {
    const response = await api.get(ENDPOINTS.TODOS.STATS);
    return response.data;
  },
};