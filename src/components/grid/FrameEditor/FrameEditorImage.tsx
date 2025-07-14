import React from 'react';
import { motion } from 'framer-motion';
import type { FrameData } from '../../../types';

interface FrameEditorImageProps {
  frame: FrameData;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: (e: React.MouseEvent) => void;
}

export const FrameEditorImage: React.FC<FrameEditorImageProps> = ({
  frame,
  onMouseEnter,
  onMouseLeave,
  onClick
}) => {
  return (
    <motion.div
      key={frame.id}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative pointer-events-auto"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <img
        src={frame.imageDataUrl!}
        alt={frame.label}
        className="max-w-[90vw] max-h-[70vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
        style={{ 
          aspectRatio: `${frame.width} / ${frame.height}`
        }}
      />
    </motion.div>
  );
}; 