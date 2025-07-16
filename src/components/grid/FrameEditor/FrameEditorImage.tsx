import React from 'react';
import type { FrameData } from '../../../types';

interface FrameEditorImageProps {
  frame: FrameData;
  onClick: (e: React.MouseEvent) => void;
}

export const FrameEditorImage = ({
  frame,
  onClick
}: FrameEditorImageProps) => {
  return (
    <div
      key={frame.id}
      className="frame-editor-image-animated relative w-full h-full flex items-center justify-center"
      onClick={onClick}
    >
      <img
        src={frame.imageDataUrl!}
        alt={frame.label}
        className="max-w-full max-h-full w-auto h-auto object-contain shadow-lg"
        style={{ 
          aspectRatio: `${frame.width} / ${frame.height}`,
          maxHeight: 'calc(100% - 2rem)' // Additional safety margin
        }}
      />
    </div>
  );
}; 