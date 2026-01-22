/**
 * Confirm Component
 * Replacement for browser confirm() with better UX
 */

import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  loading?: boolean;
}

const Confirm: React.FC<ConfirmProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'Onay',
  message,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  danger = false,
  loading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="sm" showClose={false}>
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icon */}
        <div
          className={cn(
            'p-3 rounded-full bg-white/10',
            danger ? 'text-red-400' : 'text-yellow-400'
          )}
        >
          <AlertTriangle size={32} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white">{title}</h3>

        {/* Message */}
        <p className="text-gray-300">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 w-full pt-4">
          <Button variant="secondary" fullWidth onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            fullWidth
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Confirm;
