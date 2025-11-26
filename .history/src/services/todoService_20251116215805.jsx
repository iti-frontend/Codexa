import api from "@/lib/axios";
import { ENDPOINTS } from "@/Constants/api-endpoints";
import Cookies from "js-cookie";

// Get Authorization Header
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
  // Return the actual todo object from response.data.data
  return response.data.data || response.data;
};

// 2. Get All Todos (with filters)
export const getTodos = async (params = {}) => {
  const response = await api.get(ENDPOINTS.TODOS.BASE, {
    headers: getAuthHeader(),
    params,
  });
  console.log("Get Todos Response:", response.data);
  // Return response.data.data which contains { items, total, page, pageSize }
  return response.data.data || response.data;
};

// 3. Update Todo
export const updateTodo = async (id, updates) => {
  const response = await api.put(ENDPOINTS.TODOS.BY_ID(id), updates, {
    headers: getAuthHeader(),
  });
  console.log("Update Todo Response:", response.data);
  // Return the updated todo from response.data.data
  return response.data.data || response.data;
};

// 4. Mark Todo as Done/Undone
export const toggleTodoDone = async (id, isDone) => {
  console.log("=== Toggle Request ===");
  console.log("ID:", id);
  console.log("isDone:", isDone);

  try {
    // Try PATCH first
    const response = await api.patch(
      ENDPOINTS.TODOS.MARK_DONE(id),
      { isDone },
      { headers: getAuthHeader() }
    );
    console.log("Toggle Response (PATCH):", response.data);
    // Return the updated todo from response.data.data
    return response.data.data || response.data;
  } catch (error) {
    console.log("PATCH failed, trying PUT fallback...");
    console.log("Error:", error.response?.data || error.message);

    // Fallback to PUT
    const response = await api.put(
      ENDPOINTS.TODOS.BY_ID(id),
      { isDone },
      { headers: getAuthHeader() }
    );
    console.log("Toggle Response (PUT):", response.data);
    return response.data.data || response.data;
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

// 6. Get Stats Summary
export const getTodoStats = async () => {
  const response = await api.get(ENDPOINTS.TODOS.STATS, {
    headers: getAuthHeader(),
  });
  console.log("Stats Response:", response.data);
  // Return stats object from response.data.data
  return response.data.data || response.data;
};