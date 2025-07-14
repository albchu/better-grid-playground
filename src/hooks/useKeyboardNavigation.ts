import { useEffect, useCallback } from 'react';

interface KeyboardNavigationOptions {
  onEscape?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  enabled?: boolean;
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions) => {
  const { 
    onEscape, 
    onArrowLeft, 
    onArrowRight, 
    onArrowUp, 
    onArrowDown,
    enabled = true 
  } = options;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    switch (e.key) {
      case 'Escape':
        if (onEscape) {
          e.preventDefault();
          onEscape();
        }
        break;
      case 'ArrowLeft':
        if (onArrowLeft) {
          e.preventDefault();
          onArrowLeft();
        }
        break;
      case 'ArrowRight':
        if (onArrowRight) {
          e.preventDefault();
          onArrowRight();
        }
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          e.preventDefault();
          onArrowUp();
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          e.preventDefault();
          onArrowDown();
        }
        break;
    }
  }, [enabled, onEscape, onArrowLeft, onArrowRight, onArrowUp, onArrowDown]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}; 