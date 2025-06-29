import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const CorsTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testDirectConnection = async () => {
    setLoading(true);
    const backendUrl = 'https://gokrixo.onrender.com';
    
    try {
      console.log('Testing direct connection to:', backendUrl);
      
      const response = await fetch(`${backendUrl}/CreateCommand`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          firstName: "test",
          number: "01234567",
          service: "test service",
          workers: "1",
          start: "test start",
          distination: "test end"
        })
      });
      
      console.log('Direct response status:', response.status);
      console.log('Direct response headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        setResults(prev => ({
          ...prev,
          direct: {
            success: true,
            status: response.status,
            data: data,
            message: 'Direct connection works!'
          }
        }));
        toast.success('Direct connection works!');
      } else {
        const errorText = await response.text();
        setResults(prev => ({
          ...prev,
          direct: {
            success: false,
            status: response.status,
            error: errorText,
            message: `Direct connection failed: ${response.status}`
          }
        }));
        toast.error(`Direct failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Direct connection error:', error);
      setResults(prev => ({
        ...prev,
        direct: {
          success: false,
          error: error.message,
          message: 'Direct connection failed (CORS likely)'
        }
      }));
      toast.error('Direct connection failed (CORS likely)');
    }
    
    setLoading(false);
  };

  const testProxyConnection = async () => {
    setLoading(true);
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/https://gokrixo.onrender.com';
    
    try {
      console.log('Testing proxy connection to:', proxyUrl);
      
      const response = await fetch(`${proxyUrl}/CreateCommand`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          firstName: "test",
          number: "01234567",
          service: "test service",
          workers: "1",
          start: "test start",
          distination: "test end"
        })
      });
      
      console.log('Proxy response status:', response.status);
      console.log('Proxy response headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        setResults(prev => ({
          ...prev,
          proxy: {
            success: true,
            status: response.status,
            data: data,
            message: 'Proxy connection works!'
          }
        }));
        toast.success('Proxy connection works!');
      } else {
        const errorText = await response.text();
        setResults(prev => ({
          ...prev,
          proxy: {
            success: false,
            status: response.status,
            error: errorText,
            message: `Proxy connection failed: ${response.status}`
          }
        }));
        toast.error(`Proxy failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Proxy connection error:', error);
      setResults(prev => ({
        ...prev,
        proxy: {
          success: false,
          error: error.message,
          message: 'Proxy connection failed'
        }
      }));
      toast.error('Proxy connection failed');
    }
    
    setLoading(false);
  };

  const testBackendHealth = async () => {
    setLoading(true);
    const backendUrl = 'https://gokrixo.onrender.com';
    
    try {
      console.log('Testing backend health...');
      
      const response = await fetch(backendUrl, {
        method: 'GET',
        mode: 'cors',
      });
      
      console.log('Health check status:', response.status);
      console.log('Health check headers:', response.headers);
      
      setResults(prev => ({
        ...prev,
        health: {
          success: response.ok,
          status: response.status,
          message: `Backend health check: ${response.ok ? 'OK' : 'Failed'}`
        }
      }));
      
      if (response.ok) {
        toast.success('Backend is reachable');
      } else {
        toast.error('Backend health check failed');
      }
    } catch (error) {
      console.error('Health check error:', error);
      setResults(prev => ({
        ...prev,
        health: {
          success: false,
          error: error.message,
          message: 'Backend not reachable'
        }
      }));
      toast.error('Backend not reachable');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">CORS Test</h1>
        
        <div className="mb-8 text-center space-x-4">
          <button
            onClick={testBackendHealth}
            disabled={loading}
            className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Backend Health'}
          </button>
          
          <button
            onClick={testDirectConnection}
            disabled={loading}
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Direct Connection'}
          </button>
          
          <button
            onClick={testProxyConnection}
            disabled={loading}
            className="bg-purple-500 text-white py-3 px-6 rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Proxy Connection'}
          </button>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(results).map(([name, result]) => (
            <div key={name} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-blue-600 capitalize">{name}</h3>
              <div className={`p-4 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-semibold">{result.message}</p>
                {result.status && <p className="text-sm">Status: {result.status}</p>}
                {result.error && <p className="text-sm">Error: {result.error}</p>}
                {result.data && <p className="text-sm">Data: {JSON.stringify(result.data)}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-yellow-800">Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-800">
            <li>Click "Test Backend Health" to check if the backend is reachable</li>
            <li>Click "Test Direct Connection" to test the CreateCommand endpoint directly</li>
            <li>Click "Test Proxy Connection" to test through a CORS proxy</li>
            <li>If direct fails but proxy works, your backend needs CORS configuration</li>
            <li>If both fail, there might be a backend issue</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CorsTest; 