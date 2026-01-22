/**
 * Toast Notification Utility
 * Wrapper around react-hot-toast with custom styling
 */

import toast, { Toast, ToastOptions } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

// Default toast options
const defaultOptions: ToastOptions = {
  duration: 3000,
  position: 'top-right',
  style: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '0.75rem',
    color: '#f8fafc',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    padding: '12px 16px',
  },
};

/**
 * Success toast
 */
export const showSuccess = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    ...defaultOptions,
    ...options,
    icon: '✓',
    style: {
      ...defaultOptions.style,
      border: '1px solid rgba(34, 197, 94, 0.3)',
      ...options?.style,
    },
  });
};

/**
 * Error toast
 */
export const showError = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    ...defaultOptions,
    ...options,
    icon: '✕',
    style: {
      ...defaultOptions.style,
      border: '1px solid rgba(239, 68, 68, 0.3)',
      ...options?.style,
    },
  });
};

/**
 * Warning toast
 */
export const showWarning = (message: string, options?: ToastOptions) => {
  return toast(message, {
    ...defaultOptions,
    ...options,
    icon: '⚠',
    style: {
      ...defaultOptions.style,
      border: '1px solid rgba(234, 179, 8, 0.3)',
      ...options?.style,
    },
  });
};

/**
 * Info toast
 */
export const showInfo = (message: string, options?: ToastOptions) => {
  return toast(message, {
    ...defaultOptions,
    ...options,
    icon: 'ℹ',
    style: {
      ...defaultOptions.style,
      border: '1px solid rgba(59, 130, 246, 0.3)',
      ...options?.style,
    },
  });
};

/**
 * Loading toast with promise
 */
export const showLoading = (message: string) => {
  return toast.loading(message, {
    ...defaultOptions,
    duration: Infinity,
  });
};

/**
 * Update existing toast
 */
export const updateToast = (toastId: string, type: 'success' | 'error', message: string) => {
  if (type === 'success') {
    toast.success(message, { id: toastId });
  } else {
    toast.error(message, { id: toastId });
  }
};

/**
 * Promise toast - automatically handles loading, success, and error states
 */
export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  },
  options?: ToastOptions
) => {
  return toast.promise(
    promise,
    messages,
    {
      ...defaultOptions,
      ...options,
      style: {
        ...defaultOptions.style,
        ...options?.style,
      },
    }
  );
};

/**
 * Dismiss toast
 */
export const dismissToast = (toastId?: string) => {
  toast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Export default toast for custom usage
export default toast;
