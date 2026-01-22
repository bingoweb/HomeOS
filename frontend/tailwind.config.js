/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Font Family
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            },

            // Colors
            colors: {
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                dark: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                }
            },

            // Spacing - 8-point grid system (base already exists, adding custom)
            spacing: {
                '18': '4.5rem',   // 72px
                '88': '22rem',    // 352px
                '128': '32rem',   // 512px
            },

            // Z-index Scale
            zIndex: {
                'dropdown': '1000',
                'sticky': '1020',
                'fixed': '1030',
                'modal-backdrop': '1040',
                'modal': '1050',
                'popover': '1060',
                'tooltip': '1070',
                'toast': '1080',
            },

            // Box Shadow - Glass variants
            boxShadow: {
                'glass-sm': '0 2px 8px 0 rgba(0, 0, 0, 0.2)',
                'glass': '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
                'glass-md': '0 8px 24px 0 rgba(0, 0, 0, 0.3)',
                'glass-lg': '0 12px 32px 0 rgba(0, 0, 0, 0.35)',
                'glass-xl': '0 16px 48px 0 rgba(0, 0, 0, 0.4)',
                'glow-primary': '0 0 20px rgba(99, 102, 241, 0.5)',
                'glow-success': '0 0 20px rgba(34, 197, 94, 0.5)',
                'glow-danger': '0 0 20px rgba(239, 68, 68, 0.5)',
            },

            // Backdrop Blur
            backdropBlur: {
                xs: '2px',
            },

            // Border Radius
            borderRadius: {
                '4xl': '2rem',
            },

            // Animation
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'slide-left': 'slideLeft 0.3s ease-out',
                'slide-right': 'slideRight 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'spin-slow': 'spin 3s linear infinite',
            },

            // Keyframes
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideLeft: {
                    '0%': { transform: 'translateX(10px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideRight: {
                    '0%': { transform: 'translateX(-10px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },

            // Transitions
            transitionDuration: {
                '400': '400ms',
            },
        },
    },
    plugins: [],
}
