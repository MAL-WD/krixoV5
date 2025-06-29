import axios from 'axios';

const BACKEND_URL = 'https://gokrixo.onrender.com';

// List of CORS proxy services
const CORS_PROXIES = [
  'https://cors-anywhere.herokuapp.com',
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://thingproxy.freeboard.io/fetch/',
  'https://cors.bridged.cc/'
];

class CorsProxyService {
  constructor() {
    this.currentProxyIndex = 0;
  }

  // Get the current proxy URL
  getCurrentProxy() {
    return CORS_PROXIES[this.currentProxyIndex];
  }

  // Switch to next proxy
  nextProxy() {
    this.currentProxyIndex = (this.currentProxyIndex + 1) % CORS_PROXIES.length;
    return this.getCurrentProxy();
  }

  // Make a request through the current proxy
  async request(endpoint, options = {}) {
    const proxyUrl = this.getCurrentProxy();
    const fullUrl = `${proxyUrl}${BACKEND_URL}${endpoint}`;
    
    console.log(`Making request through proxy: ${proxyUrl}`);
    console.log(`Full URL: ${fullUrl}`);

    try {
      const response = await axios({
        url: fullUrl,
        method: options.method || 'GET',
        data: options.data,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        },
        timeout: options.timeout || 15000
      });

      console.log('Proxy request successful');
      return response;
    } catch (error) {
      console.error(`Proxy ${proxyUrl} failed:`, error.message);
      
      // Try next proxy if available
      if (this.currentProxyIndex < CORS_PROXIES.length - 1) {
        console.log('Trying next proxy...');
        this.nextProxy();
        return this.request(endpoint, options);
      }
      
      throw error;
    }
  }

  // Specific methods for different endpoints
  async getCommands() {
    return this.request('/GetCommands');
  }

  async getWorkers() {
    return this.request('/GetWorkers');
  }

  async updateCommandStatus(commandId, status) {
    return this.request('/UpdateCommandStatus', {
      method: 'PUT',
      data: { commandId, status }
    });
  }

  async updateWorkerStatus(workerId, status, password = null) {
    return this.request('/UpdateWorkerStatus', {
      method: 'PUT',
      data: { workerId, status, password }
    });
  }

  async createCommand(commandData) {
    return this.request('/CreateCommand', {
      method: 'POST',
      data: commandData
    });
  }

  async createWorker(workerData) {
    return this.request('/CreateWorker', {
      method: 'POST',
      data: workerData
    });
  }
}

export default new CorsProxyService(); 