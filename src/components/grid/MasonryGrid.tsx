import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGridStore } from '../../store/grid';
import { FrameCard } from './FrameCard';

export const MasonryGrid: React.FC = () => {
  const frames = useGridStore(s => s.frames);

  // Log frame count changes
  useEffect(() => {
    console.log('[MasonryGrid] Frame count changed:', frames.length);
  }, [frames.length]);

  if (!frames || frames.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
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
          columnWidth: '240px',
          columnGap: '16px'
        }}
      >
        <AnimatePresence>
          {frames.map((frame) => (
            <div 
              key={frame.id} 
              className="break-inside-avoid mb-4"
              style={{ display: 'inline-block', width: '100%' }}
            >
              <FrameCard data={frame} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}; 