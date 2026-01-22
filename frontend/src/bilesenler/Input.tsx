/**
 * Input Component
 * Form input with validation, icons, and states
 */

import React, { InputHTMLAttributes, useState, forwardRef } from 'react';
import { Eye, EyeOff, LucideIcon, X } from 'lucide-react';
import { cn } from '../lib/utils';

export type InputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
export type InputState = 'default' | 'error' | 'success';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  state?: InputState;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  showClear?: boolean;
  onClear?: () => void;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      helperText,
      errorText,
      state = 'default',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      showClear = false,
      onClear,
      disabled,
      className,
      containerClassName,
      value,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Determine actual input type
    const inputType = type === 'password' && showPassword ? 'text' : type;

    // Determine state (error takes precedence)
    const actualState = errorText ? 'error' : state;

    // State styles
    const stateStyles = {
      default: 'border-white/10 focus:border-primary-500/50',
      error: 'border-red-500/50 focus:border-red-500',
      success: 'border-green-500/50 focus:border-green-500',
    };

    // State colors for helper text
    const stateTextColors = {
      default: 'text-gray-400',
      error: 'text-red-400',
      success: 'text-green-400',
    };

    const handleClear = () => {
      if (onClear) {
        onClear();
      }
    };

    const hasValue = value !== undefined && value !== '';
    const showClearButton = showClear && hasValue && !disabled && type === 'search';

    return (
      <div className={cn('w-full', containerClassName)}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {LeftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <LeftIcon size={20} />
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            value={value}
            className={cn(
              'w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              stateStyles[actualState],
              LeftIcon && 'pl-12',
              (RightIcon || type === 'password' || showClearButton) && 'pr-12',
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* Right Icons */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Clear Button (for search) */}
            {showClearButton && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Temizle"
              >
                <X size={20} />
              </button>
            )}

            {/* Password Toggle */}
            {type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}

            {/* Right Icon */}
            {RightIcon && type !== 'password' && !showClearButton && (
              <div className="text-gray-400">
                <RightIcon size={20} />
              </div>
            )}
          </div>
        </div>

        {/* Helper Text / Error Text */}
        {(helperText || errorText) && (
          <p className={cn('text-sm mt-1.5', stateTextColors[actualState])}>
            {errorText || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
