import React from 'react';
import ErrorPage from './ErrorPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Create a custom error object for the ErrorPage
      const customError = {
        message: this.state.error?.message || 'Something went wrong',
        status: 500,
        stack: this.state.error?.stack,
        errorInfo: this.state.errorInfo
      };

      return <ErrorPage error={customError} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 