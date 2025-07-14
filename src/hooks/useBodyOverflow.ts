import { useEffect } from 'react';

export const useBodyOverflow = (hidden: boolean) => {
  useEffect(() => {
    if (hidden) {
      // Store the original overflow value
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      // Cleanup function to restore original overflow
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [hidden]);
}; 