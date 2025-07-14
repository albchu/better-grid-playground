import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconRefresh } from '@tabler/icons-react';
import clsx from 'clsx';
import type { FrameData } from '../../types';
import { useGridStore } from '../../store/grid';
import { useGridActions } from '../../hooks/useGridActions';
import { Skeleton } from '../common/Skeleton';
import { EditableLabel } from '../common/EditableLabel';
import { ImageOverlay } from './ImageOverlay';

interface FrameCardProps {
  data: FrameData;
}

export const FrameCard: React.FC<FrameCardProps> = ({ data }) => {
  const selectionMode = useGridStore(s => s.selectionMode);
  const isSelected = useGridStore(s => s.selectedIds.has(data.id));
  const { refreshFrameImage, toggleSelect, updateFrame } = useGridActions();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    console.log('[FrameCard] Mounted:', { 
      id: data.id, 
      hasImage: !!data.imageDataUrl 
    });
    
    return () => {
      console.log('[FrameCard] Unmounted:', { id: data.id });
    };
  }, [data.id]);

  const handleClick = (e: React.MouseEvent) => {
    if (selectionMode && !e.defaultPrevented) {
      console.log('[FrameCard] Clicked in selection mode:', { id: data.id });
      toggleSelect(data.id);
    } else if (!selectionMode && data.imageDataUrl) {
      // Open overlay when not in selection mode
      console.log('[FrameCard] Opening overlay:', { id: data.id });
      setIsOverlayOpen(true);
    }
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('[FrameCard] Refresh requested:', { id: data.id });
    refreshFrameImage(data.id);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ 
          scale: 1.05,
          borderRadius: 0,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 1.02 }}
        onClick={handleClick}
        className={clsx(
          "rounded shadow bg-white overflow-hidden transition-shadow",
          "hover:shadow-lg",
          selectionMode && "cursor-pointer",
          isSelected && "ring-4 ring-indigo-500",
          !selectionMode && data.imageDataUrl && "cursor-zoom-in"
        )}
      >
        <div
          style={{ aspectRatio: `${data.width} / ${data.height}` }}
          className="overflow-hidden bg-neutral-200"
        >
          {data.imageDataUrl ? (
            <img
              src={data.imageDataUrl}
              alt={data.label}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onLoad={() => console.log('[FrameCard] Image loaded:', { id: data.id })}
              onError={() => console.error('[FrameCard] Image failed to load:', { id: data.id })}
            />
          ) : (
            <Skeleton />
          )}
        </div>

        <footer className="flex items-center justify-between px-2 py-1 text-sm text-gray-600">
          <EditableLabel
            value={data.label}
            onChange={(label) => {
              console.log('[FrameCard] Label changed:', { id: data.id, newLabel: label });
              updateFrame(data.id, { label });
            }}
          />
          <button
            onClick={handleRefresh}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Generate new image"
          >
            <IconRefresh size={16} />
          </button>
        </footer>
      </motion.div>

      <AnimatePresence mode="wait">
        {isOverlayOpen && (
          <ImageOverlay
            key="image-overlay"
            initialFrameId={data.id}
            onClose={() => setIsOverlayOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}; 