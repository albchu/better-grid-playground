import React from 'react';
import { motion } from 'framer-motion';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon, 
  label, 
  onClick, 
  variant = 'default',
  disabled = false
}) => {
  const variantClasses = {
    default: 'hover:bg-gray-700/50',
    danger: 'hover:bg-red-500/30 hover:text-red-300'
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.1 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        p-3 rounded-xl transition-all duration-200
        text-gray-300 hover:text-white
        ${disabled ? 'opacity-40 cursor-not-allowed' : variantClasses[variant]}
      `}
      title={label}
      aria-label={label}
    >
      {icon}
    </motion.button>
  );
}; 