/**
 * Loading Component
 * Full-page or inline loading overlay
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/utils';
import Spinner from './Spinner';

export interface LoadingProps {
  fullPage?: boolean;
  message?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  fullPage = false,
  message,
  className,
}) => {
  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        fullPage
          ? 'fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-modal'
          : 'absolute inset-0 bg-dark-950/60 backdrop-blur-sm rounded-2xl',
        className
      )}
    >
      <Spinner size="lg" />
      {message && (
        <p className="text-white text-lg mt-4 animate-pulse">{message}</p>
      )}
    </div>
  );

  if (fullPage) {
    return createPortal(content, document.body);
  }

  return content;
};

export default Loading;
