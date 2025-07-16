import React from 'react';
import clsx from 'clsx';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  className?: string;
}

export const ActionButton = ({ 
  icon, 
  label, 
  onClick, 
  variant = 'default',
  disabled = false,
  className = ''
}: ActionButtonProps) => {
  const variantClasses = {
    default: 'hover:bg-gray-700/50 active:text-indigo-400',
    danger: 'hover:bg-red-500/30 hover:text-red-300 active:text-red-400'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "action-button p-3 rounded-xl transition-all duration-200",
        "text-gray-300 hover:text-white relative",
        disabled ? "opacity-40 cursor-not-allowed" : variantClasses[variant],
        className
      )}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  );
}; 