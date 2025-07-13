import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { FrameData, ImageSource } from '../types';
import { DEBUG_CONFIG } from '../utils/debug';

interface GridState {
  frames: FrameData[];
  selectionMode: boolean;
  selectedIds: Set<string>;
  
  addFrame: (imageSource: ImageSource) => Promise<void>;
  refreshFrameImage: (id: string, imageSource: ImageSource) => Promise<void>;
  updateFrame: (id: string, updates: Partial<FrameData>) => void;
  toggleSelectionMode: () => void;
  toggleSelect: (id: string) => void;
  deleteSelected: () => void;
}

// Debug logging utility
const logDebug = (action: string, data?: any) => {
  if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.categories.store) {
    console.log(`[GridStore] ${action}`, data || '');
  }
};

export const useGridStore = create<GridState>()((set) => ({
  frames: [],
  selectionMode: false,
  selectedIds: new Set<string>(),

  addFrame: async (imageSource: ImageSource) => {
    const id = uuidv4();
    logDebug('Adding frame', { id });
    
    set(s => ({
      frames: [...s.frames, {
        id, 
        width: 1, 
        height: 1,
        label: `Frame ${id.slice(0,4)}`,
        imageSrcUrl: `generated:${id}`, 
        imageDataUrl: null
      }]
    }));
    
    try {
      const { dataUrl, width, height } = await imageSource.generateImage(id);
      logDebug('Frame image generated', { id, width, height });
      
      set(s => ({
        frames: s.frames.map(f => 
          f.id === id ? { ...f, imageDataUrl: dataUrl, width, height } : f
        )
      }));
    } catch (error) {
      logDebug('Error generating image', { id, error });
    }
  },

  refreshFrameImage: async (id: string, imageSource: ImageSource) => {
    logDebug('Refreshing frame image', { id });
    
    try {
      const { dataUrl, width, height } = await imageSource.generateImage(id);
      logDebug('Frame image refreshed', { id, width, height });
      
      set(s => ({
        frames: s.frames.map(f => 
          f.id === id ? { ...f, imageDataUrl: dataUrl, width, height } : f
        )
      }));
    } catch (error) {
      logDebug('Error refreshing image', { id, error });
    }
  },

  updateFrame: (id: string, updates: Partial<FrameData>) => {
    logDebug('Updating frame', { id, updates });
    
    set(s => ({
      frames: s.frames.map(f => 
        f.id === id ? { ...f, ...updates } : f
      )
    }));
  },

  toggleSelectionMode: () => {
    set(s => {
      const newMode = !s.selectionMode;
      logDebug('Toggle selection mode', { selectionMode: newMode });
      return { selectionMode: newMode, selectedIds: new Set() };
    });
  },

  toggleSelect: (id: string) => {
    set(s => {
      const setIds = new Set(s.selectedIds);
      const wasSelected = setIds.has(id);
      
      if (wasSelected) {
        setIds.delete(id);
      } else {
        setIds.add(id);
      }
      
      logDebug('Toggle frame selection', { 
        id, 
        selected: !wasSelected, 
        totalSelected: setIds.size 
      });
      
      return { selectedIds: setIds };
    });
  },

  deleteSelected: () => {
    set(s => {
      const deletedCount = s.selectedIds.size;
      const deletedIds = Array.from(s.selectedIds);
      logDebug('Deleting selected frames', { count: deletedCount, ids: deletedIds });
      
      return { 
        frames: s.frames.filter(f => !s.selectedIds.has(f.id)),
        selectedIds: new Set(),
        selectionMode: false
      };
    });
  },
})); 