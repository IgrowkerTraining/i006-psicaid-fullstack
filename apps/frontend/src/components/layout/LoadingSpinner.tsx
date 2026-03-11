import { LoaderCircle } from 'lucide-react';
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white px-12 py-8 shadow-sm">
        <p className="text-base font-medium text-gray-800">{message}</p>
        <LoaderCircle className="size-8 text-gray-400 animate-spin" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
