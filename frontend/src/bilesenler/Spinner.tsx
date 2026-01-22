/**
 * Spinner Component
 * Loading spinner indicator
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  const sizeStyles: Record<SpinnerSize, number> = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  return (
    <Loader2
      size={sizeStyles[size]}
      className={cn('animate-spin text-primary-500', className)}
      aria-label="Yükleniyor"
    />
  );
};

export default Spinner;
