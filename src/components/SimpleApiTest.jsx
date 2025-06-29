import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { workerAPI } from '../services/api';

const SimpleApiTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [workers, setWorkers] = useState(null);
  const [error, setError] = useState(null);

  const testExactDataFormat = async () => {
    setLoading(true);
    const backendUrl = 'https://gokrixo.onrender.com';
    
    // Test the exact data format that your form sends
    const exactData = {
      firstName: "test",
      number: "01234567",
      service: "test service",
      workers: "1",
      start: "test start",
      distination: "test end"
    };

    console.log('Testing with exact data format:', exactData);
    
    try {
      const response = await fetch(`${backendUrl}/CreateCommand`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(exactData)
      });
      
      console.log('Response:', response);
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      
      let responseText = '';
      let responseData = null;
      
      try {
        responseData = await response.json();
        console.log('Response JSON:', responseData);
      } catch (jsonError) {
        responseText = await response.text();
        console.log('Response text:', responseText);
      }
      
      setResults(prev => ({
        ...prev,
        exactFormat: {
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          data: responseData,
          text: responseText,
          message: response.ok ? 'Success!' : `Failed: ${response.status} ${response.statusText}`
        }
      }));
      
      if (response.ok) {
        toast.success('Exact format works!');
      } else {
        toast.error(`Exact format failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Error testing exact format:', error);
      
      setResults(prev => ({
        ...prev,
        exactFormat: {
          success: false,
          error: error.message,
          message: `Network error: ${error.message}`
        }
      }));
      
      toast.error('Network error');
    }
    
    setLoading(false);
  };

  const testWithFormData = async () => {
    setLoading(true);
    const backendUrl = 'https://gokrixo.onrender.com';
    
    // Test with FormData instead of JSON
    const formData = new FormData();
    formData.append('firstName', 'test');
    formData.append('number', '01234567');
    formData.append('service', 'test service');
    formData.append('workers', '1');
    formData.append('start', 'test start');
    formData.append('distination', 'test end');

    console.log('Testing with FormData');
    
    try {
      const response = await fetch(`${backendUrl}/CreateCommand`, {
        method: 'POST',
        mode: 'cors',
        body: formData
      });
      
      console.log('FormData Response:', response);
      console.log('Status:', response.status);
      
      let responseText = '';
      let responseData = null;
      
      try {
        responseData = await response.json();
      } catch (jsonError) {
        responseText = await response.text();
      }
      
      setResults(prev => ({
        ...prev,
        formData: {
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          data: responseData,
          text: responseText,
          message: response.ok ? 'FormData works!' : `FormData failed: ${response.status}`
        }
      }));
      
      if (response.ok) {
        toast.success('FormData works!');
      } else {
        toast.error(`FormData failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Error testing FormData:', error);
      
      setResults(prev => ({
        ...prev,
        formData: {
          success: false,
          error: error.message,
          message: `Network error: ${error.message}`
        }
      }));
      
      toast.error('FormData network error');
    }
    
    setLoading(false);
  };

  const testGetEndpoints = async () => {
    setLoading(true);
    const backendUrl = 'https://gokrixo.onrender.com';
    
    try {
      // Test GET endpoints to see if they work
      const response = await fetch(`${backendUrl}/GetCommands`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log('GetCommands Response:', response);
      
      let responseText = '';
      let responseData = null;
      
      try {
        responseData = await response.json();
      } catch (jsonError) {
        responseText = await response.text();
      }
      
      setResults(prev => ({
        ...prev,
        getCommands: {
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          data: responseData,
          text: responseText,
          message: response.ok ? 'GetCommands works!' : `GetCommands failed: ${response.status}`
        }
      }));
      
      if (response.ok) {
        toast.success('GetCommands works!');
      } else {
        toast.error(`GetCommands failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Error testing GetCommands:', error);
      
      setResults(prev => ({
        ...prev,
        getCommands: {
          success: false,
          error: error.message,
          message: `Network error: ${error.message}`
        }
      }));
      
      toast.error('GetCommands network error');
    }
    
    setLoading(false);
  };

  const testCreateWorker = async () => {
    setLoading(true);
    const backendUrl = 'https://gokrixo.onrender.com';
    
    // Test the exact data format that your form sends for workers
    const exactWorkerData = {
      fullname: "test worker",
      number: "01234567",
      email: "test@example.com",
      password: "defaultPassword123!",
      position: "Driver",
      experience: "5 years",
      message: "test message",
      isaccepted: false
    };

    console.log('Testing CreateWorker with exact data format:', exactWorkerData);
    
    try {
      const response = await fetch(`${backendUrl}/CreateWorker`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(exactWorkerData)
      });
      
      console.log('CreateWorker Response:', response);
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      
      let responseText = '';
      let responseData = null;
      
      try {
        responseData = await response.json();
        console.log('Response JSON:', responseData);
      } catch (jsonError) {
        responseText = await response.text();
        console.log('Response text:', responseText);
      }
      
      setResults(prev => ({
        ...prev,
        createWorker: {
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          data: responseData,
          text: responseText,
          message: response.ok ? 'CreateWorker Success!' : `CreateWorker Failed: ${response.status} ${response.statusText}`
        }
      }));
      
      if (response.ok) {
        toast.success('CreateWorker works!');
      } else {
        toast.error(`CreateWorker failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Error testing CreateWorker:', error);
      
      setResults(prev => ({
        ...prev,
        createWorker: {
          success: false,
          error: error.message,
          message: `Network error: ${error.message}`
        }
      }));
      
      toast.error('CreateWorker network error');
    }
    
    setLoading(false);
  };

  const testGetWorkers = async () => {
    setLoading(true);
    setError(null);
    setWorkers(null);
    
    try {
      console.log('Testing GetWorkers API...');
      const data = await workerAPI.getWorkers();
      console.log('GetWorkers response:', data);
      setWorkers(data);
      toast.success('GetWorkers successful!');
    } catch (err) {
      console.error('GetWorkers error:', err);
      setError(err.message);
      toast.error(`GetWorkers failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    setLoading(true);
    setError(null);
    setWorkers(null);
    
    try {
      console.log('Testing direct fetch to GetWorkers...');
      const response = await fetch('https://gokrixo.onrender.com/GetWorkers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Direct fetch response:', data);
      setWorkers(data);
      toast.success('Direct fetch successful!');
    } catch (err) {
      console.error('Direct fetch error:', err);
      setError(err.message);
      toast.error(`Direct fetch failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testWithCorsProxy = async () => {
    setLoading(true);
    setError(null);
    setWorkers(null);
    
    try {
      console.log('Testing GetWorkers with CORS proxy...');
      const response = await fetch('https://cors-anywhere.herokuapp.com/https://gokrixo.onrender.com/GetWorkers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('CORS proxy response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('CORS proxy response:', data);
      setWorkers(data);
      toast.success('CORS proxy successful!');
    } catch (err) {
      console.error('CORS proxy error:', err);
      setError(err.message);
      toast.error(`CORS proxy failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Simple API Test</h1>
        
        <div className="mb-8 text-center space-x-4">
          <button
            onClick={testExactDataFormat}
            disabled={loading}
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Exact Format'}
          </button>
          
          <button
            onClick={testWithFormData}
            disabled={loading}
            className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test FormData'}
          </button>
          
          <button
            onClick={testGetEndpoints}
            disabled={loading}
            className="bg-purple-500 text-white py-3 px-6 rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test GET Endpoints'}
          </button>
          
          <button
            onClick={testCreateWorker}
            disabled={loading}
            className="bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Create Worker'}
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
                {result.data && <p className="text-sm">Data: {JSON.stringify(result.data, null, 2)}</p>}
                {result.text && <p className="text-sm">Text: {result.text}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* 403 Analysis */}
        <div className="mt-8 bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-yellow-800">403 Error Analysis</h3>
          <div className="space-y-4 text-yellow-800">
            <div>
              <h4 className="font-semibold">If GET endpoints work but POST fails with 403:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Backend might require authentication for POST requests</li>
                <li>Backend might have rate limiting on POST requests</li>
                <li>Backend might be expecting different data format</li>
                <li>Backend might have validation rules that are failing</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold">If FormData works but JSON doesn't:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Backend expects form-encoded data, not JSON</li>
                <li>Content-Type header might be wrong</li>
                <li>Backend might not support JSON for this endpoint</li>
              </ul>
            </div>
          </div>
        </div>

        {/* GetWorkers Results */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">اختبارات GetWorkers</h2>
          
          <div className="grid gap-4">
            <button
              onClick={testGetWorkers}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'جاري الاختبار...' : 'اختبار GetWorkers API'}
            </button>
            
            <button
              onClick={testDirectFetch}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'جاري الاختبار...' : 'اختبار Direct Fetch'}
            </button>
            
            <button
              onClick={testWithCorsProxy}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'جاري الاختبار...' : 'اختبار مع CORS Proxy'}
            </button>
          </div>

          {/* Results */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-4">
              <h3 className="text-lg font-semibold text-red-900 mb-2">❌ خطأ</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {workers && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-4">
              <h3 className="text-lg font-semibold text-green-900 mb-4">✅ نجح الاختبار!</h3>
              <pre className="text-sm text-green-700 bg-green-100 p-4 rounded overflow-auto">
                {JSON.stringify(workers, null, 2)}
              </pre>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">تعليمات</h3>
            <ul className="text-blue-800 space-y-2">
              <li>• <strong>GetWorkers API:</strong> اختبار باستخدام API service</li>
              <li>• <strong>Direct Fetch:</strong> اختبار مباشر باستخدام Fetch API</li>
              <li>• <strong>CORS Proxy:</strong> اختبار عبر خادم وسيط لحل مشكلة CORS</li>
              <li>• إذا فشل الاختبار الأول، جرب الاختبارات الأخرى</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleApiTest; 