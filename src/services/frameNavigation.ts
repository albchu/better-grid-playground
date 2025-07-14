import type { FrameData } from '../types';

export class FrameNavigationService {
  /**
   * Get frames that have images loaded
   */
  static getFramesWithImages(frames: FrameData[]): FrameData[] {
    return frames.filter(f => f.imageDataUrl !== null);
  }

  /**
   * Find the index of a frame by ID
   */
  static findFrameIndex(frames: FrameData[], frameId: string): number {
    return frames.findIndex(f => f.id === frameId);
  }

  /**
   * Get the previous frame with an image
   */
  static getPreviousFrame(frames: FrameData[], currentFrameId: string): FrameData | null {
    const framesWithImages = this.getFramesWithImages(frames);
    const currentIndex = this.findFrameIndex(framesWithImages, currentFrameId);
    
    if (currentIndex > 0) {
      return framesWithImages[currentIndex - 1];
    }
    return null;
  }

  /**
   * Get the next frame with an image
   */
  static getNextFrame(frames: FrameData[], currentFrameId: string): FrameData | null {
    const framesWithImages = this.getFramesWithImages(frames);
    const currentIndex = this.findFrameIndex(framesWithImages, currentFrameId);
    
    if (currentIndex !== -1 && currentIndex < framesWithImages.length - 1) {
      return framesWithImages[currentIndex + 1];
    }
    return null;
  }

  /**
   * Check if navigation is possible
   */
  static canNavigate(frames: FrameData[], currentFrameId: string): {
    canGoPrevious: boolean;
    canGoNext: boolean;
  } {
    const framesWithImages = this.getFramesWithImages(frames);
    const currentIndex = this.findFrameIndex(framesWithImages, currentFrameId);
    
    return {
      canGoPrevious: currentIndex > 0,
      canGoNext: currentIndex !== -1 && currentIndex < framesWithImages.length - 1
    };
  }

  /**
   * Get adjacent frames for carousel display
   */
  static getAdjacentFrames(
    frames: FrameData[], 
    currentFrameId: string, 
    count: number = 3
  ): FrameData[] {
    const framesWithImages = this.getFramesWithImages(frames);
    const currentIndex = this.findFrameIndex(framesWithImages, currentFrameId);
    
    if (currentIndex === -1) return [];
    
    const startIndex = Math.max(0, currentIndex - count);
    const endIndex = Math.min(framesWithImages.length, currentIndex + count + 1);
    
    return framesWithImages.slice(startIndex, endIndex);
  }
} 