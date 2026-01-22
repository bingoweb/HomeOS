/**
 * Axios Global Configuration
 * Centralized axios instance with interceptors
 */

import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { useKimlikDeposu } from '../depolar/kimlikDeposu';
import { showError } from './toast';

// Base URL from environment variable
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Automatically adds authentication token to requests
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from store
    const token = useKimlikDeposu.getState().token;

    // Add token to headers if exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles errors globally
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // Handle network errors
    if (!error.response) {
      showError('Bağlantı hatası. İnternet bağlantınızı kontrol edin.');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Handle specific error codes
    switch (status) {
      case 401:
        // Unauthorized - logout user
        showError('Oturumunuz sonlandı. Lütfen tekrar giriş yapın.');
        useKimlikDeposu.getState().cikisYap();
        window.location.href = '/giris';
        break;

      case 403:
        // Forbidden
        showError('Bu işlem için yetkiniz bulunmuyor.');
        break;

      case 404:
        // Not Found
        showError('İstenen kaynak bulunamadı.');
        break;

      case 429:
        // Too Many Requests
        showError('Çok fazla istek gönderdiniz. Lütfen biraz bekleyin.');
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        // Server errors
        showError('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
        break;

      default:
        // Generic error from API
        const errorMessage = (data as any)?.hata || (data as any)?.message || 'Bir hata oluştu';
        showError(errorMessage);
    }

    return Promise.reject(error);
  }
);

/**
 * Retry logic for failed requests
 * Retries request up to 3 times with exponential backoff
 */
const retryRequest = async (
  config: AxiosRequestConfig,
  retryCount: number = 0
): Promise<any> => {
  const maxRetries = 3;
  const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s

  try {
    return await axiosInstance(config);
  } catch (error) {
    if (retryCount >= maxRetries) {
      throw error;
    }

    // Only retry on network errors or 5xx errors
    const shouldRetry =
      !axios.isAxiosError(error) ||
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600);

    if (shouldRetry) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryRequest(config, retryCount + 1);
    }

    throw error;
  }
};

/**
 * Helper function to make request with retry
 */
export const axiosWithRetry = (config: AxiosRequestConfig) => {
  return retryRequest(config);
};

export default axiosInstance;
