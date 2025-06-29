// Backend Configuration
// Update this URL to match your backend server address
export const BACKEND_CONFIG = {
  // Development
  development: {
    baseURL: 'https://gokrixo.onrender.com',
    timeout: 10000,
  },
  
  // Production
  production: {
    baseURL: 'https://gokrixo.onrender.com',
    timeout: 10000,
  },
  
  // Test
  test: {
    baseURL: 'https://gokrixo.onrender.com',
    timeout: 5000,
  }
};

// CORS Proxy Configuration (temporary workaround)
export const CORS_PROXY_CONFIG = {
  // Option 1: Use a public CORS proxy (temporary solution)
  withProxy: {
    baseURL: 'https://cors-anywhere.herokuapp.com/https://gokrixo.onrender.com',
    timeout: 15000, // Longer timeout for proxy
  },
  
  // Option 2: Direct connection (requires backend CORS fix)
  direct: {
    baseURL: 'https://gokrixo.onrender.com',
    timeout: 10000,
  }
};

// Get current environment - simplified for browser compatibility
const getEnvironment = () => {
  // For now, always use development config in browser
  // You can manually change this if needed
  return 'development';
};

// Export current config
export const currentConfig = BACKEND_CONFIG[getEnvironment()];

// Function to get config with CORS proxy option
export const getConfigWithProxy = (useProxy = false) => {
  if (useProxy) {
    return CORS_PROXY_CONFIG.withProxy;
  }
  return CORS_PROXY_CONFIG.direct;
};

// API Endpoints
export const API_ENDPOINTS = {
  // Commands
  CREATE_COMMAND: '/CreateCommand',
  GET_COMMANDS: '/GetCommands',
  
  // Workers
  CREATE_WORKER: '/CreateWorker',
  GET_WORKERS: '/GetWorkers',
  
  // Authentication
  REGISTRATION: '/Regestration',
  LOGIN: '/login',
  GET_ACCOUNT: '/account',
  
  // Health check
  HEALTH: '/health',
};

// Example backend setup instructions:
/*
1. Make sure your backend server is running on the correct port
2. Update the baseURL in this file to match your backend URL
3. Ensure CORS is properly configured on your backend
4. Test the connection using the /api-test route

Backend CORS configuration example (Node.js/Express):
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

Backend CORS configuration example (Python/Flask):
from flask_cors import CORS
CORS(app, origins=['http://localhost:5173'])

Backend CORS configuration example (Python/Django):
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

Temporary CORS Workaround:
If you can't fix the backend CORS immediately, you can use a CORS proxy:
1. Change the baseURL to use a CORS proxy service
2. This is only for development/testing
3. For production, fix the backend CORS configuration
*/ 