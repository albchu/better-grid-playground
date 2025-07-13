import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX } from '@tabler/icons-react';
import type { FrameData } from '../../../types';
import { ActionBar } from './ActionBar';

interface ImageOverlayProps {
  frameData: FrameData;
  onClose: () => void;
}

export const ImageOverlay: React.FC<ImageOverlayProps> = ({ frameData, onClose }) => {
  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when overlay is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const overlayContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={handleBackdropClick}
      >
        {/* Dark backdrop */}
        <div className="absolute inset-0 bg-black/80" />

        {/* Close button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ delay: 0.1 }}
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close overlay"
        >
          <IconX size={24} className="text-white" />
        </motion.button>

        {/* Image container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 max-w-[90vw] max-h-[90vh] flex items-center"
        >
          <img
            src={frameData.imageDataUrl}
            alt={frameData.label}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            style={{ 
              aspectRatio: `${frameData.width} / ${frameData.height}`,
            }}
          />
        </motion.div>

        {/* Action bar */}
        <ActionBar
          frameData={frameData}
          onClose={onClose}
        />
      </motion.div>
    </AnimatePresence>
  );

  // Render in portal
  return createPortal(overlayContent, document.body);
}; 