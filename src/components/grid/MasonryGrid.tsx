import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGridStore } from '../../store/grid';
import { FrameCard } from './FrameCard';

export const MasonryGrid: React.FC = () => {
  const frames = useGridStore(s => s.frames);
  const gridColumnWidth = useGridStore(s => s.gridColumnWidth);

  // Log frame count changes
  useEffect(() => {
    console.log('[MasonryGrid] Frame count changed:', frames.length);
  }, [frames.length]);

  // Log grid size changes
  useEffect(() => {
    console.log('[MasonryGrid] Grid column width changed:', gridColumnWidth);
  }, [gridColumnWidth]);

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
        className="masonry-columns transition-all duration-300 ease-in-out"
        style={{
          columnCount: 'auto',
          columnWidth: `${gridColumnWidth}px`,
          columnGap: '16px'
        }}
      >
        <AnimatePresence>
          {frames.map((frame) => (
            <div 
              key={frame.id} 
              className="break-inside-avoid mb-4 transition-all duration-300"
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