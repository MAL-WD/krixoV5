import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const DetailedApiTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testCreateCommandWithDetails = async () => {
    setLoading(true);
    const backendUrl = 'https://gokrixo.onrender.com';
    
    // Test different data formats
    const testCases = [
      {
        name: 'Minimal Data',
        data: {
          firstName: "test",
          number: "01234567",
          service: "test service",
          workers: "1",
          start: "test start",
          distination: "test end"
        }
      },
      {
        name: 'Full Data',
        data: {
          firstName: "Test User",
          number: "0551234567",
          service: "ترحيل, ترتيب",
          workers: "2",
          start: "الجزائر العاصمة",
          distination: "وهران"
        }
      },
      {
        name: 'With Additional Fields',
        data: {
          firstName: "test",
          number: "01234567",
          service: "test service",
          workers: "1",
          start: "test start",
          distination: "test end",
          description: "test description",
          price: 1000
        }
      }
    ];

    for (const testCase of testCases) {
      try {
        console.log(`Testing: ${testCase.name}`);
        console.log('Data:', testCase.data);
        
        const response = await fetch(`${backendUrl}/CreateCommand`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(testCase.data)
        });
        
        console.log(`Response for ${testCase.name}:`, response);
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        let responseData = null;
        let responseText = '';
        
        try {
          responseData = await response.json();
          console.log('Response JSON:', responseData);
        } catch (jsonError) {
          responseText = await response.text();
          console.log('Response text:', responseText);
        }
        
        setResults(prev => ({
          ...prev,
          [testCase.name]: {
            success: response.ok,
            status: response.status,
            statusText: response.statusText,
            data: responseData,
            text: responseText,
            message: response.ok ? 'Success' : `Failed: ${response.status} ${response.statusText}`
          }
        }));
        
        if (response.ok) {
          toast.success(`${testCase.name}: Success`);
        } else {
          toast.error(`${testCase.name}: ${response.status}`);
        }
      } catch (error) {
        console.error(`Error testing ${testCase.name}:`, error);
        
        setResults(prev => ({
          ...prev,
          [testCase.name]: {
            success: false,
            error: error.message,
            message: `Network error: ${error.message}`
          }
        }));
        
        toast.error(`${testCase.name}: Network error`);
      }
    }
    
    setLoading(false);
  };

  const testBackendEndpoints = async () => {
    setLoading(true);
    const backendUrl = 'https://gokrixo.onrender.com';
    
    const endpoints = [
      { path: '/', method: 'GET', name: 'Root' },
      { path: '/health', method: 'GET', name: 'Health' },
      { path: '/api', method: 'GET', name: 'API Info' },
      { path: '/GetCommands', method: 'GET', name: 'Get Commands' },
      { path: '/GetWorkers', method: 'GET', name: 'Get Workers' }
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Testing endpoint: ${endpoint.path}`);
        
        const response = await fetch(`${backendUrl}${endpoint.path}`, {
          method: endpoint.method,
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        console.log(`Response for ${endpoint.path}:`, response);
        
        let responseData = null;
        let responseText = '';
        
        try {
          responseData = await response.json();
        } catch (jsonError) {
          responseText = await response.text();
        }
        
        setResults(prev => ({
          ...prev,
          [`endpoint_${endpoint.name}`]: {
            success: response.ok,
            status: response.status,
            statusText: response.statusText,
            data: responseData,
            text: responseText,
            message: response.ok ? 'Success' : `Failed: ${response.status}`
          }
        }));
        
        if (response.ok) {
          toast.success(`${endpoint.name}: Success`);
        } else {
          toast.error(`${endpoint.name}: ${response.status}`);
        }
      } catch (error) {
        console.error(`Error testing ${endpoint.path}:`, error);
        
        setResults(prev => ({
          ...prev,
          [`endpoint_${endpoint.name}`]: {
            success: false,
            error: error.message,
            message: `Network error: ${error.message}`
          }
        }));
        
        toast.error(`${endpoint.name}: Network error`);
      }
    }
    
    setLoading(false);
  };

  const testWithDifferentHeaders = async () => {
    setLoading(true);
    const backendUrl = 'https://gokrixo.onrender.com';
    
    const headerTests = [
      {
        name: 'Basic Headers',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      },
      {
        name: 'With User-Agent',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      },
      {
        name: 'With Origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'http://localhost:5173'
        }
      }
    ];

    const testData = {
      firstName: "test",
      number: "01234567",
      service: "test service",
      workers: "1",
      start: "test start",
      distination: "test end"
    };

    for (const headerTest of headerTests) {
      try {
        console.log(`Testing with headers: ${headerTest.name}`);
        
        const response = await fetch(`${backendUrl}/CreateCommand`, {
          method: 'POST',
          mode: 'cors',
          headers: headerTest.headers,
          body: JSON.stringify(testData)
        });
        
        console.log(`Response for ${headerTest.name}:`, response);
        
        let responseData = null;
        let responseText = '';
        
        try {
          responseData = await response.json();
        } catch (jsonError) {
          responseText = await response.text();
        }
        
        setResults(prev => ({
          ...prev,
          [`headers_${headerTest.name}`]: {
            success: response.ok,
            status: response.status,
            statusText: response.statusText,
            data: responseData,
            text: responseText,
            message: response.ok ? 'Success' : `Failed: ${response.status}`
          }
        }));
        
        if (response.ok) {
          toast.success(`${headerTest.name}: Success`);
        } else {
          toast.error(`${headerTest.name}: ${response.status}`);
        }
      } catch (error) {
        console.error(`Error testing ${headerTest.name}:`, error);
        
        setResults(prev => ({
          ...prev,
          [`headers_${headerTest.name}`]: {
            success: false,
            error: error.message,
            message: `Network error: ${error.message}`
          }
        }));
        
        toast.error(`${headerTest.name}: Network error`);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Detailed API Test</h1>
        
        <div className="mb-8 text-center space-x-4">
          <button
            onClick={testCreateCommandWithDetails}
            disabled={loading}
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test CreateCommand'}
          </button>
          
          <button
            onClick={testBackendEndpoints}
            disabled={loading}
            className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Endpoints'}
          </button>
          
          <button
            onClick={testWithDifferentHeaders}
            disabled={loading}
            className="bg-purple-500 text-white py-3 px-6 rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Headers'}
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
                {result.statusText && <p className="text-sm">Status Text: {result.statusText}</p>}
                {result.error && <p className="text-sm">Error: {result.error}</p>}
                {result.data && <p className="text-sm">Data: {JSON.stringify(result.data, null, 2)}</p>}
                {result.text && <p className="text-sm">Text: {result.text}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* 403 Error Analysis */}
        <div className="mt-8 bg-red-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-red-800">403 Error Analysis</h3>
          <div className="space-y-4 text-red-800">
            <div>
              <h4 className="font-semibold">Possible causes of 403 Forbidden:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Backend requires authentication/API key</li>
                <li>Request format doesn't match backend expectations</li>
                <li>Backend validation is failing</li>
                <li>Rate limiting or IP blocking</li>
                <li>Missing required headers</li>
                <li>Backend is rejecting the request for security reasons</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold">Next steps:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Check backend logs for detailed error messages</li>
                <li>Verify the expected request format with backend developer</li>
                <li>Check if authentication is required</li>
                <li>Test with different data formats</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedApiTest; 