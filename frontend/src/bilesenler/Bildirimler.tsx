import { Toaster as HotToaster } from 'react-hot-toast';

export const Bildirimler = () => {
    return (
        <HotToaster
            position="top-right"
            toastOptions={{
                duration: 3000,
                style: {
                    background: 'rgba(30, 41, 59, 0.8)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    maxWidth: '400px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
                success: {
                    iconTheme: {
                        primary: '#22c55e',
                        secondary: '#fff',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                    },
                },
            }}
        />
    );
};
