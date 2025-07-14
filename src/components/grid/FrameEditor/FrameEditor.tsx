import React from 'react';
import { useGridStore } from '../../../store/grid';
import { useFrameEditorStore } from '../../../store/frameEditor';
import { useFrameNavigation } from '../../../hooks/useFrameNavigation';
import { ActionBar } from './ActionBar';
import { FrameEditorImage } from './FrameEditorImage';
import { EditableLabel } from '../../common/EditableLabel';

export const FrameEditor: React.FC = () => {
  const frames = useGridStore(state => state.frames);
  const updateFrame = useGridStore(state => state.updateFrame);
  const currentFrameId = useFrameEditorStore(state => state.currentFrameId);
  const setCurrentFrameId = useFrameEditorStore(state => state.setCurrentFrameId);
  
  // Use enhanced frame navigation hook with keyboard support and wraparound
  const navigation = useFrameNavigation({
    frames,
    currentFrameId,
    onFrameChange: setCurrentFrameId,
    wrapAround: true,
    enableKeyboard: true
  });
  
  // Auto-select first frame with image if none selected
  React.useEffect(() => {
    if (!currentFrameId && navigation.framesWithImages.length > 0) {
      setCurrentFrameId(navigation.framesWithImages[0].id);
    }
  }, [currentFrameId, navigation.framesWithImages, setCurrentFrameId]);
  
  if (!navigation.currentFrame) {
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
            value={navigation.currentFrame.label}
            onChange={(label) => updateFrame(navigation.currentFrame!.id, { label })}
            className="text-lg text-gray-200 font-medium"
          />
        </div>
      </div>
      
      {/* Main content area - with calculated height */}
      <div className="absolute inset-0 pt-20 pb-24 flex items-center justify-center p-4">
        <FrameEditorImage
          frame={navigation.currentFrame}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      {/* Fixed action bar at bottom center */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <ActionBar
          frameData={navigation.currentFrame}
          navigation={navigation}
        />
      </div>
    </div>
  );
}; 