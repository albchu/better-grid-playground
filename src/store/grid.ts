import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { FrameData, ImageSource } from '../types';
import { DEBUG_CONFIG } from '../utils/debug';

interface GridStore {
  frames: FrameData[];
  gridColumnWidth: number;
  targetFrameSize: number;
  selectionMode: boolean;
  selectedIds: Set<string>;
  
  // Actions
  addFrame: (imageSource: ImageSource) => Promise<void>;
  refreshFrameImage: (id: string, imageSource: ImageSource) => Promise<void>;
  removeFrame: (id: string) => void;
  updateFrame: (id: string, updates: Partial<FrameData>) => void;
  setGridColumnWidth: (width: number) => void;
  setTargetFrameSize: (size: number) => void;
  toggleSelectionMode: () => void;
  toggleSelect: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  deleteSelected: () => void;
  increaseGridSize: () => void;
  decreaseGridSize: () => void;
}

// Debug logging utility
const logDebug = (action: string, data?: any) => {
  if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.categories.store) {
    console.log(`[GridStore] ${action}`, data || '');
  }
};

// Grid size presets
export const GRID_SIZE_PRESETS = [120, 160, 200, 240, 300, 360, 420];
const MIN_GRID_SIZE = 120;
const MAX_GRID_SIZE = 420;

export const useGridStore = create<GridStore>()((set) => ({
  frames: [],
  selectionMode: false,
  selectedIds: new Set<string>(),
  gridColumnWidth: 240, // Default column width
  targetFrameSize: 1, // Default target frame size

  addFrame: async (imageSource: ImageSource) => {
    const id = uuidv4();
    logDebug('Adding frame', { id });
    
    set(s => ({
      frames: [...s.frames, {
        id, 
        width: 1, 
        height: 1,
        label: `Frame ${id.slice(0,4)}`,
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

  removeFrame: (id: string) => {
    logDebug('Removing frame', { id });
    set(s => ({
      frames: s.frames.filter(f => f.id !== id),
      selectedIds: new Set(Array.from(s.selectedIds).filter(selectedId => selectedId !== id))
    }));
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

  setGridColumnWidth: (width: number) => {
    const clampedWidth = Math.max(MIN_GRID_SIZE, Math.min(MAX_GRID_SIZE, width));
    logDebug('Setting grid column width', { requested: width, actual: clampedWidth });
    set({ gridColumnWidth: clampedWidth });
  },

  setTargetFrameSize: (size: number) => {
    logDebug('Setting target frame size', { size });
    set({ targetFrameSize: size });
  },

  increaseGridSize: () => {
    set(s => {
      const currentIndex = GRID_SIZE_PRESETS.findIndex(size => size >= s.gridColumnWidth);
      const nextIndex = Math.min(currentIndex + 1, GRID_SIZE_PRESETS.length - 1);
      const newWidth = GRID_SIZE_PRESETS[nextIndex];
      logDebug('Increasing grid size', { from: s.gridColumnWidth, to: newWidth });
      return { gridColumnWidth: newWidth };
    });
  },

  decreaseGridSize: () => {
    set(s => {
      const currentIndex = GRID_SIZE_PRESETS.findIndex(size => size >= s.gridColumnWidth);
      const nextIndex = Math.max(currentIndex - 1, 0);
      const newWidth = GRID_SIZE_PRESETS[nextIndex];
      logDebug('Decreasing grid size', { from: s.gridColumnWidth, to: newWidth });
      return { gridColumnWidth: newWidth };
    });
  },

  selectAll: () => {
    logDebug('Selecting all frames');
    set(s => ({
      selectedIds: new Set(s.frames.map(f => f.id)),
      selectionMode: true
    }));
  },

  clearSelection: () => {
    logDebug('Clearing selection');
    set({
      selectedIds: new Set(),
      selectionMode: false
    });
  },
})); 