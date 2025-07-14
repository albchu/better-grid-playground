import { create } from 'zustand';
import { useGridStore } from './grid';

interface FrameEditorStore {
  currentFrameId: string | null;
  isTransitioning: boolean;
  
  // Actions
  setCurrentFrameId: (frameId: string | null) => void;
  setIsTransitioning: (transitioning: boolean) => void;
}

export const useFrameEditorStore = create<FrameEditorStore>((set, get) => ({
  currentFrameId: null,
  isTransitioning: false,
  
  setCurrentFrameId: (frameId) => {
    const currentState = get();
    
    // Don't update if we're already transitioning or if it's the same frame
    if (currentState.isTransitioning || currentState.currentFrameId === frameId) {
      console.log('[FrameEditorStore] Skipping update - transitioning or same frame:', {
        isTransitioning: currentState.isTransitioning,
        currentFrameId: currentState.currentFrameId,
        newFrameId: frameId
      });
      return;
    }
    
    // Validate that the frame exists
    if (frameId !== null) {
      const frames = useGridStore.getState().frames;
      const frameExists = frames.some(f => f.id === frameId && f.imageDataUrl !== null);
      
      if (!frameExists) {
        console.warn('[FrameEditorStore] Frame does not exist or has no image:', frameId);
        return;
      }
    }
    
    console.log('[FrameEditorStore] Setting current frame ID:', frameId);
    set({ 
      currentFrameId: frameId,
      isTransitioning: true 
    });
    
    // Reset transitioning flag after a short delay
    setTimeout(() => {
      set({ isTransitioning: false });
    }, 200);
  },
  
  setIsTransitioning: (transitioning) => {
    set({ isTransitioning: transitioning });
  }
})); 