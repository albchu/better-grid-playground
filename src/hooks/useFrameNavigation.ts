import { useMemo, useCallback, useEffect } from 'react';
import type { FrameData } from '../types';

interface UseFrameNavigationOptions {
  frames: FrameData[];
  currentFrameId: string | null;
  onFrameChange: (frameId: string) => void;
  wrapAround?: boolean;
  enableKeyboard?: boolean;
}

export interface UseFrameNavigationResult {
  // Current state
  currentFrame: FrameData | null;
  currentIndex: number;
  totalFrames: number;

  // Navigation state
  canGoPrevious: boolean;
  canGoNext: boolean;

  // Navigation actions
  goToPrevious: () => void;
  goToNext: () => void;
  goToFirst: () => void;
  goToLast: () => void;
  goToFrame: (frameId: string) => void;

  // Utility
  framesWithImages: FrameData[];
}

export const useFrameNavigation = ({
  frames,
  currentFrameId,
  onFrameChange,
  wrapAround = false,
  enableKeyboard = false,
}: UseFrameNavigationOptions): UseFrameNavigationResult => {
  // Filter frames with images
  const framesWithImages = useMemo(() => frames.filter((f) => f.imageDataUrl !== null), [frames]);

  // Calculate current index
  const currentIndex = useMemo(
    () => (currentFrameId ? framesWithImages.findIndex((f) => f.id === currentFrameId) : -1),
    [framesWithImages, currentFrameId]
  );

  // Get current frame
  const currentFrame = useMemo(
    () => (currentIndex !== -1 ? framesWithImages[currentIndex] : null),
    [framesWithImages, currentIndex]
  );

  // Calculate navigation availability
  const canGoPrevious = wrapAround ? framesWithImages.length > 1 : currentIndex > 0;
  const canGoNext = wrapAround
    ? framesWithImages.length > 1
    : currentIndex < framesWithImages.length - 1 && currentIndex !== -1;

  // Navigation callbacks
  const goToPrevious = useCallback(() => {
    if (!framesWithImages.length) return;

    // Use currentFrameId directly to ensure we have the latest state
    const currentIdx = currentFrameId
      ? framesWithImages.findIndex((f) => f.id === currentFrameId)
      : -1;
    if (currentIdx === -1) return;

    let prevIndex: number;
    if (wrapAround) {
      // Wrap around to last frame if at the beginning
      prevIndex = currentIdx <= 0 ? framesWithImages.length - 1 : currentIdx - 1;
    } else {
      // Stop at boundaries
      if (currentIdx <= 0) return;
      prevIndex = currentIdx - 1;
    }

    onFrameChange(framesWithImages[prevIndex].id);
  }, [currentFrameId, framesWithImages, onFrameChange, wrapAround]);

  const goToNext = useCallback(() => {
    if (!framesWithImages.length) return;

    // Use currentFrameId directly to ensure we have the latest state
    const currentIdx = currentFrameId
      ? framesWithImages.findIndex((f) => f.id === currentFrameId)
      : -1;
    if (currentIdx === -1) return;

    let nextIndex: number;
    if (wrapAround) {
      // Wrap around to first frame if at the end
      nextIndex = currentIdx >= framesWithImages.length - 1 ? 0 : currentIdx + 1;
    } else {
      // Stop at boundaries
      if (currentIdx >= framesWithImages.length - 1) return;
      nextIndex = currentIdx + 1;
    }

    onFrameChange(framesWithImages[nextIndex].id);
  }, [currentFrameId, framesWithImages, onFrameChange, wrapAround]);

  const goToFirst = useCallback(() => {
    if (framesWithImages.length > 0) {
      onFrameChange(framesWithImages[0].id);
    }
  }, [framesWithImages, onFrameChange]);

  const goToLast = useCallback(() => {
    if (framesWithImages.length > 0) {
      onFrameChange(framesWithImages[framesWithImages.length - 1].id);
    }
  }, [framesWithImages, onFrameChange]);

  const goToFrame = useCallback(
    (frameId: string) => {
      const frame = framesWithImages.find((f) => f.id === frameId);
      if (frame) {
        onFrameChange(frameId);
      }
    },
    [framesWithImages, onFrameChange]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'Home':
          e.preventDefault();
          goToFirst();
          break;
        case 'End':
          e.preventDefault();
          goToLast();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboard, goToPrevious, goToNext, goToFirst, goToLast]);

  return {
    // Current state
    currentFrame,
    currentIndex,
    totalFrames: framesWithImages.length,

    // Navigation state
    canGoPrevious,
    canGoNext,

    // Navigation actions
    goToPrevious,
    goToNext,
    goToFirst,
    goToLast,
    goToFrame,

    // Utility
    framesWithImages,
  };
};
