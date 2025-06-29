import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';

const ErrorPage = ({ 
  errorCode = '404', 
  title = 'الصفحة غير موجودة', 
  message = 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
  showHomeButton = true,
  showBackButton = true,
  customActions = null 
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getErrorIcon = () => {
    switch (errorCode) {
      case '404':
        return '🔍';
      case '500':
        return '⚙️';
      case '403':
        return '🚫';
      case '401':
        return '🔐';
      case 'network':
        return '🌐';
      case 'timeout':
        return '⏰';
      default:
        return '❌';
    }
  };

  const getErrorColor = () => {
    switch (errorCode) {
      case '404':
        return 'from-blue-500 to-blue-600';
      case '500':
        return 'from-red-500 to-red-600';
      case '403':
        return 'from-orange-500 to-orange-600';
      case '401':
        return 'from-yellow-500 to-yellow-600';
      case 'network':
        return 'from-purple-500 to-purple-600';
      case 'timeout':
        return 'from-indigo-500 to-indigo-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 flex items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl w-full"
      >
        {/* Main Error Card */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gradient-to-br from-blue-800/90 to-blue-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-600/50 overflow-hidden"
        >
          {/* Header */}
          <div className="text-center p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <img src={logo} alt="KRIXO" className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mb-6"
            >
              <div className={`text-8xl mb-4 ${getErrorColor()} bg-gradient-to-r bg-clip-text text-transparent font-bold`}>
                {getErrorIcon()}
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
                {errorCode}
              </h1>
              <h2 className="text-2xl font-semibold text-blue-200 mb-4">
                {title}
              </h2>
              <p className="text-blue-300 text-lg leading-relaxed max-w-md mx-auto">
                {message}
              </p>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="p-8 pt-0"
          >
            {customActions ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {customActions}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {showHomeButton && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGoHome}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    🏠 العودة للرئيسية
                  </motion.button>
                )}
                
                {showBackButton && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGoBack}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-3 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    ⬅️ العودة للخلف
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Additional Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="bg-gradient-to-r from-blue-800/50 to-blue-900/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-600/30">
            <h3 className="text-lg font-semibold text-blue-200 mb-3">هل تحتاج مساعدة؟</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-blue-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                تحقق من الرابط مرة أخرى
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                اتصال بالدعم الفني
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                تحديث الصفحة
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Specific Error Page Components
export const NotFoundPage = () => (
  <ErrorPage
    errorCode="404"
    title="الصفحة غير موجودة"
    message="عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر."
  />
);

export const ServerErrorPage = () => (
  <ErrorPage
    errorCode="500"
    title="خطأ في الخادم"
    message="عذراً، حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً."
  />
);

export const NetworkErrorPage = () => (
  <ErrorPage
    errorCode="network"
    title="خطأ في الاتصال"
    message="لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى."
  />
);

export const UnauthorizedPage = () => (
  <ErrorPage
    errorCode="401"
    title="غير مصرح"
    message="عذراً، لا تملك الصلاحيات للوصول إلى هذه الصفحة."
    showHomeButton={true}
    showBackButton={true}
  />
);

export const ForbiddenPage = () => (
  <ErrorPage
    errorCode="403"
    title="ممنوع الوصول"
    message="عذراً، الوصول إلى هذه الصفحة ممنوع."
    showHomeButton={true}
    showBackButton={true}
  />
);

export const TimeoutErrorPage = () => (
  <ErrorPage
    errorCode="timeout"
    title="انتهت مهلة الاتصال"
    message="انتهت مهلة الاتصال بالخادم. يرجى المحاولة مرة أخرى."
  />
);

export default ErrorPage; 