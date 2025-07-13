import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

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

  // Check scroll position on mount and when frames change
  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [frames]);

  const handleScrollLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of viewport
    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleScrollRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of viewport
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="relative z-20 h-32 bg-black/60 backdrop-blur-lg border-t border-white/10 flex items-center"
    >
      {/* Left arrow - using flex positioning */}
      <div className="absolute left-0 h-full flex items-center pl-2 z-10">
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              onClick={handleScrollLeft}
              className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
              aria-label="Scroll left"
            >
              <IconChevronLeft size={24} className="text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll container */}
      <div 
        ref={scrollContainerRef}
        className="h-full overflow-x-auto overflow-y-hidden scrollbar-hide flex-1"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' }
        }}
      >
        <div className="flex items-center h-full px-16 gap-4">
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

      {/* Right arrow - using flex positioning */}
      <div className="absolute right-0 h-full flex items-center pr-2 z-10">
        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              onClick={handleScrollRight}
              className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
              aria-label="Scroll right"
            >
              <IconChevronRight size={24} className="text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Gradient edges for scroll indication */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
    </motion.div>
  );
}; 