import React from 'react';
import { motion } from 'framer-motion';
import type { FrameData } from '../../../types';

interface FrameEditorImageProps {
  frame: FrameData;
  onClick: (e: React.MouseEvent) => void;
}

export const FrameEditorImage: React.FC<FrameEditorImageProps> = ({
  frame,
  onClick
}) => {
  return (
    <motion.div
      key={frame.id}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative"
      onClick={onClick}
    >
      <img
        src={frame.imageDataUrl!}
        alt={frame.label}
        className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-lg"
        style={{ 
          aspectRatio: `${frame.width} / ${frame.height}`
        }}
      />
    </motion.div>
  );
}; 