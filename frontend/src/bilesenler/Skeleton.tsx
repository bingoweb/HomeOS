/**
 * Skeleton Component
 * Loading placeholder with pulse animation
 */

import React from 'react';
import { cn } from '../lib/utils';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className,
}) => {
  const variantStyles: Record<SkeletonVariant, string> = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'circular' ? width : undefined),
  };

  return (
    <div
      className={cn(
        'bg-white/10 animate-pulse',
        variantStyles[variant],
        className
      )}
      style={style}
      aria-label="Yükleniyor"
    />
  );
};

// Preset skeleton components
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className,
}) => {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('glass-card p-6 space-y-4', className)}>
      <Skeleton variant="text" width="60%" />
      <SkeletonText lines={3} />
    </div>
  );
};

export default Skeleton;
