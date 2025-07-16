import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ImageSource } from '../types';
import { WorkerImageSource } from '../services/imageSource';

const ImageSourceContext = createContext<ImageSource | null>(null);

export const useImageSource = () => {
  const context = useContext(ImageSourceContext);
  if (!context) {
    throw new Error('useImageSource must be used within ImageSourceProvider');
  }
  return context;
};

interface ImageSourceProviderProps {
  children: React.ReactNode;
}

export const ImageSourceProvider = ({ children }: ImageSourceProviderProps) => {
  const [imageSource, setImageSource] = useState<WorkerImageSource | null>(null);

  useEffect(() => {
    const source = new WorkerImageSource();
    setImageSource(source);
    
    return () => {
      source.dispose();
    };
  }, []);

  if (!imageSource) {
    return null;
  }

  return (
    <ImageSourceContext.Provider value={imageSource}>
      {children}
    </ImageSourceContext.Provider>
  );
}; 