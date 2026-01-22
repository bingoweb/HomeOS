/**
 * Alert Component
 * Replacement for browser alert() with better UX
 */

import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: AlertType;
  confirmText?: string;
}

const Alert: React.FC<AlertProps> = ({
  open,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = 'Tamam',
}) => {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
  };

  const colors = {
    info: 'text-blue-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
  };

  const Icon = icons[type];

  return (
    <Modal open={open} onClose={onClose} size="sm" showClose={false}>
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icon */}
        <div className={cn('p-3 rounded-full bg-white/10', colors[type])}>
          <Icon size={32} />
        </div>

        {/* Title */}
        {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}

        {/* Message */}
        <p className="text-gray-300">{message}</p>

        {/* Actions */}
        <div className="w-full pt-4">
          <Button variant="primary" fullWidth onClick={onClose}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Alert;
