import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
                style: {
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    padding: '12px 16px',
                },
            }}
        />
    </React.StrictMode>,
);
