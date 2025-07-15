import React from 'react';
import { motion } from 'framer-motion';
import { 
  IconTrash, 
  IconDeviceFloppy, 
  IconRotateClockwise,
  IconEdit,
  IconPlayerTrackPrev,
  IconPlayerTrackNext
} from '@tabler/icons-react';
import type { FrameData } from '../../../types';
import type { UseFrameNavigationResult } from '../../../hooks/useFrameNavigation';
import { ActionButton } from './ActionButton';

interface ActionBarProps {
  frameData: FrameData;
  navigation: UseFrameNavigationResult;
}

export const ActionBar: React.FC<ActionBarProps> = ({ 
  frameData, 
  navigation
}) => {
  const hasMultipleFrames = navigation.totalFrames > 1;

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
          <ActionButton
            icon={<IconPlayerTrackPrev size={20} />}
            label="Previous"
            onClick={navigation.goToPrevious}
            disabled={!navigation.canGoPrevious}
          />
          
          <ActionButton
            icon={<IconPlayerTrackNext size={20} />}
            label="Next"
            onClick={navigation.goToNext}
            disabled={!navigation.canGoNext}
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