import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface OnayModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export const OnayModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Onayla',
    cancelText = 'İptal',
    variant = 'danger',
    isLoading = false
}: OnayModalProps) => {

    const confirmButtonClasses = {
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" title={title}>
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    {variant === 'danger' && (
                        <div className="p-2 rounded-full bg-red-500/10 text-red-500 flex-shrink-0">
                            <AlertTriangle size={24} />
                        </div>
                    )}
                    <p className="text-gray-300 pt-1">{message}</p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={clsx(
                            "px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900",
                            confirmButtonClasses[variant],
                            isLoading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isLoading ? 'İşleniyor...' : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
