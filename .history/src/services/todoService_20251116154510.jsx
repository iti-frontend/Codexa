import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const getAuthHeaders = () => {
  const userInfo = Cookies.get("userInfo");
  let token = null;

  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      token = parsed.token || parsed.accessToken || parsed.authToken;
    } catch (error) {
      console.error("Error parsing userInfo cookie:", error);
    }
  }

  if (!token) {
    token = Cookies.get("token") || Cookies.get("authToken") || Cookies.get("accessToken");
  }

  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const apiCall = async (method, url, data = null, params = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${url}`,
      headers: getAuthHeaders(),
      params,
      data,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error in ${method} ${url}:`, {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

export const todoService = {
  getTodos: async (params = {}) => {
    return await apiCall("get", "/todos", null, params);
  },

  createTodo: async (todoData) => {
    return await apiCall("post", "/todos", todoData);
  },

  updateTodo: async (id, todoData) => {
    return await apiCall("put", `/todos/${id}`, todoData);
  },

  deleteTodo: async (id) => {
    return await apiCall("delete", `/todos/${id}`);
  },

  getTodoStats: async () => {
    return await apiCall("get", "/todos/stats/summary");
  },
};