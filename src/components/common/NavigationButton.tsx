import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IconPlayerTrackPrev, 
  IconPlayerTrackNext,
  IconPlayerTrackPrevFilled,
  IconPlayerTrackNextFilled 
} from '@tabler/icons-react';
import clsx from 'clsx';

interface NavigationButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
  size?: number;
  className?: string;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  direction,
  onClick,
  disabled = false,
  size = 20,
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const isPrev = direction === 'prev';
  const Icon = isPressed && !disabled 
    ? (isPrev ? IconPlayerTrackPrevFilled : IconPlayerTrackNextFilled)
    : (isPrev ? IconPlayerTrackPrev : IconPlayerTrackNext);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      onClick();
    }
  };
  
  return (
    <motion.button
      type="button"
      onClick={handleClick}
      onPointerDown={() => !disabled && setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.1 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={clsx(
        'p-3 rounded-xl transition-all duration-200',
        'text-gray-300 hover:text-white',
        disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-700/50',
        className
      )}
      title={isPrev ? "Previous" : "Next"}
      aria-label={isPrev ? "Previous" : "Next"}
    >
      <Icon size={size} />
    </motion.button>
  );
}; 