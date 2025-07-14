import React from 'react';
import { motion } from 'framer-motion';
import { 
  IconRotateClockwise,
  IconDeviceFloppy,
  IconTrash,
  IconEdit
} from '@tabler/icons-react';
import type { FrameData } from '../../../types';
import { NavigationButton } from '../../common/NavigationButton';

interface ActionBarProps {
  frameData: FrameData;
  frames: FrameData[];
  currentFrameId: string | null;
  onFrameChange: (frameId: string) => void;
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



export const ActionBar: React.FC<ActionBarProps> = ({ 
  frameData, 
  frames, 
  currentFrameId, 
  onFrameChange
}) => {
  // Filter frames with images and find current index
  const framesWithImages = frames.filter(f => f.imageDataUrl);
  const currentIndex = currentFrameId 
    ? framesWithImages.findIndex(f => f.id === currentFrameId)
    : -1;
  const hasMultipleFrames = framesWithImages.length > 1;

  // Navigation functions with wraparound
  const goToPrevious = () => {
    if (!hasMultipleFrames || currentIndex === -1 || !currentFrameId) return;
    
    // Wrap around to last frame if at the beginning
    const prevIndex = currentIndex === 0 
      ? framesWithImages.length - 1 
      : currentIndex - 1;
    
    onFrameChange(framesWithImages[prevIndex].id);
  };

  const goToNext = () => {
    if (!hasMultipleFrames || currentIndex === -1 || !currentFrameId) return;
    
    // Wrap around to first frame if at the end
    const nextIndex = currentIndex === framesWithImages.length - 1 
      ? 0 
      : currentIndex + 1;
    
    onFrameChange(framesWithImages[nextIndex].id);
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
        bg-gray-900/60 backdrop-blur-md rounded-2xl
        border border-gray-700/50 shadow-2xl
        p-2 flex flex-row items-center gap-2
        pointer-events-auto
      "
      style={{ pointerEvents: 'auto' }}
    >
      {hasMultipleFrames && (
        <>
          <NavigationButton
            direction="prev"
            onClick={goToPrevious}
            disabled={false}
          />
          
          <NavigationButton
            direction="next"
            onClick={goToNext}
            disabled={false}
          />
          
          <div className="w-px h-8 bg-gray-600/50 mx-1" />
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
      
      <div className="w-px h-8 bg-gray-600/50 mx-1" />
      
      <ActionButton
        icon={<IconTrash size={20} />}
        label="Delete"
        onClick={handleDelete}
        variant="danger"
      />
    </motion.div>
  );
}; 