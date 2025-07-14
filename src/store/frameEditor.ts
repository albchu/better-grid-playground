import { create } from 'zustand';

interface FrameEditorStore {
  currentFrameId: string | null;
  isVisible: boolean;
  
  // Actions
  setCurrentFrameId: (frameId: string | null) => void;
  setEditorVisible: (visible: boolean) => void;
  showFrameEditor: (frameId: string) => void;
  hideFrameEditor: () => void;
}

export const useFrameEditorStore = create<FrameEditorStore>((set) => ({
  currentFrameId: null,
  isVisible: false,
  
  setCurrentFrameId: (frameId) => {
    console.log('[FrameEditorStore] Setting current frame ID:', frameId);
    set({ currentFrameId: frameId });
  },
  
  setEditorVisible: (visible) => {
    console.log('[FrameEditorStore] Setting editor visible:', visible);
    set({ isVisible: visible });
  },
  
  showFrameEditor: (frameId) => {
    console.log('[FrameEditorStore] Showing frame editor with frame:', frameId);
    set({ 
      currentFrameId: frameId,
      isVisible: true 
    });
  },
  
  hideFrameEditor: () => {
    console.log('[FrameEditorStore] Hiding frame editor');
    set({ 
      isVisible: false,
      // Keep currentFrameId so animations can complete before clearing
    });
    
    // Clear frame ID after animation completes
    setTimeout(() => {
      set(state => {
        const shouldClear = !state.isVisible;
        if (shouldClear) {
          console.log('[FrameEditorStore] Clearing frame ID after hide animation');
        }
        return {
          currentFrameId: shouldClear ? null : state.currentFrameId
        };
      });
    }, 300); // Match animation duration
  }
})); 