import React, { useState } from 'react';
import { commandAPI, workerAPI, authAPI, testAPI } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const APITest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (name, testFunction) => {
    setLoading(true);
    try {
      const result = await testFunction();
      setTestResults(prev => ({
        ...prev,
        [name]: { success: true, data: result, error: null }
      }));
      toast.success(`${name} - نجح`);
    } catch (error) {
      console.error(`${name} test failed:`, error);
      setTestResults(prev => ({
        ...prev,
        [name]: { success: false, data: null, error: error.message }
      }));
      toast.error(`${name} - فشل: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const result = await testAPI.testConnection();
      setTestResults(prev => ({
        ...prev,
        'Connection': { success: true, data: result, error: null }
      }));
      toast.success('Connection - نجح');
    } catch (error) {
      console.error('Connection test failed:', error);
      setTestResults(prev => ({
        ...prev,
        'Connection': { success: false, data: null, error: error.message }
      }));
      toast.error(`Connection - فشل: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testCreateCommand = () => {
    const testData = {
      name: 'أحمد محمد',
      phone: '0659210265',
      services: ['ترحيل', 'ترتيب'],
      floor: 'الأول',
      itemType: 'أثاث منزلي',
      workers: 2,
      start: 'حي البدر، بشار',
      end: 'شارع النخيل، قنادسة',
      description: 'نقل أثاث منزل',
      price: 12000,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    return commandAPI.createCommand(testData);
  };

  const testGetCommands = () => {
    return commandAPI.getCommands();
  };

  const testCreateWorker = () => {
    const testData = {
      name: 'محمد الأمين',
      phone: '0555123456',
      email: 'mohamed@example.com',
      position: 'سائق',
      experience: 'خبرة 5 سنوات في النقل',
      message: 'أرغب في الانضمام لفريقكم',
      isAccepted: false,
      password: 'defaultPassword123!',
      createdAt: new Date().toISOString()
    };
    return workerAPI.createWorker(testData);
  };

  const testGetWorkers = () => {
    return workerAPI.getWorkers();
  };

  const testRegistration = () => {
    const testData = {
      email: 'test@example.com',
      password: 'password123'
    };
    return authAPI.register(testData);
  };

  const testGetAccount = () => {
    return authAPI.getAccount('1');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">اختبار API</h1>
        
        {/* Connection Test */}
        <div className="mb-8 text-center">
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-purple-500 text-white py-3 px-6 rounded-lg hover:bg-purple-600 disabled:opacity-50 text-lg font-semibold"
          >
            {loading ? 'جاري اختبار الاتصال...' : 'اختبار الاتصال بالخادم'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">إنشاء طلب</h3>
            <button
              onClick={() => testEndpoint('CreateCommand', testCreateCommand)}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'جاري الاختبار...' : 'اختبار /CreateCommand'}
            </button>
            {testResults.CreateCommand && (
              <div className={`mt-4 p-3 rounded ${testResults.CreateCommand.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-semibold">{testResults.CreateCommand.success ? 'نجح' : 'فشل'}</p>
                {testResults.CreateCommand.error && <p className="text-sm">{testResults.CreateCommand.error}</p>}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">جلب الطلبات</h3>
            <button
              onClick={() => testEndpoint('GetCommands', testGetCommands)}
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'جاري الاختبار...' : 'اختبار /GetCommands'}
            </button>
            {testResults.GetCommands && (
              <div className={`mt-4 p-3 rounded ${testResults.GetCommands.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-semibold">{testResults.GetCommands.success ? 'نجح' : 'فشل'}</p>
                {testResults.GetCommands.error && <p className="text-sm">{testResults.GetCommands.error}</p>}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">إنشاء عامل</h3>
            <button
              onClick={() => testEndpoint('CreateWorker', testCreateWorker)}
              disabled={loading}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? 'جاري الاختبار...' : 'اختبار /CreateWorker'}
            </button>
            {testResults.CreateWorker && (
              <div className={`mt-4 p-3 rounded ${testResults.CreateWorker.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-semibold">{testResults.CreateWorker.success ? 'نجح' : 'فشل'}</p>
                {testResults.CreateWorker.error && <p className="text-sm">{testResults.CreateWorker.error}</p>}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">جلب العمال</h3>
            <button
              onClick={() => testEndpoint('GetWorkers', testGetWorkers)}
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'جاري الاختبار...' : 'اختبار /GetWorkers'}
            </button>
            {testResults.GetWorkers && (
              <div className={`mt-4 p-3 rounded ${testResults.GetWorkers.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-semibold">{testResults.GetWorkers.success ? 'نجح' : 'فشل'}</p>
                {testResults.GetWorkers.error && <p className="text-sm">{testResults.GetWorkers.error}</p>}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">تسجيل مستخدم</h3>
            <button
              onClick={() => testEndpoint('Registration', testRegistration)}
              disabled={loading}
              className="w-full bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 disabled:opacity-50"
            >
              {loading ? 'جاري الاختبار...' : 'اختبار /Regestration'}
            </button>
            {testResults.Registration && (
              <div className={`mt-4 p-3 rounded ${testResults.Registration.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-semibold">{testResults.Registration.success ? 'نجح' : 'فشل'}</p>
                {testResults.Registration.error && <p className="text-sm">{testResults.Registration.error}</p>}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">جلب حساب</h3>
            <button
              onClick={() => testEndpoint('GetAccount', testGetAccount)}
              disabled={loading}
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 disabled:opacity-50"
            >
              {loading ? 'جاري الاختبار...' : 'اختبار /account/{id}'}
            </button>
            {testResults.GetAccount && (
              <div className={`mt-4 p-3 rounded ${testResults.GetAccount.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-semibold">{testResults.GetAccount.success ? 'نجح' : 'فشل'}</p>
                {testResults.GetAccount.error && <p className="text-sm">{testResults.GetAccount.error}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={async () => {
              await testConnection();
              await testEndpoint('CreateCommand', testCreateCommand);
              await testEndpoint('GetCommands', testGetCommands);
              await testEndpoint('CreateWorker', testCreateWorker);
              await testEndpoint('GetWorkers', testGetWorkers);
              await testEndpoint('Registration', testRegistration);
              await testEndpoint('GetAccount', testGetAccount);
            }}
            disabled={loading}
            className="bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 disabled:opacity-50 text-lg font-semibold"
          >
            {loading ? 'جاري اختبار جميع النقاط...' : 'اختبار جميع النقاط'}
          </button>
        </div>

        {/* Connection Status */}
        {testResults.Connection && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">حالة الاتصال</h3>
            <div className={`p-4 rounded ${testResults.Connection.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <p className="font-semibold">{testResults.Connection.success ? '✅ متصل بالخادم' : '❌ فشل الاتصال'}</p>
              {testResults.Connection.error && (
                <div className="mt-2">
                  <p className="text-sm font-semibold">تفاصيل الخطأ:</p>
                  <p className="text-sm">{testResults.Connection.error}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default APITest; 