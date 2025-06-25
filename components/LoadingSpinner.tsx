
import React from 'react';
import { BRANDING_INFO } from '../constants';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div 
        className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-t-transparent"
        style={{ borderColor: BRANDING_INFO.colors.primary, borderTopColor: 'transparent' }}
      ></div>
      <p style={{ color: BRANDING_INFO.colors.secondary }} className="text-lg">Analyzing Document...</p>
    </div>
  );
};

export default LoadingSpinner;
