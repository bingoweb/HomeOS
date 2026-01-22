/**
 * Card Component
 * Reusable card container with variants
 */

import React, { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/utils';

export type CardVariant = 'glass' | 'solid' | 'bordered';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  hover?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'glass',
  padding = 'md',
  hover = false,
  header,
  footer,
  children,
  className,
  ...props
}) => {
  // Variant styles
  const variantStyles: Record<CardVariant, string> = {
    glass: 'glass-card',
    solid: 'bg-dark-800 border border-dark-700',
    bordered: 'bg-dark-900/50 border border-white/10',
  };

  // Padding styles
  const paddingStyles: Record<CardPadding, string> = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Hover styles
  const hoverStyles = hover
    ? 'transition-all duration-300 hover:scale-[1.02] hover:shadow-glass-lg cursor-pointer'
    : '';

  return (
    <div
      className={cn(
        'rounded-2xl',
        variantStyles[variant],
        paddingStyles[padding],
        hoverStyles,
        className
      )}
      {...props}
    >
      {/* Header */}
      {header && (
        <div className={cn('mb-4', padding === 'none' && 'px-6 pt-6')}>
          {header}
        </div>
      )}

      {/* Content */}
      <div className={padding === 'none' && (header || footer) ? 'px-6 py-4' : ''}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className={cn('mt-4 pt-4 border-t border-white/10', padding === 'none' && 'px-6 pb-6')}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
