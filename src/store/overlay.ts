import { create } from 'zustand';

interface OverlayStore {
  currentFrameId: string | null;
  isVisible: boolean;
  
  // Actions
  setCurrentFrameId: (frameId: string | null) => void;
  setOverlayVisible: (visible: boolean) => void;
  showOverlay: (frameId: string) => void;
  hideOverlay: () => void;
}

export const useOverlayStore = create<OverlayStore>((set) => ({
  currentFrameId: null,
  isVisible: false,
  
  setCurrentFrameId: (frameId) => {
    console.log('[OverlayStore] Setting current frame ID:', frameId);
    set({ currentFrameId: frameId });
  },
  
  setOverlayVisible: (visible) => {
    console.log('[OverlayStore] Setting overlay visible:', visible);
    set({ isVisible: visible });
  },
  
  showOverlay: (frameId) => {
    console.log('[OverlayStore] Showing overlay with frame:', frameId);
    set({ 
      currentFrameId: frameId,
      isVisible: true 
    });
  },
  
  hideOverlay: () => {
    console.log('[OverlayStore] Hiding overlay');
    set({ 
      isVisible: false,
      // Keep currentFrameId so animations can complete before clearing
    });
    
    // Clear frame ID after animation completes
    setTimeout(() => {
      set(state => {
        const shouldClear = !state.isVisible;
        if (shouldClear) {
          console.log('[OverlayStore] Clearing frame ID after hide animation');
        }
        return {
          currentFrameId: shouldClear ? null : state.currentFrameId
        };
      });
    }, 300); // Match animation duration
  }
})); 