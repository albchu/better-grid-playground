import React, { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX } from '@tabler/icons-react';
import { useGridStore } from '../../../store/grid';
import { ActionBar } from './ActionBar';
import { BottomCarousel } from './BottomCarousel';

interface ImageOverlayProps {
  initialFrameId: string;
  onClose: () => void;
}

export const ImageOverlay: React.FC<ImageOverlayProps> = ({ initialFrameId, onClose }) => {
  const [currentFrameId, setCurrentFrameId] = useState(initialFrameId);
  const frames = useGridStore(s => s.frames);
  
  // Get current frame data
  const currentFrame = frames.find(f => f.id === currentFrameId);
  const currentFrameIndex = frames.findIndex(f => f.id === currentFrameId);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && currentFrameIndex > 0) {
        // Navigate to previous frame
        const prevFrame = frames[currentFrameIndex - 1];
        setCurrentFrameId(prevFrame.id);
        console.log('[ImageOverlay] Navigate to previous frame:', { id: prevFrame.id });
      } else if (e.key === 'ArrowRight' && currentFrameIndex < frames.length - 1) {
        // Navigate to next frame
        const nextFrame = frames[currentFrameIndex + 1];
        setCurrentFrameId(nextFrame.id);
        console.log('[ImageOverlay] Navigate to next frame:', { id: nextFrame.id });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when overlay is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, currentFrameIndex, frames]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!currentFrame) {
    return null;
  }

  const overlayContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col"
    >
      {/* Dark backdrop */}
      <motion.div 
        className="absolute inset-0 bg-black/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={handleBackdropClick}
      />

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Close button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ 
            delay: 0.1,
            exit: { delay: 0 }
          }}
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close overlay"
        >
          <IconX size={24} className="text-white" />
        </motion.button>

        {/* Image container with AnimatePresence for smooth transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFrame.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ 
              duration: 0.2,
              type: "spring",
              damping: 25,
              stiffness: 300
            }}
            className="relative z-10 max-w-[85vw] max-h-[75vh] flex items-center"
          >
            <img
              src={currentFrame.imageDataUrl}
              alt={currentFrame.label}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              style={{ 
                aspectRatio: `${currentFrame.width} / ${currentFrame.height}`,
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Action bar */}
        <ActionBar
          frameData={currentFrame}
          onClose={onClose}
        />
      </div>

      {/* Bottom carousel */}
      <BottomCarousel
        frames={frames}
        currentFrameId={currentFrameId}
        onFrameSelect={setCurrentFrameId}
      />
    </motion.div>
  );

  // Render in portal
  return createPortal(overlayContent, document.body);
}; 