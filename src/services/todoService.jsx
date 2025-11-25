// services/todoService.js
import api from "@/lib/axios";
import { ENDPOINTS } from "@/Constants/api-endpoints";
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
  console.log("Create Todo Response:", response.data);
  return response.data.data || response.data;
};

// 2. Get All Todos (with filters)
export const getTodos = async (params = {}) => {
  const response = await api.get(ENDPOINTS.TODOS.BASE, {
    headers: getAuthHeader(),
    params,
  });
  console.log("Get Todos Response:", response.data);
  return response.data.data || response.data;
};

// 3. Update Todo
export const updateTodo = async (id, updates) => {
  const response = await api.put(ENDPOINTS.TODOS.BY_ID(id), updates, {
    headers: getAuthHeader(),
  });
  console.log("Update Todo Response:", response.data);
  return response.data.data || response.data;
};

// 4. Mark Todo as Done/Undone - IMPROVED VERSION
export const toggleTodoDone = async (id, isDone) => {
  console.log("=== Toggle Todo Request ===");
  console.log("ID:", id);
  console.log("New isDone status:", isDone);

  try {
    // Try PUT first with the main endpoint
    const response = await api.put(
      ENDPOINTS.TODOS.BY_ID(id),
      { isDone },
      {
        headers: getAuthHeader(),
        timeout: 10000
      }
    );
    console.log("Toggle Response (PUT):", response.data);
    return response.data.data || response.data;
  } catch (error) {
    console.log("PUT failed, trying PATCH fallback...");
    console.log("Error:", error.response?.data || error.message);

    // Fallback to PATCH
    try {
      const response = await api.put(
        ENDPOINTS.TODOS.MARK_DONE(id),
        { isDone },
        {
          headers: getAuthHeader(),
          timeout: 10000
        }
      );
      console.log("Toggle Response (PATCH):", response.data);
      return response.data.data || response.data;
    } catch (patchError) {
      console.error("PATCH also failed:", patchError);
      throw patchError;
    }
  }
};

// 5. Delete Todo
export const deleteTodo = async (id) => {
  const response = await api.delete(ENDPOINTS.TODOS.BY_ID(id), {
    headers: getAuthHeader(),
  });
  console.log("Delete Todo Response:", response.data);
  return response.data.data || response.data;
};