import { useCallback } from 'react';
import { useFrameEditorStore } from '../store/frameEditor';
import { useImageSource } from '../contexts/ImageSourceContext';

export const useGridActions = () => {
  const imageSource = useImageSource();
  const store = useFrameEditorStore();

  const addFrame = useCallback(() => {
    return store.addFrame(imageSource);
  }, [store, imageSource]);

  const refreshFrameImage = useCallback(
    (id: string) => {
      return store.refreshFrameImage(id, imageSource);
    },
    [store, imageSource]
  );

  return {
    addFrame,
    refreshFrameImage,
    updateFrame: store.updateFrame,
    toggleSelectionMode: store.toggleSelectionMode,
    toggleSelect: store.toggleSelect,
    deleteSelected: store.deleteSelected,
  };
};
