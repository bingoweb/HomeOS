import { Modal } from './Modal';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface UyariModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    variant?: 'info' | 'success' | 'warning' | 'error';
    buttonText?: string;
}

export const UyariModal = ({
    isOpen,
    onClose,
    title,
    message,
    variant = 'info',
    buttonText = 'Tamam'
}: UyariModalProps) => {

    const icons = {
        info: <Info className="text-blue-500" size={24} />,
        success: <CheckCircle className="text-green-500" size={24} />,
        warning: <AlertTriangle className="text-yellow-500" size={24} />,
        error: <AlertCircle className="text-red-500" size={24} />,
    };

    const buttonVariants = {
        info: 'bg-blue-600 hover:bg-blue-700',
        success: 'bg-green-600 hover:bg-green-700',
        warning: 'bg-yellow-600 hover:bg-yellow-700',
        error: 'bg-red-600 hover:bg-red-700',
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" title={title}>
            <div className="flex flex-col items-center text-center gap-4 py-2">
                <div className="p-3 rounded-full bg-white/5 border border-white/10">
                    {icons[variant]}
                </div>
                <p className="text-gray-300">{message}</p>
                <div className="w-full mt-2">
                    <button
                        onClick={onClose}
                        className={clsx(
                            "w-full px-4 py-2 rounded-lg text-white font-medium transition-colors",
                            buttonVariants[variant]
                        )}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
