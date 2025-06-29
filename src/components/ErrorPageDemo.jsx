import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ErrorPage, { 
  NotFoundPage, 
  ServerErrorPage, 
  NetworkErrorPage, 
  UnauthorizedPage, 
  ForbiddenPage, 
  TimeoutErrorPage 
} from './ErrorPage';

const ErrorPageDemo = () => {
  const [currentError, setCurrentError] = useState(null);

  const errorTypes = [
    {
      id: '404',
      name: '404 - الصفحة غير موجودة',
      component: <NotFoundPage />
    },
    {
      id: '500',
      name: '500 - خطأ في الخادم',
      component: <ServerErrorPage />
    },
    {
      id: 'network',
      name: 'خطأ في الاتصال',
      component: <NetworkErrorPage />
    },
    {
      id: '401',
      name: '401 - غير مصرح',
      component: <UnauthorizedPage />
    },
    {
      id: '403',
      name: '403 - ممنوع الوصول',
      component: <ForbiddenPage />
    },
    {
      id: 'timeout',
      name: 'انتهت مهلة الاتصال',
      component: <TimeoutErrorPage />
    },
    {
      id: 'custom',
      name: 'خطأ مخصص',
      component: (
        <ErrorPage
          errorCode="CUSTOM"
          title="خطأ مخصص"
          message="هذا مثال على صفحة خطأ مخصصة مع رسالة وأزرار مخصصة."
          customActions={
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentError(null)}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg"
              >
                العودة للقائمة
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-semibold shadow-lg"
              >
                تحديث الصفحة
              </motion.button>
            </>
          }
        />
      )
    }
  ];

  if (currentError) {
    return currentError;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
            صفحات الأخطاء - KRIXO
          </h1>
          <p className="text-blue-200 text-lg">
            اختر نوع الخطأ لعرض صفحة الخطأ المناسبة
          </p>
        </motion.div>

        {/* Error Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {errorTypes.map((errorType, index) => (
            <motion.div
              key={errorType.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentError(errorType.component)}
              className="bg-gradient-to-br from-blue-800/50 to-blue-900/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-600/30 cursor-pointer hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">
                  {errorType.id === '404' && '🔍'}
                  {errorType.id === '500' && '⚙️'}
                  {errorType.id === 'network' && '🌐'}
                  {errorType.id === '401' && '🔐'}
                  {errorType.id === '403' && '🚫'}
                  {errorType.id === 'timeout' && '⏰'}
                  {errorType.id === 'custom' && '🎨'}
                </div>
                <h3 className="text-lg font-semibold text-blue-200 mb-2">
                  {errorType.name}
                </h3>
                <p className="text-blue-300 text-sm">
                  انقر لعرض صفحة الخطأ
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-blue-800/30 to-blue-900/30 backdrop-blur-xl rounded-2xl p-6 border border-blue-600/20"
        >
          <h3 className="text-xl font-semibold text-blue-200 mb-4">كيفية الاستخدام:</h3>
          <div className="grid md:grid-cols-2 gap-6 text-blue-300">
            <div>
              <h4 className="font-semibold text-blue-200 mb-2">📝 الاستخدام الأساسي:</h4>
              <pre className="bg-blue-900/50 p-3 rounded-lg text-sm overflow-x-auto">
{`<ErrorPage
  errorCode="404"
  title="الصفحة غير موجودة"
  message="رسالة الخطأ هنا"
/>`}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold text-blue-200 mb-2">🎨 الاستخدام المتقدم:</h4>
              <pre className="bg-blue-900/50 p-3 rounded-lg text-sm overflow-x-auto">
{`<ErrorPage
  errorCode="custom"
  title="عنوان مخصص"
  message="رسالة مخصصة"
  customActions={<CustomButtons />}
/>`}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorPageDemo; 