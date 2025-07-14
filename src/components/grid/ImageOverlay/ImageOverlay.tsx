import React, { useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGridStore } from '../../../store/grid';
import { useOverlayStore } from '../../../store/overlay';
import { FrameData } from '../../../types';
import { ActionBar } from './ActionBar';
import { BottomCarousel } from './BottomCarousel';
import { DEBUG_CONFIG } from '../../../utils/debug';

export const ImageOverlay: React.FC = () => {
  console.log('=== SIMPLIFIED OVERLAY VERSION 5.1 - LAYOUT FIXED ===');
  
  const frames = useGridStore(state => state.frames);
  const currentFrameId = useOverlayStore(state => state.currentFrameId);
  const isVisible = useOverlayStore(state => state.isVisible);
  const setCurrentFrameId = useOverlayStore(state => state.setCurrentFrameId);
  const hideOverlay = useOverlayStore(state => state.hideOverlay);
  
  // Only get frames with images
  const framesWithImages = useMemo(
    () => frames.filter(f => f.imageDataUrl),
    [frames]
  );
  
  console.log('[ImageOverlay] Rendering with:', {
    totalFrames: frames.length,
    framesWithImages: framesWithImages.length,
    currentFrameId,
    isVisible
  });
  
  // Update frame navigation
  const updateCurrentFrame = useCallback((newFrameId: string) => {
    console.log('[ImageOverlay] updateCurrentFrame called with:', newFrameId);
    setCurrentFrameId(newFrameId);
  }, [setCurrentFrameId]);
  
  // Get current frame data
  const currentFrame = React.useMemo(
    () => currentFrameId ? frames.find(f => f.id === currentFrameId) : null,
    [frames, currentFrameId]
  );
  
  const currentFrameIndex = React.useMemo(
    () => currentFrameId ? framesWithImages.findIndex(f => f.id === currentFrameId) : -1,
    [framesWithImages, currentFrameId]
  );
  
  // Helper function to find next frame with image
  const findNextFrameWithImage = (startIndex: number, direction: 'forward' | 'backward'): FrameData | null => {
    if (direction === 'forward') {
      return framesWithImages[startIndex + 1] || null;
    } else {
      return framesWithImages[startIndex - 1] || null;
    }
  };
  
  // Keyboard navigation
  useEffect(() => {
    if (!isVisible || currentFrameIndex === -1) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          hideOverlay();
          break;
        case 'ArrowLeft':
          const prevFrame = findNextFrameWithImage(currentFrameIndex, 'backward');
          if (prevFrame) {
            updateCurrentFrame(prevFrame.id);
          }
          break;
        case 'ArrowRight':
          const nextFrame = findNextFrameWithImage(currentFrameIndex, 'forward');
          if (nextFrame) {
            updateCurrentFrame(nextFrame.id);
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hideOverlay, currentFrameIndex, framesWithImages, updateCurrentFrame]);
  
  // Manage body overflow when overlay is visible
  useEffect(() => {
    if (isVisible) {
      console.log('[ImageOverlay] Setting body overflow hidden');
      document.body.style.overflow = 'hidden';
      return () => {
        console.log('[ImageOverlay] Resetting body overflow');
        document.body.style.overflow = '';
      };
    }
  }, [isVisible]);
  
  // Handle backdrop click
  const handleBackdropClick = useCallback(() => {
    hideOverlay();
  }, [hideOverlay]);
  
  // Track if mouse is over interactive elements
  const [isOverInteractive, setIsOverInteractive] = React.useState(false);
  const handleInteractiveEnter = useCallback(() => setIsOverInteractive(true), []);
  const handleInteractiveLeave = useCallback(() => setIsOverInteractive(false), []);
  
  if (!currentFrame && DEBUG_CONFIG.enabled) {
    console.warn('[ImageOverlay] No current frame found');
  }
  
  return (
    <div
      className="fixed inset-0 z-50 transition-all duration-300 flex flex-col"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      {/* Only render internals when we have a frame */}
      {currentFrameId && currentFrame && (
        <>
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-80"
            onClick={handleBackdropClick}
            style={{
              cursor: isOverInteractive ? 'default' : 'pointer'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Close button */}
          <button 
            onClick={hideOverlay}
            className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-md transition-all duration-200"
            onMouseEnter={handleInteractiveEnter}
            onMouseLeave={handleInteractiveLeave}
            title="Close (Esc)"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Main content area */}
          <div className="flex-1 flex items-center justify-center relative z-10 pointer-events-none">
            {/* Image container */}
            <motion.div
              key={currentFrame.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative pointer-events-auto"
              onMouseEnter={handleInteractiveEnter}
              onMouseLeave={handleInteractiveLeave}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentFrame.imageDataUrl}
                alt={currentFrame.label}
                className="max-w-[90vw] max-h-[70vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                style={{ 
                  aspectRatio: `${currentFrame.width} / ${currentFrame.height}`
                }}
              />
            </motion.div>
          </div>
          
          {/* Bottom action bar */}
          <div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={handleInteractiveEnter}
            onMouseLeave={handleInteractiveLeave}
          >
            <ActionBar
              frameData={currentFrame}
              frames={framesWithImages}
              currentFrameId={currentFrameId}
              onFrameChange={updateCurrentFrame}
              onClose={hideOverlay}
            />
          </div>
          
          {/* Bottom carousel */}
          {framesWithImages.length > 1 && (
            <div
              className="absolute bottom-32 left-0 right-0 z-20 px-8 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={handleInteractiveEnter}
              onMouseLeave={handleInteractiveLeave}
            >
              <BottomCarousel
                frames={framesWithImages}
                currentFrameId={currentFrameId}
                onFrameSelect={updateCurrentFrame}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}; 