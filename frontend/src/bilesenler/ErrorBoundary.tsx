/**
 * ErrorBoundary Component
 * Catches React errors and displays fallback UI
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';
import Card from './Card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Log to error reporting service (Sentry, etc.)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      const isDevelopment = import.meta.env.DEV;

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card variant="glass" className="max-w-2xl w-full">
            <div className="text-center">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-full bg-red-500/20">
                  <AlertTriangle size={48} className="text-red-400" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-white mb-2">
                Bir Hata Oluştu
              </h1>

              {/* Description */}
              <p className="text-gray-400 mb-6">
                Üzgünüz, bir şeyler ters gitti. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
              </p>

              {/* Error Details (Development only) */}
              {isDevelopment && this.state.error && (
                <div className="mb-6 p-4 bg-dark-900 rounded-lg text-left overflow-auto max-h-60">
                  <p className="text-red-400 font-mono text-sm mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-gray-500 text-xs overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 justify-center">
                <Button
                  variant="secondary"
                  onClick={() => window.location.reload()}
                  leftIcon={RefreshCw}
                >
                  Sayfayı Yenile
                </Button>
                <Button
                  variant="primary"
                  onClick={this.handleReset}
                >
                  Tekrar Dene
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
