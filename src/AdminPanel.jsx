import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import logo from './assets/Logo.png';
import { getCommands, getWorkers } from './services/apiWithProxy';

const BACKEND_URL = 'https://gokrixo.onrender.com';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('commands');
  const [commands, setCommands] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [usingProxy] = useState(false);
  const [backendError, setBackendError] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setInitialLoading(false);
    }
  }, [isAuthenticated]);

  const checkBackendStatus = async () => {
    try {
      const response = await axios.get('https://gokrixo.onrender.com/health', { timeout: 5000 });
      console.log('✅ Backend is reachable:', response.data);
      return true;
    } catch (error) {
      console.log('❌ Backend is not reachable:', error.message);
      return false;
    }
  };

  const fetchData = async () => {
    setInitialLoading(true);
    try {
      console.log('🔄 Fetching data from admin panel...');
      
      // Add more detailed logging
      console.log('📋 About to fetch commands...');
      let commandsData = [];
      try {
        commandsData = await getCommands();
        console.log('✅ Commands fetched successfully:', commandsData);
        setBackendError(false);
      } catch (error) {
        console.error('❌ Failed to fetch commands:', error);
        console.error('❌ Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
          code: error.code
        });
        toast.error('فشل في تحميل الطلبات: ' + (error.message || 'خطأ غير معروف'));
        setBackendError(true);
      }
      
      console.log('👥 About to fetch workers...');
      let workersData = [];
      try {
        workersData = await getWorkers();
        console.log('✅ Workers fetched successfully:', workersData);
        setBackendError(false);
      } catch (error) {
        console.error('❌ Failed to fetch workers:', error);
        console.error('❌ Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
          code: error.code
        });
        toast.error('فشل في تحميل العمال: ' + (error.message || 'خطأ غير معروف'));
        setBackendError(true);
      }
      
      setCommands(commandsData || []);
      setWorkers(workersData || []);
      
      console.log('✅ Final data set - Commands:', commandsData?.length || 0, 'Workers:', workersData?.length || 0);
      
    } catch (error) {
      console.error('❌ Unexpected error in fetchData:', error);
      console.error('❌ Error stack:', error.stack);
      toast.error('فشل في تحميل البيانات: ' + (error.message || 'خطأ غير متوقع'));
      setBackendError(true);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'password') {
      setIsAuthenticated(true);
      toast.success('تم تسجيل الدخول بنجاح');
    } else {
      toast.error('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginForm({ username: '', password: '' });
    setBackendError(false);
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const handleRetryConnection = async () => {
    setBackendError(false);
    setInitialLoading(true);
    await fetchData();
  };

  // Show network error page if backend is not reachable
  if (backendError && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 flex items-center justify-center p-4" dir="rtl">
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#1e40af',
              color: '#f8fafc',
              border: '1px solid #3b82f6'
            }
          }}
        />
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-gradient-to-br from-blue-800/90 to-blue-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-600/50 overflow-hidden"
          >
            <div className="text-center p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <img src={logo} alt="KRIXO" className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mb-6"
              >
                <div className="text-8xl mb-4 bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent font-bold">
                  🌐
                </div>
                <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
                  خطأ في الاتصال
                </h1>
                <h2 className="text-2xl font-semibold text-blue-200 mb-4">
                  لا يمكن الاتصال بالخادم
                </h2>
                <p className="text-blue-300 text-lg leading-relaxed max-w-md mx-auto">
                  عذراً، لا يمكن الاتصال بالخادم في الوقت الحالي. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRetryConnection}
                  disabled={initialLoading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {initialLoading ? '🔄 جاري المحاولة...' : '🔄 إعادة المحاولة'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-3 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  ⬅️ العودة للخلف
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="bg-gradient-to-r from-blue-800/50 to-blue-900/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-600/30">
              <h3 className="text-lg font-semibold text-blue-200 mb-3">نصائح لحل المشكلة:</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-blue-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  تحقق من اتصال الإنترنت
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  انتظر قليلاً وحاول مرة أخرى
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  تواصل مع الدعم الفني
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // API call functions
  const approveCommand = async (commandId) => {
    setLoading(true);
    try {
      console.log('Approving command:', commandId);
      
      await axios.put(`${BACKEND_URL}/UpdateCommandStatus`, { 
        commandId, 
        status: 'approved' 
      });
      
      console.log('Command approval successful');
      
      // Update local state
      setCommands(prev => prev.map(cmd => 
        cmd.id === commandId ? { ...cmd, status: 'approved' } : cmd
      ));

      // Send approval email
      const command = commands.find(cmd => cmd.id === commandId);
      await sendCommandEmail(command, 'approved');
      
      toast.success('تم قبول الطلب وإرسال إيميل للعميل');
    } catch (error) {
      console.error('Error approving command:', error);
      toast.error(error.response?.data?.message || error.message || 'حدث خطأ أثناء قبول الطلب');
    } finally {
      setLoading(false);
    }
  };

  const rejectCommand = async (commandId) => {
    setLoading(true);
    try {
      console.log('Rejecting command:', commandId);
      
      await axios.put(`${BACKEND_URL}/UpdateCommandStatus`, { 
        commandId, 
        status: 'rejected' 
      });
      
      console.log('Command rejection successful');
      
      // Update local state
      setCommands(prev => prev.map(cmd => 
        cmd.id === commandId ? { ...cmd, status: 'rejected' } : cmd
      ));

      // Send rejection email
      const command = commands.find(cmd => cmd.id === commandId);
      await sendCommandEmail(command, 'rejected');
      
      toast.success('تم رفض الطلب وإرسال إيميل للعميل');
    } catch (error) {
      console.error('Error rejecting command:', error);
      toast.error(error.response?.data?.message || error.message || 'حدث خطأ أثناء رفض الطلب');
    } finally {
      setLoading(false);
    }
  };

  const approveWorker = async (workerId, password) => {
    setLoading(true);
    try {
      console.log('Approving worker:', workerId);
      
      await axios.put(`${BACKEND_URL}/UpdateWorkerStatus`, { 
        workerId, 
        status: 'approved', 
        password 
      });
      
      console.log('Worker approval successful');
      
      // Update local state
      setWorkers(prev => prev.map(worker => 
        worker.id === workerId ? { ...worker, isAccepted: true, password: password } : worker
      ));
      
      toast.success('تم قبول العامل بنجاح');
    } catch (error) {
      console.error('Error approving worker:', error);
      toast.error(error.response?.data?.message || error.message || 'حدث خطأ أثناء قبول العامل');
    } finally {
      setLoading(false);
    }
  };

  const rejectWorker = async (workerId) => {
    setLoading(true);
    try {
      console.log('Rejecting worker:', workerId);
      
      await axios.put(`${BACKEND_URL}/UpdateWorkerStatus`, { 
        workerId, 
        status: 'rejected' 
      });
      
      console.log('Worker rejection successful');
      
      // Update local state
      setWorkers(prev => prev.map(worker => 
        worker.id === workerId ? { ...worker, isAccepted: false } : worker
      ));
      
      toast.success('تم رفض العامل بنجاح');
    } catch (error) {
      console.error('Error rejecting worker:', error);
      toast.error(error.response?.data?.message || error.message || 'حدث خطأ أثناء رفض العامل');
    } finally {
      setLoading(false);
    }
  };

  const sendCommandEmail = async (command, status) => {
    try {
      const templateParams = {
        to_email: command.email,
        to_name: command.name,
        status: status === 'approved' ? 'مقبول' : 'مرفوض',
        service_details: Array.isArray(command.services) ? command.services.join(', ') : command.services,
        price: command.price,
        start_location: command.start,
        end_location: command.end
      };

      await emailjs.send(
        'service_krixo',
        status === 'approved' ? 'template_command_approved' : 'template_command_rejected',
        templateParams,
        'your_public_key'
      );

      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('فشل في إرسال الإيميل للعميل');
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 flex items-center justify-center p-4">
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#1e40af',
              color: '#f8fafc',
              border: '1px solid #3b82f6'
            }
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-blue-800/90 to-blue-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-blue-600/50"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <img src={logo} alt="KRIXO" className="w-20 h-20 mx-auto mb-6 drop-shadow-lg" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
              لوحة التحكم
            </h1>
            <p className="text-blue-200">تسجيل دخول المدير</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6" dir="rtl">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                اسم المستخدم
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 bg-blue-700/50 border border-blue-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder:text-blue-300 transition-all duration-200"
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 bg-blue-700/50 border border-blue-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder:text-blue-300 transition-all duration-200"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-yellow-500 text-white py-3 rounded-xl hover:from-blue-700 hover:to-yellow-600 transition-all duration-200 font-medium shadow-lg"
            >
              تسجيل الدخول
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700" dir="rtl">
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#1e40af',
            color: '#f8fafc',
            border: '1px solid #3b82f6'
          }
        }}
      />
      
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800/90 to-blue-900/90 backdrop-blur-xl border-b border-blue-600/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <img src={logo} alt="KRIXO" className="w-12 h-12 drop-shadow-lg" />
              <div>
                <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
                  لوحة التحكم - KRIXO
                </h1>
                <p className="text-blue-300 text-sm">إدارة الطلبات والعمال</p>
              </div>
              {usingProxy && (
                <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-medium border border-yellow-500/30">
                  خادم وسيط
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchData}
                disabled={initialLoading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 shadow-lg"
              >
                {initialLoading ? 'جاري التحميل...' : 'تحديث البيانات'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg"
              >
                تسجيل الخروج
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-gradient-to-r from-blue-800/50 to-blue-900/50 backdrop-blur-xl border-b border-blue-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 space-x-reverse">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('commands')}
              className={`py-4 px-6 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'commands'
                  ? 'border-blue-500 text-blue-300 bg-blue-500/10 rounded-t-lg'
                  : 'border-transparent text-blue-300 hover:text-blue-200 hover:bg-blue-700/30 rounded-t-lg'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>الطلبات</span>
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                  {commands.filter(cmd => cmd.status === 'pending').length}
                </span>
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('workers')}
              className={`py-4 px-6 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'workers'
                  ? 'border-yellow-500 text-yellow-300 bg-yellow-500/10 rounded-t-lg'
                  : 'border-transparent text-blue-300 hover:text-blue-200 hover:bg-blue-700/30 rounded-t-lg'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>طلبات التوظيف</span>
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                  {workers.filter(worker => worker.isAccepted === null).length}
                </span>
              </span>
            </motion.button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {initialLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-6"></div>
              <p className="text-blue-300 text-lg">جاري تحميل البيانات...</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'commands' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CommandsTab
                  commands={commands}
                  onApprove={approveCommand}
                  onReject={rejectCommand}
                  loading={loading}
                />
              </motion.div>
            )}
            {activeTab === 'workers' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <WorkersTab
                  workers={workers}
                  onApprove={approveWorker}
                  onReject={rejectWorker}
                  loading={loading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

// Commands Tab Component
const CommandsTab = ({ commands, onApprove, onReject, loading }) => {
  if (!commands || commands.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white mb-8">إدارة الطلبات</h2>
        <div className="bg-gradient-to-br from-blue-800/50 to-blue-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-12 border border-blue-600/50 text-center">
          <div className="text-blue-300 text-6xl mb-4">📋</div>
          <p className="text-blue-200 text-xl">لا توجد طلبات حالياً</p>
          <p className="text-blue-400 mt-2">ستظهر الطلبات الجديدة هنا عند وصولها</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">إدارة الطلبات</h2>
        <div className="flex items-center gap-4">
          <div className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-xl border border-blue-500/30">
            <span className="text-sm">إجمالي الطلبات: </span>
            <span className="font-bold">{commands.length}</span>
          </div>
          <div className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-xl border border-yellow-500/30">
            <span className="text-sm">في الانتظار: </span>
            <span className="font-bold">{commands.filter(cmd => cmd.status === 'pending').length}</span>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6">
        {commands.map((command, index) => (
          <motion.div
            key={command.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-blue-800/50 to-blue-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-blue-600/50 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{command.name}</h3>
                <div className="flex items-center gap-4 text-blue-300">
                  <span className="flex items-center gap-1">
                    <span>📞</span>
                    {command.phone}
                  </span>
                  {command.email && (
                    <span className="flex items-center gap-1">
                      <span>📧</span>
                      {command.email}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  command.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                  command.status === 'approved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                  'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {command.status === 'pending' ? '⏳ في الانتظار' :
                   command.status === 'approved' ? '✅ مقبول' : '❌ مرفوض'}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-700/30 rounded-xl p-4">
                <p className="text-sm text-blue-300 mb-2">الخدمات المطلوبة:</p>
                <p className="font-bold text-blue-200 text-lg">
                  {Array.isArray(command.services) ? command.services.join(', ') : command.services}
                </p>
              </div>
              <div className="bg-blue-700/30 rounded-xl p-4">
                <p className="text-sm text-blue-300 mb-2">السعر:</p>
                <p className="font-bold text-yellow-300 text-xl">{command.price} دج</p>
              </div>
              <div className="bg-blue-700/30 rounded-xl p-4">
                <p className="text-sm text-blue-300 mb-2">من:</p>
                <p className="font-bold text-white">{command.start}</p>
              </div>
              <div className="bg-blue-700/30 rounded-xl p-4">
                <p className="text-sm text-blue-300 mb-2">إلى:</p>
                <p className="font-bold text-white">{command.end}</p>
              </div>
            </div>

            {command.status === 'pending' && (
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onApprove(command.id)}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 shadow-lg flex items-center gap-2"
                >
                  {loading ? '⏳ جاري...' : '✅ قبول'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onReject(command.id)}
                  disabled={loading}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 shadow-lg flex items-center gap-2"
                >
                  {loading ? '⏳ جاري...' : '❌ رفض'}
                </motion.button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Workers Tab Component
const WorkersTab = ({ workers, onApprove, onReject, loading }) => {
  const [passwords, setPasswords] = useState({});

  const handleApprove = (workerId) => {
    const password = passwords[workerId];
    if (!password) {
      toast.error('يرجى إدخال كلمة مرور للعامل');
      return;
    }
    onApprove(workerId, password);
  };

  if (!workers || workers.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white mb-8">إدارة طلبات التوظيف</h2>
        <div className="bg-gradient-to-br from-blue-800/50 to-blue-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-12 border border-blue-600/50 text-center">
          <div className="text-blue-300 text-6xl mb-4">👥</div>
          <p className="text-blue-200 text-xl">لا توجد طلبات توظيف حالياً</p>
          <p className="text-blue-400 mt-2">ستظهر طلبات التوظيف الجديدة هنا عند وصولها</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">إدارة طلبات التوظيف</h2>
        <div className="flex items-center gap-4">
          <div className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-xl border border-yellow-500/30">
            <span className="text-sm">إجمالي الطلبات: </span>
            <span className="font-bold">{workers.length}</span>
          </div>
          <div className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-xl border border-yellow-500/30">
            <span className="text-sm">في الانتظار: </span>
            <span className="font-bold">{workers.filter(worker => worker.isAccepted === null).length}</span>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6">
        {workers.map((worker, index) => (
          <motion.div
            key={worker.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-blue-800/50 to-blue-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-blue-600/50 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{worker.name}</h3>
                <div className="flex items-center gap-4 text-blue-300">
                  <span className="flex items-center gap-1">
                    <span>📧</span>
                    {worker.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>📞</span>
                    {worker.phone}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  worker.isAccepted === null ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                  worker.isAccepted ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                  'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {worker.isAccepted === null ? '⏳ في الانتظار' :
                   worker.isAccepted ? '✅ مقبول' : '❌ مرفوض'}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-700/30 rounded-xl p-4">
                <p className="text-sm text-blue-300 mb-2">المنصب المطلوب:</p>
                <p className="font-bold text-yellow-300 text-lg">{worker.position}</p>
              </div>
              <div className="bg-blue-700/30 rounded-xl p-4">
                <p className="text-sm text-blue-300 mb-2">الخبرة:</p>
                <p className="font-bold text-white">{worker.experience}</p>
              </div>
            </div>

            {worker.message && (
              <div className="mb-6">
                <p className="text-sm text-blue-300 mb-2">الرسالة:</p>
                <div className="bg-blue-700/30 p-4 rounded-xl border border-blue-600/30">
                  <p className="text-white">{worker.message}</p>
                </div>
              </div>
            )}

            {worker.isAccepted === null && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">
                    كلمة مرور العامل (مطلوبة للقبول)
                  </label>
                  <input
                    type="password"
                    value={passwords[worker.id] || ''}
                    onChange={(e) => setPasswords(prev => ({ ...prev, [worker.id]: e.target.value }))}
                    className="w-full px-4 py-3 bg-blue-700/50 border border-blue-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder:text-blue-300 transition-all duration-200"
                    placeholder="أدخل كلمة مرور للعامل"
                  />
                </div>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleApprove(worker.id)}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 shadow-lg flex items-center gap-2"
                  >
                    {loading ? '⏳ جاري...' : '✅ قبول'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onReject(worker.id)}
                    disabled={loading}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 shadow-lg flex items-center gap-2"
                  >
                    {loading ? '⏳ جاري...' : '❌ رفض'}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;