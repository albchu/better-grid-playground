import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { FrameData } from '../../../types';

interface BottomCarouselProps {
  frames: FrameData[];
  currentFrameId: string;
  onFrameSelect: (frameId: string) => void;
}

export const BottomCarousel: React.FC<BottomCarouselProps> = ({ 
  frames, 
  currentFrameId, 
  onFrameSelect 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentItemRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current item when it changes
  useEffect(() => {
    if (currentItemRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const item = currentItemRef.current;
      
      // Calculate scroll position to center the current item
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const containerCenter = container.offsetWidth / 2;
      const scrollLeft = itemCenter - containerCenter;
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [currentFrameId]);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="relative z-20 h-32 bg-black/60 backdrop-blur-lg border-t border-white/10"
    >
      <div 
        ref={scrollContainerRef}
        className="h-full overflow-x-auto overflow-y-hidden scrollbar-hide"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' }
        }}
      >
        <div className="flex items-center h-full px-6 gap-4">
          {frames.map((frame) => {
            const isActive = frame.id === currentFrameId;
            
            return (
              <motion.div
                key={frame.id}
                ref={isActive ? currentItemRef : undefined}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log('[BottomCarousel] Frame selected:', { id: frame.id });
                  onFrameSelect(frame.id);
                }}
                className={clsx(
                  "relative flex-shrink-0 cursor-pointer rounded-lg overflow-hidden transition-all duration-200",
                  isActive ? "ring-2 ring-white" : "opacity-60 hover:opacity-100"
                )}
                style={{ 
                  height: '80px',
                  aspectRatio: `${frame.width} / ${frame.height}`
                }}
              >
                {frame.imageDataUrl ? (
                  <img
                    src={frame.imageDataUrl}
                    alt={frame.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700" />
                )}
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="carousel-active-indicator"
                    className="absolute inset-0 border-2 border-white rounded-lg pointer-events-none"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Gradient edges for scroll indication */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
    </motion.div>
  );
}; 