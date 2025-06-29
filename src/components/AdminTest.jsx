import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const BACKEND_URL = 'https://gokrixo.onrender.com';

const AdminTest = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});

  const testDirectRequest = async () => {
    setLoading(true);
    try {
      console.log('Testing direct request to:', `${BACKEND_URL}/GetCommands`);
      
      const response = await axios.get(`${BACKEND_URL}/GetCommands`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        timeout: 20000 
      });
      
// Copy and paste this code in your browser console (F12)

console.log('Testing backend connection...');

// Test 1: Direct fetch
fetch('https://gokrixo.onrender.com/GetCommands')
  .then(response => {
    console.log('✅ Direct fetch successful:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Data:', data);
  })
  .catch(error => {
    console.log('❌ Direct fetch failed:', error.message);
    
    // Test 2: CORS proxy
    console.log('Trying CORS proxy...');
    return fetch('https://cors-anywhere.herokuapp.com/https://gokrixo.onrender.com/GetCommands');
  })
  .then(response => {
    if (response) {
      console.log('✅ CORS proxy successful:', response.status);
      return response.json();
    }
  })
  .then(data => {
    if (data) console.log('Proxy data:', data);
  })
  .catch(error => {
    console.log('❌ CORS proxy also failed:', error.message);
  });

      console.log('Direct request successful:', response.data);
      setResults(prev => ({ ...prev, direct: { success: true, data: response.data } }));
      toast.success('Direct request successful!');
      
    } catch (error) {
      console.error('Direct request failed:', error);
      
      let errorDetails = {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText
      };
      
      // Add CORS-specific information
      if (error.message === 'Network Error') {
        errorDetails.corsIssue = true;
        errorDetails.explanation = 'This is a CORS (Cross-Origin Resource Sharing) issue. The backend server needs to allow requests from your frontend domain.';
        errorDetails.solution = 'Use the CORS Proxy test below as a workaround.';
      }
      
      setResults(prev => ({ 
        ...prev, 
        direct: { 
          success: false, 
          error: error.message,
          details: errorDetails
        } 
      }));
      toast.error(`Direct request failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testCorsProxy = async () => {
    setLoading(true);
    try {
      console.log('Testing CORS proxy request...');
      
      const response = await axios.get(`https://cors-anywhere.herokuapp.com/${BACKEND_URL}/GetCommands`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        timeout: 15000
      });
      
      console.log('CORS proxy request successful:', response.data);
      setResults(prev => ({ ...prev, corsProxy: { success: true, data: response.data } }));
      toast.success('CORS proxy request successful!');
      
    } catch (error) {
      console.error('CORS proxy request failed:', error);
      setResults(prev => ({ 
        ...prev, 
        corsProxy: { 
          success: false, 
          error: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText
        } 
      }));
      toast.error(`CORS proxy failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testFetchAPI = async () => {
    setLoading(true);
    try {
      console.log('Testing Fetch API...');
      
      const response = await fetch(`${BACKEND_URL}/GetCommands`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetch API successful:', data);
      setResults(prev => ({ ...prev, fetch: { success: true, data } }));
      toast.success('Fetch API successful!');
      
    } catch (error) {
      console.error('Fetch API failed:', error);
      setResults(prev => ({ 
        ...prev, 
        fetch: { 
          success: false, 
          error: error.message
        } 
      }));
      toast.error(`Fetch API failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testBackendHealth = async () => {
    setLoading(true);
    try {
      console.log('Testing backend health...');
      
      const response = await axios.get(`${BACKEND_URL}/health`, {
        timeout: 5000
      });
      
      console.log('Backend health check successful:', response.data);
      setResults(prev => ({ ...prev, health: { success: true, data: response.data } }));
      toast.success('Backend is healthy!');
      
    } catch (error) {
      console.error('Backend health check failed:', error);
      setResults(prev => ({ 
        ...prev, 
        health: { 
          success: false, 
          error: error.message,
          status: error.response?.status
        } 
      }));
      toast.error(`Backend health check failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testInBrowserConsole = () => {
    const testCode = `
// Copy and paste this code in your browser console (F12)

console.log('Testing backend connection...');

// Test 1: Direct fetch
fetch('https://gokrixo.onrender.com/GetCommands')
  .then(response => {
    console.log('✅ Direct fetch successful:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Data:', data);
  })
  .catch(error => {
    console.log('❌ Direct fetch failed:', error.message);
    
    // Test 2: CORS proxy
    console.log('Trying CORS proxy...');
    return fetch('https://cors-anywhere.herokuapp.com/https://gokrixo.onrender.com/GetCommands');
  })
  .then(response => {
    if (response) {
      console.log('✅ CORS proxy successful:', response.status);
      return response.json();
    }
  })
  .then(data => {
    if (data) console.log('Proxy data:', data);
  })
  .catch(error => {
    console.log('❌ CORS proxy also failed:', error.message);
  });
`;

    // Copy to clipboard
    navigator.clipboard.writeText(testCode).then(() => {
      toast.success('تم نسخ كود الاختبار إلى الحافظة!');
      console.log('Test code copied to clipboard. Paste it in browser console (F12)');
    }).catch(() => {
      toast.error('فشل في نسخ الكود');
    });
  };

  const testGetWorkers = async () => {
    setLoading(true);
    try {
      console.log('Testing GetWorkers endpoint...');
      
      // Test 1: Direct axios request
      const response = await axios.get(`${BACKEND_URL}/GetWorkers`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        timeout: 20000 
      });
      
      console.log('GetWorkers successful:', response.data);
      setResults(prev => ({ ...prev, getWorkers: { success: true, data: response.data } }));
      toast.success('GetWorkers request successful!');
      
    } catch (error) {
      console.error('GetWorkers failed:', error);
      
      let errorDetails = {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: `${BACKEND_URL}/GetWorkers`
      };
      
      // Add CORS-specific information
      if (error.message === 'Network Error') {
        errorDetails.corsIssue = true;
        errorDetails.explanation = 'This is a CORS (Cross-Origin Resource Sharing) issue. The backend server needs to allow requests from your frontend domain.';
        errorDetails.solution = 'Use the CORS Proxy test below as a workaround.';
      }
      
      setResults(prev => ({ 
        ...prev, 
        getWorkers: { 
          success: false, 
          error: error.message,
          details: errorDetails
        } 
      }));
      toast.error(`GetWorkers failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetWorkersWithProxy = async () => {
    setLoading(true);
    try {
      console.log('Testing GetWorkers with CORS proxy...');
      
      const response = await axios.get(`https://cors-anywhere.herokuapp.com/${BACKEND_URL}/GetWorkers`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        timeout: 15000
      });
      
      console.log('GetWorkers with proxy successful:', response.data);
      setResults(prev => ({ ...prev, getWorkersProxy: { success: true, data: response.data } }));
      toast.success('GetWorkers with proxy successful!');
      
    } catch (error) {
      console.error('GetWorkers with proxy failed:', error);
      setResults(prev => ({ 
        ...prev, 
        getWorkersProxy: { 
          success: false, 
          error: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText
        } 
      }));
      toast.error(`GetWorkers with proxy failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetWorkersWithFetch = async () => {
    setLoading(true);
    try {
      console.log('Testing GetWorkers with Fetch API...');
      
      const response = await fetch(`${BACKEND_URL}/GetWorkers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('GetWorkers with Fetch successful:', data);
      setResults(prev => ({ ...prev, getWorkersFetch: { success: true, data } }));
      toast.success('GetWorkers with Fetch successful!');
      
    } catch (error) {
      console.error('GetWorkers with Fetch failed:', error);
      setResults(prev => ({ 
        ...prev, 
        getWorkersFetch: { 
          success: false, 
          error: error.message
        } 
      }));
      toast.error(`GetWorkers with Fetch failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <Toaster position="top-center" />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">اختبار الاتصال بالخادم</h1>
        
        <div className="grid gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">اختبارات الاتصال</h2>
            
            <div className="grid gap-4">
              <button
                onClick={testDirectRequest}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'جاري الاختبار...' : 'اختبار الاتصال المباشر'}
              </button>
              
              <button
                onClick={testGetWorkers}
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'جاري الاختبار...' : 'اختبار GetWorkers'}
              </button>
              
              <button
                onClick={testGetWorkersWithProxy}
                disabled={loading}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'جاري الاختبار...' : 'اختبار GetWorkers مع CORS Proxy'}
              </button>
              
              <button
                onClick={testGetWorkersWithFetch}
                disabled={loading}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'جاري الاختبار...' : 'اختبار GetWorkers مع Fetch API'}
              </button>
              
              <button
                onClick={testCorsProxy}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'جاري الاختبار...' : 'اختبار CORS Proxy'}
              </button>
              
              <button
                onClick={testFetchAPI}
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'جاري الاختبار...' : 'اختبار Fetch API'}
              </button>
              
              <button
                onClick={testBackendHealth}
                disabled={loading}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'جاري الاختبار...' : 'فحص صحة الخادم'}
              </button>
              
              <button
                onClick={testInBrowserConsole}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                نسخ كود اختبار المتصفح
              </button>
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="space-y-6">
          {Object.entries(results).map(([testName, result]) => (
            <div key={testName} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 capitalize">
                {testName === 'direct' && 'النتيجة: الاتصال المباشر'}
                {testName === 'corsProxy' && 'النتيجة: CORS Proxy'}
                {testName === 'fetch' && 'النتيجة: Fetch API'}
                {testName === 'health' && 'النتيجة: فحص الصحة'}
                {testName === 'getWorkers' && 'النتيجة: GetWorkers'}
                {testName === 'getWorkersProxy' && 'النتيجة: GetWorkers with CORS proxy'}
                {testName === 'getWorkersFetch' && 'النتيجة: GetWorkers with Fetch API'}
              </h3>
              
              {result.success ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">✅ نجح الاختبار!</p>
                  <pre className="mt-2 text-sm text-green-700 bg-green-100 p-2 rounded overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">❌ فشل الاختبار</p>
                  <p className="text-red-700 mt-1">الخطأ: {result.error}</p>
                  
                  {result.details && (
                    <div className="mt-3 space-y-2">
                      {result.details.corsIssue && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                          <p className="text-yellow-800 font-medium">🔒 مشكلة CORS</p>
                          <p className="text-yellow-700 text-sm mt-1">{result.details.explanation}</p>
                          <p className="text-yellow-700 text-sm mt-1"><strong>الحل:</strong> {result.details.solution}</p>
                        </div>
                      )}
                      
                      <div className="text-sm text-red-600">
                        <p><strong>Code:</strong> {result.details.code || 'N/A'}</p>
                        {result.details.status && (
                          <p><strong>Status:</strong> {result.details.status} {result.details.statusText}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">تعليمات</h3>
          <ul className="text-blue-800 space-y-2">
            <li>• <strong>الاتصال المباشر:</strong> اختبار الاتصال المباشر بالخادم</li>
            <li>• <strong>CORS Proxy:</strong> اختبار الاتصال عبر خادم وسيط لحل مشكلة CORS</li>
            <li>• <strong>Fetch API:</strong> اختبار باستخدام Fetch API بدلاً من Axios</li>
            <li>• <strong>فحص الصحة:</strong> التحقق من أن الخادم يعمل بشكل صحيح</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminTest; 