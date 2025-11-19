// services/todoService.js
import api from "@/lib/axios";
import { ENDPOINTS } from "@/Constants/";
import Cookies from "js-cookie";

// Helper: Get Authorization Header
const getAuthHeader = () => {
  const token = Cookies.get("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 1. Create Todo
export const createTodo = async (todoData) => {
  const response = await api.post(ENDPOINTS.TODOS.BASE, todoData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// 2. Get All Todos (with filters)
export const getTodos = async (params = {}) => {
  const response = await api.get(ENDPOINTS.TODOS.BASE, {
    headers: getAuthHeader(),
    params, // { done: true/false, page: 1, limit: 20 }
  });
  return response.data;
};

// 3. Update Todo
export const updateTodo = async (id, updates) => {
  const response = await api.put(ENDPOINTS.TODOS.BY_ID(id), updates, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// 4. Mark Todo as Done/Undone
export const toggleTodoDone = async (id, isDone) => {
  const response = await api.patch(
    ENDPOINTS.TODOS.MARK_DONE(id),
    { isDone },
    { headers: getAuthHeader() }
  );
  return response.data;
};

// 5. Delete Todo
export const deleteTodo = async (id) => {
  const response = await api.delete(ENDPOINTS.TODOS.BY_ID(id), {
    headers: getAuthHeader(),
  });
  return response.data;
};

// 6. Get Stats Summary
export const getTodoStats = async () => {
  const response = await api.get(ENDPOINTS.TODOS.STATS, {
    headers: getAuthHeader(),
  });
  return response.data;
};