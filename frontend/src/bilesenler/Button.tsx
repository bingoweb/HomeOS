/**
 * Button Component
 * Reusable button with multiple variants and sizes
 */

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2, LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  children?: ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed';

    // Variant styles
    const variantStyles: Record<ButtonVariant, string> = {
      primary: 'bg-primary-600 hover:bg-primary-500 text-white focus:ring-primary-500 shadow-lg shadow-primary-600/30',
      secondary: 'bg-white/10 hover:bg-white/20 text-white focus:ring-white/50 border border-white/20',
      danger: 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500 shadow-lg shadow-red-600/30',
      ghost: 'bg-transparent hover:bg-white/10 text-white focus:ring-white/50',
      link: 'bg-transparent hover:underline text-primary-400 focus:ring-primary-500 p-0',
      icon: 'bg-white/10 hover:bg-white/20 text-white focus:ring-white/50 aspect-square',
    };

    // Size styles
    const sizeStyles: Record<ButtonSize, string> = {
      sm: variant === 'icon' ? 'p-1.5 rounded-lg' : 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
      md: variant === 'icon' ? 'p-2 rounded-xl' : 'px-4 py-2 text-base rounded-xl gap-2',
      lg: variant === 'icon' ? 'p-3 rounded-xl' : 'px-6 py-3 text-lg rounded-xl gap-2.5',
    };

    // Icon size based on button size
    const iconSize: Record<ButtonSize, number> = {
      sm: 16,
      md: 20,
      lg: 24,
    };

    // Full width
    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          widthStyles,
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={iconSize[size]} />
        ) : (
          <>
            {LeftIcon && <LeftIcon size={iconSize[size]} />}
            {children}
            {RightIcon && <RightIcon size={iconSize[size]} />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
