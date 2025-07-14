import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IconRotateClockwise,
  IconDeviceFloppy,
  IconTrash,
  IconEdit,
  IconPlayerTrackPrev,
  IconPlayerTrackNext,
  IconPlayerTrackPrevFilled,
  IconPlayerTrackNextFilled
} from '@tabler/icons-react';
import type { FrameData } from '../../../types';

interface ActionBarProps {
  frameData: FrameData;
  frames: FrameData[];
  currentFrameId: string;
  onFrameChange: (frameId: string) => void;
  onClose: () => void;
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon, 
  label, 
  onClick, 
  variant = 'default',
  disabled = false
}) => {
  const variantClasses = {
    default: 'hover:bg-white/20',
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
        text-white/80 hover:text-white
        ${disabled ? 'opacity-40 cursor-not-allowed' : variantClasses[variant]}
      `}
      title={label}
      aria-label={label}
    >
      {icon}
    </motion.button>
  );
};

interface NavButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ direction, onClick, disabled }) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const isPrev = direction === 'prev';
  const Icon = isPressed && !disabled 
    ? (isPrev ? IconPlayerTrackPrevFilled : IconPlayerTrackNextFilled)
    : (isPrev ? IconPlayerTrackPrev : IconPlayerTrackNext);
    
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`[NavButton] ${direction} button clicked, disabled: ${disabled}`);
    if (!disabled) {
      onClick();
    }
  };
    
  return (
    <button
      onClick={handleClick}
      onPointerDown={() => !disabled && setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      disabled={disabled}
      className={`
        p-3 rounded-xl transition-all duration-200
        text-white/80 hover:text-white hover:scale-110
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/20'}
      `}
      title={isPrev ? "Previous" : "Next"}
      aria-label={isPrev ? "Previous" : "Next"}
      type="button"
    >
      <Icon size={20} />
    </button>
  );
};

export const ActionBar: React.FC<ActionBarProps> = ({ 
  frameData, 
  frames, 
  currentFrameId, 
  onFrameChange, 
  onClose 
}) => {
  // Find current frame index for navigation
  const currentIndex = frames.findIndex(f => f.id === currentFrameId);
  
  console.log('[ActionBar] Rendering with:', {
    currentFrameId,
    currentIndex,
    framesCount: frames.length,
    framesWithImages: frames.filter(f => f.imageDataUrl).length
  });
  
  // Helper to find next/previous frame with image
  const findPrevFrameWithImage = (): FrameData | null => {
    if (currentIndex > 0) {
      return frames[currentIndex - 1];
    }
    return null;
  };
  
  const findNextFrameWithImage = (): FrameData | null => {
    if (currentIndex < frames.length - 1) {
      return frames[currentIndex + 1];
    }
    return null;
  };
  
  const prevFrame = findPrevFrameWithImage();
  const nextFrame = findNextFrameWithImage();
  const hasPrevious = !!prevFrame;
  const hasNext = !!nextFrame;
  const hasMultipleFrames = frames.filter(f => f.imageDataUrl).length > 1;

  const handlePrevious = () => {
    console.log('[ActionBar] Previous clicked', { 
      prevFrame, 
      currentIndex,
      currentFrameId,
      totalFrames: frames.length
    });
    if (prevFrame) {
      onFrameChange(prevFrame.id);
    }
  };

  const handleNext = () => {
    console.log('[ActionBar] Next clicked', { 
      nextFrame, 
      currentIndex,
      currentFrameId,
      totalFrames: frames.length,
      hasNext 
    });
    if (nextFrame) {
      onFrameChange(nextFrame.id);
    }
  };

  const handleRotate = () => {
    console.log('[ActionBar] Rotate clicked:', { id: frameData.id });
  };

  const handleSave = () => {
    console.log('[ActionBar] Save clicked:', { id: frameData.id });
  };

  const handleDelete = () => {
    console.log('[ActionBar] Delete clicked:', { id: frameData.id });
  };

  const handleRename = () => {
    console.log('[ActionBar] Rename clicked:', { id: frameData.id });
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: 0.1,
        exit: { delay: 0, duration: 0.2 }
      }}
      className="
        bg-white/10 backdrop-blur-lg rounded-2xl
        border border-white/20 shadow-2xl
        p-2 flex flex-row items-center gap-2
        pointer-events-auto
      "
      style={{ pointerEvents: 'auto' }}
    >
      {hasMultipleFrames && (
        <>
          <NavButton
            direction="prev"
            onClick={handlePrevious}
            disabled={!hasPrevious}
          />
          
          <NavButton
            direction="next"
            onClick={handleNext}
            disabled={!hasNext}
          />
          
          <div className="w-px h-8 bg-white/20 mx-1" />
        </>
      )}

      <ActionButton
        icon={<IconRotateClockwise size={20} />}
        label="Rotate"
        onClick={handleRotate}
      />
      
      <ActionButton
        icon={<IconDeviceFloppy size={20} />}
        label="Save"
        onClick={handleSave}
      />
      
      <ActionButton
        icon={<IconEdit size={20} />}
        label="Rename"
        onClick={handleRename}
      />
      
      <div className="w-px h-8 bg-white/20 mx-1" />
      
      <ActionButton
        icon={<IconTrash size={20} />}
        label="Delete"
        onClick={handleDelete}
        variant="danger"
      />
    </motion.div>
  );
}; 