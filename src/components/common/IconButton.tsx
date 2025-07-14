import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const variantStyles = {
  default: 'hover:bg-gray-100 text-gray-700',
  primary: 'hover:bg-indigo-100 text-indigo-600',
  secondary: 'hover:bg-gray-200 text-gray-600',
  danger: 'hover:bg-red-100 text-red-600'
};

const sizeStyles = {
  sm: 'p-1',
  md: 'p-2',
  lg: 'p-3'
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  onClick,
  variant = 'default',
  size = 'md',
  disabled = false,
  className = ''
}) => {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'rounded-lg transition-all duration-200',
        variantStyles[variant],
        sizeStyles[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      title={label}
      aria-label={label}
    >
      {icon}
    </motion.button>
  );
}; 