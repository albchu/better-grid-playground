import React from 'react';
import { motion } from 'framer-motion';

interface FrameEditorBackdropProps {
  onClick: () => void;
  isOverInteractive: boolean;
}

export const FrameEditorBackdrop: React.FC<FrameEditorBackdropProps> = ({
  onClick,
  isOverInteractive
}) => {
  return (
    <motion.div
      className="absolute inset-0 bg-black bg-opacity-80"
      onClick={onClick}
      style={{
        cursor: isOverInteractive ? 'default' : 'pointer'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    />
  );
}; 