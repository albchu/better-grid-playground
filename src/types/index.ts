export interface FrameData {
  id: string;                  // uuid v4
  width: number;               // generated image width (px)
  height: number;              // generated image height (px)
  label: string;
  imageSrcUrl: string;         // identifier like "generated:${id}"
  imageDataUrl: string | null; // Base-64 PNG returned by worker
}

export interface ImageSourceResult {
  dataUrl: string;
  width: number;
  height: number;
}

export interface ImageSource {
  generateImage(id: string): Promise<ImageSourceResult>;
} 