import React, { useCallback, useMemo } from 'react';
import { useGridStore } from '../../../store/grid';
import { useFrameEditorStore } from '../../../store/frameEditor';
import { useKeyboardNavigation } from '../../../hooks/useKeyboardNavigation';
import { useFrameNavigation } from '../../../hooks/useFrameNavigation';
import { ActionBar } from './ActionBar';
import { FrameEditorImage } from './FrameEditorImage';
import { FrameNavigationService } from '../../../services/frameNavigation';
import { EditableLabel } from '../../common/EditableLabel';

export const FrameEditor: React.FC = () => {
  
  const frames = useGridStore(state => state.frames);
  const updateFrame = useGridStore(state => state.updateFrame);
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
    <div className="h-full bg-gray-800 relative overflow-hidden">
      {/* Frame title at the top */}
      <div className="absolute top-4 left-0 right-0 flex justify-center z-10">
        <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm px-4 py-2 rounded-lg">
          <EditableLabel
            value={currentFrame.label}
            onChange={(label) => updateFrame(currentFrame.id, { label })}
            className="text-lg text-gray-200 font-medium"
          />
        </div>
      </div>
      
      {/* Main content area - with calculated height */}
      <div className="absolute inset-0 pt-20 pb-24 flex items-center justify-center p-4">
        <FrameEditorImage
          frame={currentFrame}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      {/* Fixed action bar at bottom center */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <ActionBar
          frameData={currentFrame}
          frames={framesWithImages}
          currentFrameId={currentFrameId!}
          onFrameChange={updateCurrentFrame}
        />
      </div>
    </div>
  );
}; 