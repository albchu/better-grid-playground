import { create } from 'zustand';
import { useGridStore } from './grid';

interface FrameEditorStore {
  currentFrameId: string | null;
  
  // Actions
  setCurrentFrameId: (frameId: string | null) => void;
}

export const useFrameEditorStore = create<FrameEditorStore>((set, get) => ({
  currentFrameId: null,
  
  setCurrentFrameId: (frameId) => {
    const currentState = get();
    
    // Don't update if it's the same frame
    if (currentState.currentFrameId === frameId) {
      console.log('[FrameEditorStore] Skipping update - same frame:', {
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
      currentFrameId: frameId
    });
  }
})); 