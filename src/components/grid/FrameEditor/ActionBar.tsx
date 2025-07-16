
import { 
  IconTrash, 
  IconDeviceFloppy, 
  IconRotateClockwise,
  IconEdit,
  IconPlayerTrackPrev,
  IconPlayerTrackNext
} from '@tabler/icons-react';
import type { UseFrameNavigationResult } from '../../../hooks/useFrameNavigation';
import { ActionButton } from './ActionButton';

interface ActionBarProps {
  navigation: UseFrameNavigationResult;
}

export const ActionBar = ({ 
  navigation
}: ActionBarProps) => {
  const hasMultipleFrames = navigation.totalFrames > 1;

  const handleRotate = () => {
    // TODO: Implement rotate functionality
  };

  const handleSave = () => {
    // TODO: Implement save functionality
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
  };

  const handleRename = () => {
    // TODO: Implement rename functionality
  };

  return (
    <div
      className="
        action-bar-animated
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
    </div>
  );
}; 