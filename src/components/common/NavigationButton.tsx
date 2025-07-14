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
  const [isNavigating, setIsNavigating] = useState(false);
  
  const isPrev = direction === 'prev';
  const Icon = isPressed && !disabled 
    ? (isPrev ? IconPlayerTrackPrevFilled : IconPlayerTrackNextFilled)
    : (isPrev ? IconPlayerTrackPrev : IconPlayerTrackNext);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isNavigating) {
      // Set navigating state for visual feedback
      setIsNavigating(true);
      onClick();
      
      // Reset after a short delay (matches debounce period)
      setTimeout(() => {
        setIsNavigating(false);
      }, 150);
    }
  };
  
  const isDisabled = disabled || isNavigating;
  
  return (
    <motion.button
      type="button"
      onClick={handleClick}
      onPointerDown={() => !isDisabled && setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      disabled={isDisabled}
      whileHover={isDisabled ? {} : { scale: 1.1 }}
      whileTap={isDisabled ? {} : { scale: 0.95 }}
      className={clsx(
        'p-3 rounded-xl transition-all duration-200',
        'text-gray-300 hover:text-white relative',
        isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-700/50',
        isNavigating && 'animate-pulse',
        className
      )}
      title={isPrev ? "Previous" : "Next"}
      aria-label={isPrev ? "Previous" : "Next"}
    >
      <Icon size={size} />
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute inset-0 rounded-xl bg-blue-500/20"
        />
      )}
    </motion.button>
  );
}; 