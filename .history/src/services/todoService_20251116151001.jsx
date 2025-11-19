// services/todoService.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// دالة لتحضير الهيدرز
const getAuthHeaders = () => {
  const token = Cookies.get('token') || Cookies.get('authToken') || Cookies.get('accessToken');
  
  if (!token) {
    console.warn('No token found in cookies');
    return { 'Content-Type': 'application/json' };
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Mock data مؤقت
const mockTasks = [
  { id: 1, title: "Study for exam", priority: "high", dueDate: new Date(), isDone: false },
  { id: 2, title: "Complete project", priority: "medium", dueDate: new Date(), isDone: true },
  { id: 3, title: "Buy groceries", priority: "low", dueDate: new Date(), isDone: false },
];

export const todoService = {
  // Get all todos
  getTodos: async (params = {}) => {
    try {
      // مؤقتاً نرجع mock data
      console.log('Using mock data for todos');
      return { 
        items: mockTasks,
        total: mockTasks.length,
        page: 1,
        pageSize: 20
      };
      
      // لما الـ API يبقى شغال، شغل الكود ده:
      // const response = await axios.get(`${API_BASE_URL}/todos`, {
      //   params,
      //   headers: getAuthHeaders()
      // });
      // return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      // Fallback to mock data
      return { 
        items: mockTasks,
        total: mockTasks.length,
        page: 1,
        pageSize: 20
      };
    }
  },

  // Create todo
  createTodo: async (todoData) => {
    try {
      const newTask = {
        id: Date.now(),
        ...todoData,
        isDone: false,
        createdAt: new Date()
      };
      mockTasks.push(newTask);
      return newTask;
      
      // const response = await axios.post(`${API_BASE_URL}/todos`, todoData, {
      //   headers: getAuthHeaders()
      // });
      // return response.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  // Update todo
  updateTodo: async (id, todoData) => {
    try {
      const index = mockTasks.findIndex(task => task.id === id);
      if (index !== -1) {
        mockTasks[index] = { ...mockTasks[index], ...todoData };
        return mockTasks[index];
      }
      throw new Error('Task not found');
      
      // const response = await axios.put(`${API_BASE_URL}/todos/${id}`, todoData, {
      //   headers: getAuthHeaders()
      // });
      // return response.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  // Delete todo
  deleteTodo: async (id) => {
    try {
      const index = mockTasks.findIndex(task => task.id === id);
      if (index !== -1) {
        mockTasks.splice(index, 1);
        return { success: true };
      }
      throw new Error('Task not found');
      
      // const response = await axios.delete(`${API_BASE_URL}/todos/${id}`, {
      //   headers: getAuthHeaders()
      // });
      // return response.data;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  // Get stats
  getTodoStats: async () => {
    try {
      const total = mockTasks.length;
      const done = mockTasks.filter(task => task.isDone).length;
      const notDone = total - done;
      
      return { total, done, notDone };
      
      // const response = await axios.get(`${API_BASE_URL}/todos/stats/summary`, {
      //   headers: getAuthHeaders()
      // });
      // return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { total: 0, done: 0, notDone: 0 };
    }
  },
};