import { create } from 'zustand';

interface FrameEditorStore {
  currentFrameId: string | null;
  
  // Actions
  setCurrentFrameId: (frameId: string | null) => void;
}

export const useFrameEditorStore = create<FrameEditorStore>((set) => ({
  currentFrameId: null,
  
  setCurrentFrameId: (frameId) => {
    console.log('[FrameEditorStore] Setting current frame ID:', frameId);
    set({ currentFrameId: frameId });
  }
})); 