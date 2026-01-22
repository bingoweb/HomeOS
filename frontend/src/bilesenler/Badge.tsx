/**
 * Badge Component
 * Status indicators, counts, and labels
 */

import React, { HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'default';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pulse?: boolean;
  children?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  children,
  className,
  ...props
}) => {
  // Variant styles
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    default: 'bg-white/10 text-gray-300 border-white/20',
  };

  // Size styles
  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  // Dot variant
  if (dot) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center w-2 h-2 rounded-full',
          variantStyles[variant].split(' ')[0], // bg color only
          pulse && 'animate-pulse',
          className
        )}
        {...props}
      />
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full border',
        variantStyles[variant],
        sizeStyles[size],
        pulse && 'animate-pulse',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// Count badge (for notifications)
export const CountBadge: React.FC<{
  count: number;
  max?: number;
  variant?: BadgeVariant;
  className?: string;
}> = ({ count, max = 99, variant = 'error', className }) => {
  const displayCount = count > max ? `${max}+` : count;

  if (count === 0) return null;

  return (
    <Badge
      variant={variant}
      size="sm"
      className={cn('min-w-[20px] h-5 px-1.5', className)}
    >
      {displayCount}
    </Badge>
  );
};

// Status badge (for container status)
export const StatusBadge: React.FC<{
  status: 'running' | 'stopped' | 'paused' | 'restarting';
  className?: string;
}> = ({ status, className }) => {
  const statusConfig = {
    running: { variant: 'success' as BadgeVariant, label: 'Çalışıyor', pulse: true },
    stopped: { variant: 'error' as BadgeVariant, label: 'Durduruldu', pulse: false },
    paused: { variant: 'warning' as BadgeVariant, label: 'Duraklatıldı', pulse: false },
    restarting: { variant: 'info' as BadgeVariant, label: 'Yeniden Başlatılıyor', pulse: true },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      size="sm"
      pulse={config.pulse}
      className={className}
    >
      <span className="flex items-center gap-1.5">
        <Badge dot variant={config.variant} pulse={config.pulse} />
        {config.label}
      </span>
    </Badge>
  );
};

export default Badge;
