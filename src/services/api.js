import axios from 'axios';
import { currentConfig } from '../config/backend';
import { handleApiError, logError } from '../utils/errorHandler';

// Create axios instance with default config
const api = axios.create({
  baseURL: currentConfig.baseURL,
  timeout: currentConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    logError(error, 'API Request');
    return Promise.reject(error);
  }
);

// Command API functions
export const commandAPI = {
  // Create a new command
  createCommand: async (commandData) => {
    try {
      // Transform data to match backend format
      const backendData = {
        firstName: commandData.name,
        number: commandData.phone,
        // floor: commandData.floor,
        // itemtype: commandData.itemType,
        service: commandData.services.join(', '),
        workers: commandData.workers.toString(),
        start: commandData.start,
        distination: commandData.end
      };
      console.log("backendData:", backendData);
      console.log("Sending request to:", api.defaults.baseURL + '/CreateCommand');
      
      const response = await api.post('/CreateCommand', backendData);
      console.log("Response received:", response);
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'CreateCommand');
      throw new Error(userMessage);
    }
  },

  // Get all commands
  getCommands: async () => {
    try {
      const response = await api.get('/GetCommands');
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'GetCommands');
      throw new Error(userMessage);
    }
  },

  // Update command status (approve/reject)
  updateCommandStatus: async (commandId, status) => {
    try {
      const response = await api.put(`/commands/${commandId}/status`, { status });
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'UpdateCommandStatus');
      throw new Error(userMessage);
    }
  },

  // Delete command
  deleteCommand: async (commandId) => {
    try {
      const response = await api.delete(`/commands/${commandId}`);
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'DeleteCommand');
      throw new Error(userMessage);
    }
  }
};

// Worker API functions
export const workerAPI = {
  // Create a new worker registration
  createWorker: async (workerData) => {
    try {
      // Transform data to match backend format
      const backendData = {
        fullname: workerData.name,
        number: workerData.phone,
        email: workerData.email,
        password: workerData.password || "defaultPassword123!",
        position: workerData.position,
        experience: workerData.experience,
        message: workerData.message,
        isaccepted: workerData.isAccepted
      };
      
      const response = await api.post('/CreateWorker', backendData);
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'CreateWorker');
      throw new Error(userMessage);
    }
  },

  // Get all workers
  getWorkers: async () => {
    try {
      const response = await api.get('/GetWorkers');
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'GetWorkers');
      throw new Error(userMessage);
    }
  },

  // Update worker status (approve/reject)
  updateWorkerStatus: async (workerId, status, password = null) => {
    try {
      const data = { status };
      if (password) {
        data.password = password;
      }
      const response = await api.put(`/workers/${workerId}/status`, data);
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'UpdateWorkerStatus');
      throw new Error(userMessage);
    }
  },

  // Delete worker
  deleteWorker: async (workerId) => {
    try {
      const response = await api.delete(`/workers/${workerId}`);
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'DeleteWorker');
      throw new Error(userMessage);
    }
  }
};

// User registration and authentication
export const authAPI = {
  // User registration
  register: async (userData) => {
    try {
      const response = await api.post('/Regestration', userData);
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'Registration');
      throw new Error(userMessage);
    }
  },

  // Get account by ID
  getAccount: async (accountId) => {
    try {
      const response = await api.get(`/account/${accountId}`);
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'GetAccount');
      throw new Error(userMessage);
    }
  },

  // Login (if you have a login endpoint)
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'Login');
      throw new Error(userMessage);
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

// Test API connectivity
export const testAPI = {
  // Test if backend is reachable
  testConnection: async () => {
    try {
      const response = await api.get('/health'); // Assuming you have a health endpoint
      return response.data;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error: Backend server is not reachable. Check if the server is running and CORS is configured.');
      }
      throw new Error('Backend is not reachable');
    }
  },

  // Test specific endpoint
  testEndpoint: async (endpoint, method = 'GET', data = null) => {
    try {
      let response;
      if (method === 'GET') {
        response = await api.get(endpoint);
      } else if (method === 'POST') {
        response = await api.post(endpoint, data);
      }
      return response.data;
    } catch (error) {
      console.error(`Endpoint test failed for ${method} ${endpoint}:`, error);
      if (error.code === 'ERR_NETWORK') {
        throw new Error(`Network error: Cannot reach ${endpoint}. Check CORS configuration.`);
      }
      throw new Error(`Failed to test ${endpoint}: ${error.message}`);
    }
  }
};

export default api;