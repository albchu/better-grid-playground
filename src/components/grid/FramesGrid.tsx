
import { useFrameEditorStore } from '../../store/frameEditor';
import { FrameCard } from './FrameCard';

export const FramesGrid = () => {
  const frames = useFrameEditorStore(s => s.frames);
  const gridColumnWidth = useFrameEditorStore(s => s.gridColumnWidth);
  const currentFrameId = useFrameEditorStore(s => s.currentFrameId);



  if (!frames || frames.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <p className="text-lg mb-2">No frames yet</p>
          <p className="text-sm">Click "Add Frame" to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div 
        className="masonry-columns"
        style={{
          columnCount: 'auto',
          columnWidth: `${gridColumnWidth}px`,
          gap: '16px'
        }}
      >
        {frames.map((frame) => (
          <div 
            key={frame.id} 
            className="break-inside-avoid mb-4"
            style={{ display: 'inline-block', width: '100%' }}
          >
            <FrameCard 
              data={frame} 
              isCurrent={frame.id === currentFrameId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}; 