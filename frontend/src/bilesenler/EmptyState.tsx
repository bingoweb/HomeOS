/**
 * EmptyState Component
 * Displays when there's no data to show
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import Button, { ButtonProps } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  } & Partial<ButtonProps>;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-4',
        className
      )}
    >
      {/* Icon */}
      {Icon && (
        <div className="mb-4 p-4 rounded-full bg-white/5">
          <Icon size={48} className="text-gray-500" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-gray-400 max-w-md mb-6">{description}</p>
      )}

      {/* Action Button */}
      {action && (
        <Button
          variant={action.variant || 'primary'}
          onClick={action.onClick}
          leftIcon={action.leftIcon}
          {...action}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
