import { Image } from 'image-js';
import { expose } from 'comlink';

async function generateRandomImage(seed: string, maxSize = 1600) {
  console.log('[ImageWorker] Starting image generation:', { seed, maxSize });
  
  // Common aspect ratios for thorough testing
  const aspectRatios = [
    [1, 1], [4, 3], [16, 9], [9, 16], [2, 1], [1, 2], 
    [3, 4], [Math.random() * 2 + 0.5, 1]
  ];
  
  const selectedRatio = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
  const [w, h] = selectedRatio;
  const scale = maxSize / Math.max(w, h);
  
  const width = Math.floor(w * scale);
  const height = Math.floor(h * scale);
  
  console.log('[ImageWorker] Creating image:', {
    seed,
    selectedRatio,
    dimensions: `${width}x${height}`
  });
  
  const img = new Image(width, height, { kind: 'RGBA' });
  
  // Generate unique pattern based on seed
  const hue = (seed.charCodeAt(0) * 137) % 360;
  
  // Create gradient/pattern for visual distinction
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const intensity = ((x / width) + (y / height)) / 2;
      img.setPixelXY(x, y, [
        Math.floor(intensity * 255),
        Math.floor((1 - intensity) * 255),
        Math.floor(128 + 127 * Math.sin(x / 50)),
        255
      ]);
    }
  }
  
  const dataUrl = img.toDataURL('image/png');
  console.log('[ImageWorker] Image generated:', {
    seed,
    dataUrlLength: dataUrl.length,
    dimensions: `${width}x${height}`
  });
  
  return {
    dataUrl,
    w: width,
    h: height,
  };
}

expose({ generateRandomImage }); 