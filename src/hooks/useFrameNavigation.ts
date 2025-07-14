import { useMemo, useCallback } from 'react';
import type { FrameData } from '../types';

interface FrameNavigationResult {
  currentIndex: number;
  hasPrevious: boolean;
  hasNext: boolean;
  previousFrame: FrameData | null;
  nextFrame: FrameData | null;
  goToPrevious: () => void;
  goToNext: () => void;
  goToFrame: (frameId: string) => void;
}

export const useFrameNavigation = (
  frames: FrameData[],
  currentFrameId: string | null,
  onFrameChange: (frameId: string) => void
): FrameNavigationResult => {
  // Filter frames with images
  const framesWithImages = useMemo(
    () => frames.filter(f => f.imageDataUrl),
    [frames]
  );

  // Calculate current index
  const currentIndex = useMemo(
    () => currentFrameId ? framesWithImages.findIndex(f => f.id === currentFrameId) : -1,
    [framesWithImages, currentFrameId]
  );

  // Calculate navigation availability
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < framesWithImages.length - 1 && currentIndex !== -1;

  // Get adjacent frames
  const previousFrame = hasPrevious ? framesWithImages[currentIndex - 1] : null;
  const nextFrame = hasNext ? framesWithImages[currentIndex + 1] : null;

  // Navigation callbacks
  const goToPrevious = useCallback(() => {
    if (previousFrame) {
      onFrameChange(previousFrame.id);
    }
  }, [previousFrame, onFrameChange]);

  const goToNext = useCallback(() => {
    if (nextFrame) {
      onFrameChange(nextFrame.id);
    }
  }, [nextFrame, onFrameChange]);

  const goToFrame = useCallback((frameId: string) => {
    const frame = framesWithImages.find(f => f.id === frameId);
    if (frame) {
      onFrameChange(frameId);
    }
  }, [framesWithImages, onFrameChange]);

  return {
    currentIndex,
    hasPrevious,
    hasNext,
    previousFrame,
    nextFrame,
    goToPrevious,
    goToNext,
    goToFrame
  };
}; 