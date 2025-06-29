// Error handling utility functions

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  SERVER: 'SERVER',
  CLIENT: 'CLIENT',
  UNKNOWN: 'UNKNOWN'
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

// Parse error and return structured error object
export const parseError = (error) => {
  let errorType = ERROR_TYPES.UNKNOWN;
  let severity = ERROR_SEVERITY.MEDIUM;
  let userMessage = 'حدث خطأ غير متوقع';
  let technicalMessage = error?.message || 'Unknown error';

  // Network errors
  if (error?.code === 'ERR_NETWORK' || 
      error?.message?.includes('Network Error') ||
      error?.message?.includes('CORS')) {
    errorType = ERROR_TYPES.NETWORK;
    severity = ERROR_SEVERITY.HIGH;
    userMessage = 'خطأ في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت';
  }

  // Validation errors
  if (error?.response?.status === 400) {
    errorType = ERROR_TYPES.VALIDATION;
    severity = ERROR_SEVERITY.LOW;
    userMessage = 'بيانات غير صحيحة. يرجى التحقق من المدخلات';
  }

  // Authentication errors
  if (error?.response?.status === 401) {
    errorType = ERROR_TYPES.AUTHENTICATION;
    severity = ERROR_SEVERITY.MEDIUM;
    userMessage = 'يجب تسجيل الدخول للوصول لهذه الصفحة';
  }

  // Authorization errors
  if (error?.response?.status === 403) {
    errorType = ERROR_TYPES.AUTHORIZATION;
    severity = ERROR_SEVERITY.MEDIUM;
    userMessage = 'ليس لديك صلاحية للوصول لهذا المحتوى';
  }

  // Server errors
  if (error?.response?.status >= 500) {
    errorType = ERROR_TYPES.SERVER;
    severity = ERROR_SEVERITY.HIGH;
    userMessage = 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً';
  }

  // Client errors (4xx)
  if (error?.response?.status >= 400 && error?.response?.status < 500) {
    errorType = ERROR_TYPES.CLIENT;
    severity = ERROR_SEVERITY.MEDIUM;
    userMessage = 'خطأ في الطلب. يرجى المحاولة مرة أخرى';
  }

  return {
    type: errorType,
    severity,
    userMessage,
    technicalMessage,
    status: error?.response?.status,
    originalError: error,
    timestamp: new Date().toISOString()
  };
};

// Log error to console (and potentially to external service)
export const logError = (error, context = '') => {
  const parsedError = parseError(error);
  
  console.group(`🚨 Error: ${parsedError.type} (${context})`);
  console.error('User Message:', parsedError.userMessage);
  console.error('Technical Message:', parsedError.technicalMessage);
  console.error('Status:', parsedError.status);
  console.error('Original Error:', parsedError.originalError);
  console.error('Timestamp:', parsedError.timestamp);
  console.groupEnd();

  // In production, you might want to send this to an error tracking service
  // like Sentry, LogRocket, etc.
  if (process.env.NODE_ENV === 'production') {
    // sendToErrorTrackingService(parsedError);
  }

  return parsedError;
};

// Handle API errors specifically
export const handleApiError = (error, context = 'API Call') => {
  const parsedError = logError(error, context);
  
  // Return user-friendly message for UI
  return parsedError.userMessage;
};

// Create error object for ErrorPage
export const createErrorForPage = (error, status = 500) => {
  const parsedError = parseError(error);
  
  return {
    status: status || parsedError.status || 500,
    message: parsedError.userMessage,
    technicalMessage: parsedError.technicalMessage,
    type: parsedError.type,
    timestamp: parsedError.timestamp
  };
};

// Check if error is retryable
export const isRetryableError = (error) => {
  const parsedError = parseError(error);
  
  // Network errors and server errors are usually retryable
  return parsedError.type === ERROR_TYPES.NETWORK || 
         parsedError.type === ERROR_TYPES.SERVER;
};

// Get retry delay based on error type
export const getRetryDelay = (error, attempt = 1) => {
  const parsedError = parseError(error);
  
  if (parsedError.type === ERROR_TYPES.NETWORK) {
    // Exponential backoff for network errors
    return Math.min(1000 * Math.pow(2, attempt - 1), 10000);
  }
  
  if (parsedError.type === ERROR_TYPES.SERVER) {
    // Linear backoff for server errors
    return Math.min(2000 * attempt, 10000);
  }
  
  return 1000; // Default 1 second
}; 