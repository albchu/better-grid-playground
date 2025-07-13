import React from 'react';

export const Skeleton: React.FC = () => {
  return (
    <div className="w-full h-full bg-gray-200 animate-pulse">
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    </div>
  );
}; 