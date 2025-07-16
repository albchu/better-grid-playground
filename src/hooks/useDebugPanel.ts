import { useState, useEffect, useCallback } from 'react';

export const useDebugPanel = (shortcut = 'ctrl+d') => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const [modifier, key] = shortcut.split('+');

      if (modifier === 'ctrl' && e.ctrlKey && e.key.toLowerCase() === key) {
        e.preventDefault();
        toggleVisibility();
      } else if (modifier === 'cmd' && e.metaKey && e.key.toLowerCase() === key) {
        e.preventDefault();
        toggleVisibility();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcut, toggleVisibility]);

  return {
    isVisible,
    toggleVisibility,
    show: () => setIsVisible(true),
    hide: () => setIsVisible(false),
  };
};
