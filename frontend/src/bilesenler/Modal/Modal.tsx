import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md', className }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Keyboard support (ESC to close) & Focus Trap
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
                return;
            }

            // Focus Trap
            if (e.key === 'Tab' && modalRef.current) {
                const focusableElements = modalRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );

                if (focusableElements.length === 0) return;

                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';

            // Focus on modal when opened (small delay to ensure render)
            setTimeout(() => {
                modalRef.current?.focus();
                // Or find the first focusable element
                const firstFocusable = modalRef.current?.querySelector(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                ) as HTMLElement;
                firstFocusable?.focus();
            }, 50);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    return createPortal(
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Content */}
            <div
                ref={modalRef}
                className={clsx(
                    "relative w-full rounded-xl bg-dark-800 border border-white/10 shadow-glass-lg transform transition-all animate-fade-in focus:outline-none",
                    sizeClasses[size],
                    className
                )}
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Kapat"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};
