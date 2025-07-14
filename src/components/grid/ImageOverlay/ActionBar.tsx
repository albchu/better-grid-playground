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
  // const [isPressed, setIsPressed] = useState(false);
  
  const isPrev = direction === 'prev';
  const Icon = isPrev ? IconPlayerTrackPrev : IconPlayerTrackNext;
    
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.1 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(`[NavButton] ${direction} button clicked, disabled: ${disabled}`);
        if (!disabled) {
          onClick();
        }
      }}
      // onPointerDown={() => !disabled && setIsPressed(true)}
      // onPointerUp={() => setIsPressed(false)}
      // onPointerLeave={() => setIsPressed(false)}
      disabled={disabled}
      className={`
        p-3 rounded-xl transition-all duration-200
        text-white/80 hover:text-white
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/20'}
      `}
      title={isPrev ? "Previous" : "Next"}
      aria-label={isPrev ? "Previous" : "Next"}
      type="button"
    >
      <Icon size={20} />
    </motion.button>
  );
};

export const ActionBar: React.FC<ActionBarProps> = React.memo(({ 
  frameData, 
  frames, 
  currentFrameId, 
  onFrameChange, 
  onClose 
}) => {
  // Remove the old state since it's now in NavButton
  // const [isPrevPressed, setIsPrevPressed] = useState(false);
  // const [isNextPressed, setIsNextPressed] = useState(false);
  
  // Find current frame index for navigation
  const currentIndex = frames.findIndex(f => f.id === currentFrameId);
  
  // Helper to find next/previous frame with image
  const findPrevFrameWithImage = (): FrameData | null => {
    console.log('[ActionBar] Finding previous frame from index:', currentIndex);
    for (let i = currentIndex - 1; i >= 0; i--) {
      console.log(`[ActionBar] Checking frame at index ${i}:`, {
        id: frames[i].id,
        hasImage: !!frames[i].imageDataUrl
      });
      if (frames[i].imageDataUrl) return frames[i];
    }
    return null;
  };
  
  const findNextFrameWithImage = (): FrameData | null => {
    console.log('[ActionBar] Finding next frame from index:', currentIndex);
    for (let i = currentIndex + 1; i < frames.length; i++) {
      console.log(`[ActionBar] Checking frame at index ${i}:`, {
        id: frames[i].id,
        hasImage: !!frames[i].imageDataUrl
      });
      if (frames[i].imageDataUrl) return frames[i];
    }
    return null;
  };
  
  const prevFrame = findPrevFrameWithImage();
  const nextFrame = findNextFrameWithImage();
  const hasPrevious = !!prevFrame;
  const hasNext = !!nextFrame;
  const hasMultipleFrames = frames.filter(f => f.imageDataUrl).length > 1;

  // Debug logging
  console.log('[ActionBar] Navigation state:', {
    currentFrameId,
    currentIndex,
    totalFrames: frames.length,
    hasPrevious,
    hasNext,
    prevFrameId: prevFrame?.id,
    nextFrameId: nextFrame?.id
  });

  const handlePrevious = () => {
    console.log('[ActionBar] handlePrevious called');
    if (prevFrame) {
      console.log('[ActionBar] Navigating to previous frame:', { 
        from: currentFrameId,
        to: prevFrame.id
      });
      onFrameChange(prevFrame.id);
    } else {
      console.log('[ActionBar] No previous frame available');
    }
  };

  const handleNext = () => {
    console.log('[ActionBar] handleNext called');
    if (nextFrame) {
      console.log('[ActionBar] Navigating to next frame:', { 
        from: currentFrameId,
        to: nextFrame.id
      });
      onFrameChange(nextFrame.id);
    } else {
      console.log('[ActionBar] No next frame available');
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
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: 0.1,
        exit: { delay: 0, duration: 0.2 }
      }}
      className="
        absolute right-6 top-1/2 -translate-y-1/2 z-20
        bg-white/10 backdrop-blur-lg rounded-2xl
        border border-white/20 shadow-2xl
        p-2 flex flex-col gap-1
      "
    >
      {hasMultipleFrames && (
        <>
          <button
            onClick={() => {
              console.log('[TEST] Simple button clicked!');
              console.log('[TEST] Current state:', { hasPrevious, hasNext, currentFrameId });
            }}
            className="p-3 bg-white/20 rounded text-white"
          >
            TEST
          </button>
          
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
          
          <div className="h-px bg-white/20 my-1" />
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
      
      <div className="h-px bg-white/20 my-1" />
      
      <ActionButton
        icon={<IconTrash size={20} />}
        label="Delete"
        onClick={handleDelete}
        variant="danger"
      />
    </motion.div>
  );
}); 