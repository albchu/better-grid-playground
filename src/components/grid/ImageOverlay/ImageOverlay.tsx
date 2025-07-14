import React, { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX } from '@tabler/icons-react';
import { useGridStore } from '../../../store/grid';
import type { FrameData } from '../../../types';
import { ActionBar } from './ActionBar';
import { BottomCarousel } from './BottomCarousel';

interface ImageOverlayProps {
  initialFrameId: string;
  onClose: () => void;
}

export const ImageOverlay: React.FC<ImageOverlayProps> = ({ initialFrameId, onClose }) => {
  const [currentFrameId, setCurrentFrameId] = useState(initialFrameId);
  const [isBackdropHovered, setIsBackdropHovered] = useState(false);
  const frames = useGridStore(s => s.frames);
  
  // Debug wrapper for state changes
  const updateCurrentFrame = useCallback((newFrameId: string) => {
    console.log('[ImageOverlay] updateCurrentFrame called:', {
      to: newFrameId
    });
    setCurrentFrameId(newFrameId);
  }, []);
  
  // Get current frame data
  const currentFrame = frames.find(f => f.id === currentFrameId);
  const currentFrameIndex = frames.findIndex(f => f.id === currentFrameId);
  
  // Debug logging
  console.log('[ImageOverlay] Frame state:', {
    totalFrames: frames.length,
    currentFrameId,
    currentFrameIndex,
    currentFrameHasImage: !!currentFrame?.imageDataUrl
  });
  
  // Helper function to find next frame with image
  const findNextFrameWithImage = (startIndex: number, direction: 'forward' | 'backward'): FrameData | null => {
    if (direction === 'forward') {
      for (let i = startIndex + 1; i < frames.length; i++) {
        if (frames[i].imageDataUrl) return frames[i];
      }
    } else {
      for (let i = startIndex - 1; i >= 0; i--) {
        if (frames[i].imageDataUrl) return frames[i];
      }
    }
    return null;
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        const prevFrame = findNextFrameWithImage(currentFrameIndex, 'backward');
        if (prevFrame) {
          updateCurrentFrame(prevFrame.id);
          console.log('[ImageOverlay] Navigate to previous frame:', { id: prevFrame.id });
        } else {
          console.log('[ImageOverlay] No previous frame with image');
        }
      } else if (e.key === 'ArrowRight') {
        const nextFrame = findNextFrameWithImage(currentFrameIndex, 'forward');
        if (nextFrame) {
          updateCurrentFrame(nextFrame.id);
          console.log('[ImageOverlay] Navigate to next frame:', { id: nextFrame.id });
        } else {
          console.log('[ImageOverlay] No next frame with image');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, currentFrameIndex, frames, updateCurrentFrame]);

  // Separate effect for body overflow to ensure proper cleanup
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Handle backdrop click
  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle mouse enter/leave on backdrop area
  const handleMouseEnter = useCallback(() => {
    // setIsBackdropHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    // setIsBackdropHovered(false);
  }, []);

  if (!currentFrame || !currentFrame.imageDataUrl) {
    console.warn('[ImageOverlay] No frame or no image found:', { 
      currentFrameId, 
      hasFrame: !!currentFrame,
      hasImage: !!currentFrame?.imageDataUrl 
    });
    return null;
  }

  const overlayContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col"
      onClick={handleBackdropClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dark backdrop */}
      <motion.div 
        className="absolute inset-0 bg-black/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
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
          className={`absolute top-6 right-6 z-20 p-3 backdrop-blur-md rounded-full transition-colors ${
            isBackdropHovered ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'
          }`}
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
            className={`relative z-10 max-w-[85vw] flex items-center ${
              frames.length > 1 ? 'max-h-[75vh]' : 'max-h-[90vh]'
            }`}
            onClick={(e) => e.stopPropagation()}
            // onMouseEnter={() => setIsBackdropHovered(false)}
            // onMouseLeave={() => setIsBackdropHovered(true)}
          >
            <img
              src={currentFrame.imageDataUrl}
              alt={currentFrame.label}
              className={`max-w-full object-contain rounded-lg shadow-2xl ${
                frames.length > 1 ? 'max-h-[75vh]' : 'max-h-[90vh]'
              }`}
              style={{ 
                aspectRatio: `${currentFrame.width} / ${currentFrame.height}`,
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Action bar */}
        <div 
          onClick={(e) => e.stopPropagation()}
          // onMouseEnter={() => setIsBackdropHovered(false)}
          // onMouseLeave={() => setIsBackdropHovered(true)}
        >
          <ActionBar
            frameData={currentFrame}
            frames={frames}
            currentFrameId={currentFrameId}
            onFrameChange={updateCurrentFrame}
            onClose={onClose}
          />
        </div>
      </div>

      {/* Bottom carousel */}
      {frames.filter(f => f.imageDataUrl).length > 1 && (
        <div 
          onClick={(e) => e.stopPropagation()}
          // onMouseEnter={() => setIsBackdropHovered(false)}
          // onMouseLeave={() => setIsBackdropHovered(true)}
        >
          <BottomCarousel
            frames={frames}
            currentFrameId={currentFrameId}
            onFrameSelect={updateCurrentFrame}
          />
        </div>
      )}
    </motion.div>
  );

  // Render in portal
  return createPortal(overlayContent, document.body);
}; 