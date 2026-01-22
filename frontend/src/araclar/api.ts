import axios from 'axios';
import toast from 'react-hot-toast';
import axiosRetry from 'axios-retry';
import { useKimlikDeposu } from '../depolar/kimlikDeposu';

// ============================================
// AXIOS INSTANCE
// ============================================

export const api = axios.create({
    baseURL: (import.meta as any).env.VITE_API_URL || '/api',
    timeout: 30000, // 30s
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============================================
// RETRY LOGIC
// ============================================

axiosRetry(api, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        // Sadece network hataları veya 5xx hatalarında tekrar dene
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response?.status ? error.response.status >= 500 : false);
    },
    onRetry: (retryCount, _error, requestConfig) => {
        console.warn(`İstek tekrar deneniyor (${retryCount}/3):`, requestConfig.url);
    }
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================

api.interceptors.request.use(
    (config) => {
        const token = useKimlikDeposu.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // 401 Unauthorized handling
        if (error.response?.status === 401) {
             useKimlikDeposu.getState().cikisYap();
             toast.error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
        }

        // Genel hata mesajı
        const errorMessage = error.response?.data?.mesaj || error.response?.data?.message || 'Bir hata oluştu.';

        // Hata toast'ı göster (eğer özel bir handling yoksa)
        if (!originalRequest._skipErrorHandler) {
             // Timeout hataları için özel mesaj
             if (error.code === 'ECONNABORTED') {
                 toast.error('İstek zaman aşımına uğradı.');
             } else {
                 toast.error(errorMessage);
             }
        }

        return Promise.reject(error);
    }
);
