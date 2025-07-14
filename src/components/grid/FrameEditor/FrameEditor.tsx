import React, { useCallback, useMemo, useState } from 'react';
import { useGridStore } from '../../../store/grid';
import { useFrameEditorStore } from '../../../store/frameEditor';
import { useKeyboardNavigation } from '../../../hooks/useKeyboardNavigation';
import { useFrameNavigation } from '../../../hooks/useFrameNavigation';
import { ActionBar } from './ActionBar';
import { BottomCarousel } from './BottomCarousel';
import { FrameEditorImage } from './FrameEditorImage';
import { FrameNavigationService } from '../../../services/frameNavigation';

export const FrameEditor: React.FC = () => {
  
  const frames = useGridStore(state => state.frames);
  const currentFrameId = useFrameEditorStore(state => state.currentFrameId);
  const setCurrentFrameId = useFrameEditorStore(state => state.setCurrentFrameId);
  
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
  
  // Use keyboard navigation hook (without escape to close)
  useKeyboardNavigation({
    enabled: currentFrameId !== null,
    onArrowLeft: navigation.goToPrevious,
    onArrowRight: navigation.goToNext
  });
  
  // Auto-select first frame with image if none selected
  React.useEffect(() => {
    if (!currentFrameId && framesWithImages.length > 0) {
      setCurrentFrameId(framesWithImages[0].id);
    }
  }, [currentFrameId, framesWithImages, setCurrentFrameId]);
  
  if (!currentFrame) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-800 text-gray-400">
        <div className="text-center">
          <p className="text-lg mb-2">No frame selected</p>
          <p className="text-sm">Add frames with images to view them here</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col bg-gray-800">
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center relative p-8">
        <FrameEditorImage
          frame={currentFrame}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      {/* Bottom action bar */}
      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <ActionBar
          frameData={currentFrame}
          frames={framesWithImages}
          currentFrameId={currentFrameId}
          onFrameChange={updateCurrentFrame}
        />
      </div>
      
      {/* Bottom carousel */}
      {framesWithImages.length > 1 && (
        <div className="p-4 pt-0 bg-gray-900">
          <BottomCarousel
            frames={framesWithImages}
            currentFrameId={currentFrameId}
            onFrameSelect={updateCurrentFrame}
          />
        </div>
      )}
    </div>
  );
}; 