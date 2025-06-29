import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const BackendTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testBackendAccess = async () => {
    setLoading(true);
    const backendUrl = 'https://gokrixo.onrender.com';
    
    try {
      // Test 1: Simple fetch to check if server is reachable
      console.log('Testing backend accessibility...');
      const response = await fetch(backendUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      setResults(prev => ({
        ...prev,
        accessibility: {
          success: true,
          status: response.status,
          message: 'Backend is reachable'
        }
      }));
      
      toast.success('Backend is reachable');
    } catch (error) {
      console.error('Accessibility test failed:', error);
      setResults(prev => ({
        ...prev,
        accessibility: {
          success: false,
          error: error.message,
          message: 'Backend is not reachable'
        }
      }));
      toast.error('Backend is not reachable');
    }
    
    try {
      // Test 2: Test CreateCommand endpoint with detailed CORS info
      console.log('Testing CreateCommand endpoint...');
      const testData = {
        firstName: "test",
        number: "01234567",
        service: "test service",
        workers: "1",
        start: "test start",
        distination: "test end"
      };
      
      console.log('Sending request to:', `${backendUrl}/CreateCommand`);
      console.log('Request data:', testData);
      
      const response = await fetch(`${backendUrl}/CreateCommand`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(testData)
      });
      
      console.log('CreateCommand response status:', response.status);
      console.log('CreateCommand response headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log('CreateCommand response data:', data);
        setResults(prev => ({
          ...prev,
          createCommand: {
            success: true,
            status: response.status,
            data: data,
            message: 'CreateCommand endpoint works'
          }
        }));
        toast.success('CreateCommand endpoint works');
      } else {
        const errorText = await response.text();
        console.log('CreateCommand error response:', errorText);
        setResults(prev => ({
          ...prev,
          createCommand: {
            success: false,
            status: response.status,
            error: errorText,
            message: `CreateCommand failed with status ${response.status}`
          }
        }));
        toast.error(`CreateCommand failed: ${response.status}`);
      }
    } catch (error) {
      console.error('CreateCommand test failed:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error type:', error.constructor.name);
      
      let errorMessage = 'CreateCommand network error (likely CORS)';
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorMessage = 'CORS Error: Request blocked by browser. Backend needs CORS headers.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Network Error: Cannot reach server. Check if backend is running.';
      }
      
      setResults(prev => ({
        ...prev,
        createCommand: {
          success: false,
          error: error.message,
          message: errorMessage
        }
      }));
      toast.error(errorMessage);
    }
    
    setLoading(false);
  };

  const testWithDifferentMethods = async () => {
    setLoading(true);
    const backendUrl = 'https://gokrixo.onrender.com';
    
    // Test with different CORS modes
    const tests = [
      { name: 'no-cors', mode: 'no-cors' },
      { name: 'cors', mode: 'cors' },
      { name: 'same-origin', mode: 'same-origin' }
    ];
    
    for (const test of tests) {
      try {
        console.log(`Testing with mode: ${test.mode}`);
        const response = await fetch(`${backendUrl}/CreateCommand`, {
          method: 'POST',
          mode: test.mode,
          headers: {
            'Content-Type': 'application/json',
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
        
        setResults(prev => ({
          ...prev,
          [test.name]: {
            success: response.ok,
            status: response.status,
            message: `Mode ${test.mode}: ${response.ok ? 'Success' : 'Failed'}`
          }
        }));
      } catch (error) {
        setResults(prev => ({
          ...prev,
          [test.name]: {
            success: false,
            error: error.message,
            message: `Mode ${test.mode}: Error`
          }
        }));
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Backend CORS Test</h1>
        
        <div className="mb-8 text-center space-x-4">
          <button
            onClick={testBackendAccess}
            disabled={loading}
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Backend Access'}
          </button>
          
          <button
            onClick={testWithDifferentMethods}
            disabled={loading}
            className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test CORS Modes'}
          </button>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(results).map(([name, result]) => (
            <div key={name} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">{name}</h3>
              <div className={`p-4 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-semibold">{result.message}</p>
                {result.status && <p className="text-sm">Status: {result.status}</p>}
                {result.error && <p className="text-sm">Error: {result.error}</p>}
                {result.data && <p className="text-sm">Data: {JSON.stringify(result.data)}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* CORS Solution */}
        <div className="mt-8 bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-yellow-800">CORS Solution</h3>
          <p className="mb-4">If you're getting CORS errors, add this to your backend:</p>
          
          <div className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto">
            <pre className="text-sm">
{`// Node.js/Express
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Or for testing (allow all origins):
app.use(cors({
  origin: '*',
  credentials: false
});`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendTest; 