import React from 'react';
import { motion } from 'framer-motion';
import { IconX } from '@tabler/icons-react';
import clsx from 'clsx';

interface CloseButtonProps {
  onClick: () => void;
  size?: number;
  className?: string;
  variant?: 'light' | 'dark';
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  onClick,
  size = 24,
  className = '',
  variant = 'light'
}) => {
  const variantStyles = {
    light: 'bg-white bg-opacity-10 hover:bg-opacity-20 text-white',
    dark: 'bg-black bg-opacity-10 hover:bg-opacity-20 text-gray-800'
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={clsx(
        'p-2 rounded-lg backdrop-blur-md transition-all duration-200',
        variantStyles[variant],
        className
      )}
      title="Close (Esc)"
      aria-label="Close"
    >
      <IconX size={size} />
    </motion.button>
  );
}; 