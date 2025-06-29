import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const BackendDiagnostic = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testBackendUrls = async () => {
    setLoading(true);
    const urls = [
      'https://gokrixo.onrender.com',
      'https://gokrixo.onrender.com/',
      'https://gokrixo.onrender.com/health',
      'https://gokrixo.onrender.com/api',
      'https://gokrixo.onrender.com/CreateCommand'
    ];

    for (const url of urls) {
      try {
        console.log(`Testing URL: ${url}`);
        
        const response = await fetch(url, {
          method: 'GET',
          mode: 'no-cors', // Try without CORS first
        });
        
        console.log(`Response for ${url}:`, response);
        
        setResults(prev => ({
          ...prev,
          [url]: {
            success: true,
            status: response.status,
            statusText: response.statusText,
            message: `URL accessible (no-cors mode)`
          }
        }));
        
        toast.success(`${url} is accessible`);
      } catch (error) {
        console.error(`Error testing ${url}:`, error);
        
        // Try with CORS mode
        try {
          const corsResponse = await fetch(url, {
            method: 'GET',
            mode: 'cors',
          });
          
          setResults(prev => ({
            ...prev,
            [url]: {
              success: true,
              status: corsResponse.status,
              statusText: corsResponse.statusText,
              message: `URL accessible (cors mode)`
            }
          }));
          
          toast.success(`${url} is accessible with CORS`);
        } catch (corsError) {
          console.error(`CORS error for ${url}:`, corsError);
          
          setResults(prev => ({
            ...prev,
            [url]: {
              success: false,
              error: corsError.message,
              message: `URL not accessible: ${corsError.message}`
            }
          }));
          
          toast.error(`${url} not accessible`);
        }
      }
    }
    
    setLoading(false);
  };

  const testWithCurl = async () => {
    setLoading(true);
    
    try {
      // Test if we can reach the domain
      const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
      });
      
      if (response.ok) {
        setResults(prev => ({
          ...prev,
          network: {
            success: true,
            message: 'Network connectivity is working'
          }
        }));
        toast.success('Network connectivity is working');
      }
    } catch (error) {
      setResults(prev => ({
        ...prev,
        network: {
          success: false,
          error: error.message,
          message: 'Network connectivity issue'
        }
      }));
      toast.error('Network connectivity issue');
    }
    
    setLoading(false);
  };

  const testBackendStatus = async () => {
    setLoading(true);
    
    try {
      // Try to get basic info about the backend
      const response = await fetch('https://gokrixo.onrender.com', {
        method: 'HEAD', // Just get headers, no body
        mode: 'no-cors',
      });
      
      console.log('Backend status response:', response);
      
      setResults(prev => ({
        ...prev,
        status: {
          success: true,
          message: 'Backend responds to HEAD request',
          details: 'Server is running but may have CORS issues'
        }
      }));
      
      toast.success('Backend is running');
    } catch (error) {
      console.error('Backend status error:', error);
      
      setResults(prev => ({
        ...prev,
        status: {
          success: false,
          error: error.message,
          message: 'Backend is not responding',
          details: 'Server may be down or URL is incorrect'
        }
      }));
      
      toast.error('Backend is not responding');
    }
    
    setLoading(false);
  };

  const checkBackendInfo = () => {
    setResults(prev => ({
      ...prev,
      info: {
        success: true,
        message: 'Backend Information',
        details: `
          URL: https://gokrixo.onrender.com
          Expected endpoints: /CreateCommand, /GetCommands, /CreateWorker, /GetWorkers
          Issue: Likely CORS configuration missing or server down
          Solution: Add CORS headers to backend or check server status
        `
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Backend Diagnostic</h1>
        
        <div className="mb-8 text-center space-x-4">
          <button
            onClick={testBackendUrls}
            disabled={loading}
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Backend URLs'}
          </button>
          
          <button
            onClick={testWithCurl}
            disabled={loading}
            className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Network'}
          </button>
          
          <button
            onClick={testBackendStatus}
            disabled={loading}
            className="bg-purple-500 text-white py-3 px-6 rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Backend Status'}
          </button>
          
          <button
            onClick={checkBackendInfo}
            disabled={loading}
            className="bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 disabled:opacity-50"
          >
            Backend Info
          </button>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(results).map(([name, result]) => (
            <div key={name} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-blue-600 capitalize">{name}</h3>
              <div className={`p-4 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-semibold">{result.message}</p>
                {result.status && <p className="text-sm">Status: {result.status}</p>}
                {result.statusText && <p className="text-sm">Status Text: {result.statusText}</p>}
                {result.error && <p className="text-sm">Error: {result.error}</p>}
                {result.details && <p className="text-sm mt-2">{result.details}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-blue-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Recommendations</h3>
          <div className="space-y-4 text-blue-800">
            <div>
              <h4 className="font-semibold">If "Failed to fetch" error:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Backend server is down or not running</li>
                <li>Backend URL is incorrect</li>
                <li>Network connectivity issues</li>
                <li>Backend is blocking requests</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold">If backend responds but CORS fails:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Add CORS headers to your backend</li>
                <li>Check that your frontend URL is in allowed origins</li>
                <li>Verify CORS middleware is applied before routes</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold">Immediate actions:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Check if your backend server is running</li>
                <li>Verify the backend URL is correct</li>
                <li>Test the backend URL in a browser</li>
                <li>Check backend logs for errors</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Manual Testing Instructions */}
        <div className="mt-8 bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-yellow-800">Manual Testing</h3>
          <p className="text-yellow-800 mb-4">Try these in your browser or terminal:</p>
          
          <div className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto">
            <pre className="text-sm">
{`# Test in browser:
https://gokrixo.onrender.com

# Test with curl (if available):
curl -I https://gokrixo.onrender.com
curl -X GET https://gokrixo.onrender.com/CreateCommand

# Test with PowerShell:
Invoke-WebRequest -Uri "https://gokrixo.onrender.com" -Method GET
`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendDiagnostic; 