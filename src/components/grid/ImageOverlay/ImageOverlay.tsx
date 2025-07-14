import React, { useCallback, useMemo, useState } from 'react';
import { useGridStore } from '../../../store/grid';
import { useOverlayStore } from '../../../store/overlay';
import { useKeyboardNavigation } from '../../../hooks/useKeyboardNavigation';
import { useFrameNavigation } from '../../../hooks/useFrameNavigation';
import { useBodyOverflow } from '../../../hooks/useBodyOverflow';
import { CloseButton } from '../../common/CloseButton';
import { ActionBar } from './ActionBar';
import { BottomCarousel } from './BottomCarousel';
import { OverlayBackdrop } from './OverlayBackdrop';
import { OverlayImage } from './OverlayImage';
import { FrameNavigationService } from '../../../services/frameNavigation';

export const ImageOverlay: React.FC = () => {
  
  const frames = useGridStore(state => state.frames);
  const currentFrameId = useOverlayStore(state => state.currentFrameId);
  const isVisible = useOverlayStore(state => state.isVisible);
  const setCurrentFrameId = useOverlayStore(state => state.setCurrentFrameId);
  const hideOverlay = useOverlayStore(state => state.hideOverlay);
  
  // Track if mouse is over interactive elements
  const [isOverInteractive, setIsOverInteractive] = useState(false);
  
  // Get frames with images using service
  const framesWithImages = useMemo(
    () => FrameNavigationService.getFramesWithImages(frames),
    [frames]
  );
  
  // Update frame navigation
  const updateCurrentFrame = useCallback((newFrameId: string) => {
    setCurrentFrameId(newFrameId);
  }, [setCurrentFrameId]);
  
  // Use frame navigation hook
  const navigation = useFrameNavigation(frames, currentFrameId, updateCurrentFrame);
  
  // Get current frame data
  const currentFrame = useMemo(
    () => currentFrameId ? frames.find(f => f.id === currentFrameId) : null,
    [frames, currentFrameId]
  );
  
  // Use keyboard navigation hook
  useKeyboardNavigation({
    enabled: isVisible && currentFrameId !== null,
    onEscape: hideOverlay,
    onArrowLeft: navigation.goToPrevious,
    onArrowRight: navigation.goToNext
  });
  
  // Manage body overflow
  useBodyOverflow(isVisible);
  
  // Handle backdrop click
  const handleBackdropClick = useCallback(() => {
    hideOverlay();
  }, [hideOverlay]);
  
  // Interactive state handlers
  const handleInteractiveEnter = useCallback(() => setIsOverInteractive(true), []);
  const handleInteractiveLeave = useCallback(() => setIsOverInteractive(false), []);
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 transition-all duration-300 flex flex-col">
      {currentFrameId && currentFrame && (
        <>
          {/* Backdrop */}
          <OverlayBackdrop 
            onClick={handleBackdropClick}
            isOverInteractive={isOverInteractive}
          />
          
          {/* Close button */}
          <div 
            className="absolute top-4 right-4 z-20"
            onMouseEnter={handleInteractiveEnter}
            onMouseLeave={handleInteractiveLeave}
          >
            <CloseButton onClick={hideOverlay} />
          </div>
          
          {/* Main content area */}
          <div className="flex-1 flex items-center justify-center relative z-10 pointer-events-none">
            <OverlayImage
              frame={currentFrame}
              onMouseEnter={handleInteractiveEnter}
              onMouseLeave={handleInteractiveLeave}
              onClick={(e) => e.stopPropagation()}
            />
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