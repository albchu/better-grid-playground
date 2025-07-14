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

export const ActionBar: React.FC<ActionBarProps> = ({ 
  frameData, 
  frames, 
  currentFrameId, 
  onFrameChange, 
  onClose 
}) => {
  const [isPrevPressed, setIsPrevPressed] = useState(false);
  const [isNextPressed, setIsNextPressed] = useState(false);
  
  // Find current frame index for navigation
  const currentIndex = frames.findIndex(f => f.id === currentFrameId);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < frames.length - 1;
  const hasMultipleFrames = frames.length > 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      const prevFrame = frames[currentIndex - 1];
      onFrameChange(prevFrame.id);
      console.log('[ActionBar] Navigate to previous frame:', { id: prevFrame.id });
    }
  };

  const handleNext = () => {
    if (hasNext) {
      const nextFrame = frames[currentIndex + 1];
      onFrameChange(nextFrame.id);
      console.log('[ActionBar] Navigate to next frame:', { id: nextFrame.id });
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
          <motion.button
            whileHover={!hasPrevious ? {} : { scale: 1.1 }}
            whileTap={!hasPrevious ? {} : { scale: 0.95 }}
            onMouseDown={() => setIsPrevPressed(true)}
            onMouseUp={() => setIsPrevPressed(false)}
            onMouseLeave={() => setIsPrevPressed(false)}
            onClick={handlePrevious}
            disabled={!hasPrevious}
            className={`
              p-3 rounded-xl transition-all duration-200
              text-white/80 hover:text-white
              ${!hasPrevious ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/20'}
            `}
            title="Previous"
            aria-label="Previous"
          >
            {isPrevPressed && hasPrevious ? (
              <IconPlayerTrackPrevFilled size={20} />
            ) : (
              <IconPlayerTrackPrev size={20} />
            )}
          </motion.button>
          
          <motion.button
            whileHover={!hasNext ? {} : { scale: 1.1 }}
            whileTap={!hasNext ? {} : { scale: 0.95 }}
            onMouseDown={() => setIsNextPressed(true)}
            onMouseUp={() => setIsNextPressed(false)}
            onMouseLeave={() => setIsNextPressed(false)}
            onClick={handleNext}
            disabled={!hasNext}
            className={`
              p-3 rounded-xl transition-all duration-200
              text-white/80 hover:text-white
              ${!hasNext ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/20'}
            `}
            title="Next"
            aria-label="Next"
          >
            {isNextPressed && hasNext ? (
              <IconPlayerTrackNextFilled size={20} />
            ) : (
              <IconPlayerTrackNext size={20} />
            )}
          </motion.button>
          
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
}; 