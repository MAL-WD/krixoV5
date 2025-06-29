import axios from 'axios';
import { getConfigWithProxy } from '../config/backend';
import { handleApiError, logError } from '../utils/errorHandler';

// Multiple CORS proxy options
const CORS_PROXIES = [
  'https://cors-anywhere.herokuapp.com',
  'https://api.allorigins.win/raw?url=',
  'https://thingproxy.freeboard.io/fetch/',
  'https://corsproxy.io/?',
  'https://cors.bridged.cc/'
];

// Create axios instance with CORS proxy
const createApiInstance = (useProxy = false, proxyIndex = 0) => {
  const config = getConfigWithProxy(useProxy);
  
  let baseURL = config.baseURL;
  
  if (useProxy && proxyIndex < CORS_PROXIES.length) {
    const proxy = CORS_PROXIES[proxyIndex];
    if (proxy === 'https://api.allorigins.win/raw?url=') {
      baseURL = proxy + encodeURIComponent(config.baseURL);
    } else if (proxy === 'https://corsproxy.io/?') {
      baseURL = proxy + config.baseURL;
    } else if (proxy === 'https://cors.bridged.cc/') {
      baseURL = proxy + config.baseURL;
    } else {
      baseURL = proxy + '/' + config.baseURL;
    }
  }
  
  return axios.create({
    baseURL: baseURL,
    timeout: config.timeout,
    headers: {
      'Content-Type': 'application/json',
      ...(useProxy && {
        'Origin': window.location.origin,
        'X-Requested-With': 'XMLHttpRequest'
      })
    },
  });
};

// Create instances for different proxy options
const apiDirect = createApiInstance(false);
const apiProxies = CORS_PROXIES.map((_, index) => createApiInstance(true, index));

// Request interceptor to add auth token if available
const addRequestInterceptors = (apiInstance) => {
  apiInstance.interceptors.request.use(
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
};

// Response interceptor to handle common errors
const addResponseInterceptors = (apiInstance) => {
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      logError(error, 'API Request');
      return Promise.reject(error);
    }
  );
};

// Add interceptors to all instances
addRequestInterceptors(apiDirect);
apiProxies.forEach(addRequestInterceptors);
addResponseInterceptors(apiDirect);
apiProxies.forEach(addResponseInterceptors);

// Try multiple proxy options
const tryWithMultipleProxies = async (apiCall, maxRetries = CORS_PROXIES.length) => {
  let lastError = null;
  
  // Try direct connection first
  try {
    console.log('🔄 Trying direct connection...');
    return await apiCall(apiDirect);
  } catch (error) {
    console.log('❌ Direct connection failed:', error.message);
    lastError = error;
  }
  
  // Try each proxy option
  for (let i = 0; i < Math.min(maxRetries, CORS_PROXIES.length); i++) {
    try {
      console.log(`🔄 Trying proxy ${i + 1}/${CORS_PROXIES.length}: ${CORS_PROXIES[i]}`);
      const result = await apiCall(apiProxies[i]);
      console.log(`✅ Proxy ${i + 1} successful`);
      return result;
    } catch (error) {
      console.log(`❌ Proxy ${i + 1} failed:`, error.message);
      lastError = error;
    }
  }
  
  throw lastError;
};

// Command API functions with proxy option
export const commandAPIWithProxy = {
  // Create a new command
  createCommand: async (commandData) => {
    try {
      // Transform data to match backend format
      const backendData = {
        firstName: commandData.name,
        number: commandData.phone,
        service: commandData.services.join(', '),
        workers: commandData.workers.toString(),
        start: commandData.start,
        distination: commandData.end
      };
      
      console.log("📤 Sending command data:", backendData);
      
      const apiCall = (apiInstance) => {
        console.log("🌐 Using API:", apiInstance.defaults.baseURL);
        return apiInstance.post('/CreateCommand', backendData);
      };
      
      const response = await tryWithMultipleProxies(apiCall);
      console.log("✅ Command created successfully:", response.data);
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'CreateCommand');
      throw new Error(userMessage);
    }
  },

  // Get all commands
  getCommands: async () => {
    try {
      const apiCall = (apiInstance) => apiInstance.get('/GetCommands');
      const response = await tryWithMultipleProxies(apiCall);
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'GetCommands');
      throw new Error(userMessage);
    }
  },

  // Update command status (approve/reject)
  updateCommandStatus: async (commandId, status) => {
    try {
      const apiCall = (apiInstance) => apiInstance.put(`/commands/${commandId}/status`, { status });
      const response = await tryWithMultipleProxies(apiCall);
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'UpdateCommandStatus');
      throw new Error(userMessage);
    }
  },

  // Delete command
  deleteCommand: async (commandId) => {
    try {
      const apiCall = (apiInstance) => apiInstance.delete(`/commands/${commandId}`);
      const response = await tryWithMultipleProxies(apiCall);
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'DeleteCommand');
      throw new Error(userMessage);
    }
  }
};

// Worker API functions with proxy option
export const workerAPIWithProxy = {
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
      
      const apiCall = (apiInstance) => apiInstance.post('/CreateWorker', backendData);
      const response = await tryWithMultipleProxies(apiCall);
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'CreateWorker');
      throw new Error(userMessage);
    }
  },

  // Get all workers
  getWorkers: async () => {
    try {
      const apiCall = (apiInstance) => apiInstance.get('/GetWorkers');
      const response = await tryWithMultipleProxies(apiCall);
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
      const apiCall = (apiInstance) => apiInstance.put(`/workers/${workerId}/status`, data);
      const response = await tryWithMultipleProxies(apiCall);
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'UpdateWorkerStatus');
      throw new Error(userMessage);
    }
  },

  // Delete worker
  deleteWorker: async (workerId) => {
    try {
      const apiCall = (apiInstance) => apiInstance.delete(`/workers/${workerId}`);
      const response = await tryWithMultipleProxies(apiCall);
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'DeleteWorker');
      throw new Error(userMessage);
    }
  }
};

// User registration and authentication with proxy option
export const authAPIWithProxy = {
  // User registration
  register: async (userData) => {
    try {
      const apiCall = (apiInstance) => apiInstance.post('/Regestration', userData);
      const response = await tryWithMultipleProxies(apiCall);
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'Registration');
      throw new Error(userMessage);
    }
  },

  // Get account by ID
  getAccount: async (accountId) => {
    try {
      const apiCall = (apiInstance) => apiInstance.get(`/account/${accountId}`);
      const response = await tryWithMultipleProxies(apiCall);
      return response.data;
    } catch (error) {
      const userMessage = handleApiError(error, 'GetAccount');
      throw new Error(userMessage);
    }
  },

  // Login (if you have a login endpoint)
  login: async (credentials) => {
    try {
      const apiCall = (apiInstance) => apiInstance.post('/login', credentials);
      const response = await tryWithMultipleProxies(apiCall);
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
  }
};

// Export a simple function that tries all options
export const createCommand = async (commandData) => {
  return commandAPIWithProxy.createCommand(commandData);
};

export const getCommands = async () => {
  return commandAPIWithProxy.getCommands();
};

export const getWorkers = async () => {
  return workerAPIWithProxy.getWorkers();
};

export const createWorker = async (workerData) => {
  return workerAPIWithProxy.createWorker(workerData);
}; 