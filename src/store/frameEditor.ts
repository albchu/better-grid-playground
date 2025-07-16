import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { FrameData, ImageSource } from '../types';

interface FrameEditorStore {
  // Frame data
  frames: FrameData[];
  gridColumnWidth: number;
  targetFrameSize: number;
  selectionMode: boolean;
  selectedIds: Set<string>;

  // Editor state
  currentFrameId: string | null;

  // Frame actions
  addFrame: (imageSource: ImageSource) => Promise<void>;
  refreshFrameImage: (id: string, imageSource: ImageSource) => Promise<void>;
  removeFrame: (id: string) => void;
  updateFrame: (id: string, updates: Partial<FrameData>) => void;

  // Grid actions
  setGridColumnWidth: (width: number) => void;
  setTargetFrameSize: (size: number) => void;
  increaseGridSize: () => void;
  decreaseGridSize: () => void;

  // Selection actions
  toggleSelectionMode: () => void;
  toggleSelect: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  deleteSelected: () => void;

  // Editor actions
  setCurrentFrameId: (frameId: string | null) => void;
}

// Grid size presets
export const GRID_SIZE_PRESETS = [120, 160, 200, 240, 300, 360, 420];
const MIN_GRID_SIZE = 120;
const MAX_GRID_SIZE = 420;

export const useFrameEditorStore = create<FrameEditorStore>((set, get) => ({
  // Initial state
  frames: [],
  gridColumnWidth: 240,
  targetFrameSize: 1,
  selectionMode: false,
  selectedIds: new Set<string>(),
  currentFrameId: null,

  // Frame actions
  addFrame: async (imageSource: ImageSource) => {
    const id = uuidv4();

    set((s) => ({
      frames: [
        ...s.frames,
        {
          id,
          width: 1,
          height: 1,
          label: `Frame ${id.slice(0, 4)}`,
          imageDataUrl: null,
        },
      ],
    }));

    try {
      const { dataUrl, width, height } = await imageSource.generateImage(id);

      set((s) => ({
        frames: s.frames.map((f) =>
          f.id === id ? { ...f, imageDataUrl: dataUrl, width, height } : f
        ),
      }));
    } catch (_error) {
      // Handle error silently
    }
  },

  refreshFrameImage: async (id: string, imageSource: ImageSource) => {
    try {
      const { dataUrl, width, height } = await imageSource.generateImage(id);

      set((s) => ({
        frames: s.frames.map((f) =>
          f.id === id ? { ...f, imageDataUrl: dataUrl, width, height } : f
        ),
      }));
    } catch (_error) {
      // Handle error silently
    }
  },

  removeFrame: (id: string) => {
    set((s) => ({
      frames: s.frames.filter((f) => f.id !== id),
      selectedIds: new Set(Array.from(s.selectedIds).filter((selectedId) => selectedId !== id)),
      currentFrameId: s.currentFrameId === id ? null : s.currentFrameId,
    }));
  },

  updateFrame: (id: string, updates: Partial<FrameData>) => {
    set((s) => ({
      frames: s.frames.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }));
  },

  // Grid actions
  setGridColumnWidth: (width: number) => {
    const clampedWidth = Math.max(MIN_GRID_SIZE, Math.min(MAX_GRID_SIZE, width));
    set({ gridColumnWidth: clampedWidth });
  },

  setTargetFrameSize: (size: number) => {
    set({ targetFrameSize: size });
  },

  increaseGridSize: () => {
    set((s) => {
      const currentIndex = GRID_SIZE_PRESETS.findIndex((size) => size >= s.gridColumnWidth);
      const nextIndex = Math.min(currentIndex + 1, GRID_SIZE_PRESETS.length - 1);
      const newWidth = GRID_SIZE_PRESETS[nextIndex];
      return { gridColumnWidth: newWidth };
    });
  },

  decreaseGridSize: () => {
    set((s) => {
      const currentIndex = GRID_SIZE_PRESETS.findIndex((size) => size >= s.gridColumnWidth);
      const nextIndex = Math.max(currentIndex - 1, 0);
      const newWidth = GRID_SIZE_PRESETS[nextIndex];
      return { gridColumnWidth: newWidth };
    });
  },

  // Selection actions
  toggleSelectionMode: () => {
    set((s) => ({
      selectionMode: !s.selectionMode,
      selectedIds: new Set(),
    }));
  },

  toggleSelect: (id: string) => {
    set((s) => {
      const setIds = new Set(s.selectedIds);
      const wasSelected = setIds.has(id);

      if (wasSelected) {
        setIds.delete(id);
      } else {
        setIds.add(id);
      }

      return { selectedIds: setIds };
    });
  },

  selectAll: () => {
    set((s) => ({
      selectedIds: new Set(s.frames.map((f) => f.id)),
      selectionMode: true,
    }));
  },

  clearSelection: () => {
    set({
      selectedIds: new Set(),
      selectionMode: false,
    });
  },

  deleteSelected: () => {
    set((s) => {
      return {
        frames: s.frames.filter((f) => !s.selectedIds.has(f.id)),
        selectedIds: new Set(),
        selectionMode: false,
        currentFrameId: s.selectedIds.has(s.currentFrameId || '') ? null : s.currentFrameId,
      };
    });
  },

  // Editor actions
  setCurrentFrameId: (frameId) => {
    const currentState = get();

    // Don't update if it's the same frame
    if (currentState.currentFrameId === frameId) {
      return;
    }

    // Validate that the frame exists
    if (frameId !== null) {
      const frameExists = currentState.frames.some(
        (f) => f.id === frameId && f.imageDataUrl !== null
      );

      if (!frameExists) {
        return;
      }
    }

    set({ currentFrameId: frameId });
  },
}));
