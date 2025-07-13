import { Image } from 'image-js';
import { expose } from 'comlink';
import type { ImageSourceResult } from '../types';

// Helper to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = h / 360;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return [
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255)
  ];
}

// Generate a hash from string for consistent randomness
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

async function generateRandomImage(seed: string, maxSize = 1600): Promise<ImageSourceResult> {
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
  
  // Generate deterministic values from seed
  const hash = hashCode(seed);
  const patternType = hash % 6; // 6 different pattern types
  const hue1 = (hash * 137) % 360;
  const hue2 = (hue1 + 120 + (hash % 120)) % 360; // Complementary/triadic color
  const saturation = 60 + (hash % 40); // 60-100% saturation
  
  // Pattern-specific parameters
  const frequency = 20 + (hash % 30);
  const phase = (hash % 100) / 100;
  const rotation = (hash % 4) * 90; // 0, 90, 180, 270 degrees
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let r = 0, g = 0, b = 0, a = 255;
      
      // Normalized coordinates
      const nx = x / width;
      const ny = y / height;
      
      switch (patternType) {
        case 0: { // Gradient waves
          const wave = Math.sin(nx * frequency + phase * Math.PI * 2) * 0.5 + 0.5;
          const lightness = 40 + wave * 40;
          [r, g, b] = hslToRgb(hue1 + wave * 60, saturation, lightness);
          break;
        }
        
        case 1: { // Diagonal stripes
          const diagonal = (x + y) / (width + height);
          const stripe = Math.floor(diagonal * frequency) % 2;
          const color = stripe ? hslToRgb(hue1, saturation, 70) : hslToRgb(hue2, saturation, 50);
          [r, g, b] = color;
          break;
        }
        
        case 2: { // Circular gradient
          const cx = 0.5, cy = 0.5;
          const dist = Math.sqrt(Math.pow(nx - cx, 2) + Math.pow(ny - cy, 2));
          const lightness = 30 + (1 - Math.min(dist * 1.5, 1)) * 50;
          [r, g, b] = hslToRgb(hue1 + dist * 120, saturation, lightness);
          break;
        }
        
        case 3: { // Noise pattern
          const noise1 = Math.sin(x * 0.05 + phase * 100) * Math.cos(y * 0.05 + phase * 50);
          const noise2 = Math.sin((x + y) * 0.03) * Math.cos((x - y) * 0.03);
          const combined = (noise1 + noise2) * 0.5 + 0.5;
          const lightness = 40 + combined * 40;
          [r, g, b] = hslToRgb(hue1 + combined * 60, saturation, lightness);
          break;
        }
        
        case 4: { // Grid pattern
          const gridX = Math.floor(nx * frequency);
          const gridY = Math.floor(ny * frequency);
          const isEven = (gridX + gridY) % 2 === 0;
          const borderX = (nx * frequency) % 1 < 0.1 || (nx * frequency) % 1 > 0.9;
          const borderY = (ny * frequency) % 1 < 0.1 || (ny * frequency) % 1 > 0.9;
          
          if (borderX || borderY) {
            [r, g, b] = hslToRgb(hue2, saturation, 30);
          } else {
            const lightness = isEven ? 65 : 50;
            [r, g, b] = hslToRgb(hue1, saturation, lightness);
          }
          break;
        }
        
        case 5: { // Radial burst
          const angle = Math.atan2(ny - 0.5, nx - 0.5);
          const normalizedAngle = (angle + Math.PI) / (2 * Math.PI);
          const burst = Math.floor(normalizedAngle * frequency) % 2;
          const dist = Math.sqrt(Math.pow(nx - 0.5, 2) + Math.pow(ny - 0.5, 2));
          const lightness = burst ? 60 - dist * 20 : 50 - dist * 20;
          [r, g, b] = hslToRgb(hue1 + normalizedAngle * 60, saturation, Math.max(lightness, 20));
          break;
        }
      }
      
      img.setPixelXY(x, y, [r, g, b, a]);
    }
  }
  
  // Add a subtle border for better visual separation
  const borderColor = hslToRgb(hue1, saturation, 20);
  const borderWidth = 2;
  for (let i = 0; i < borderWidth; i++) {
    for (let x = 0; x < width; x++) {
      img.setPixelXY(x, i, [...borderColor, 255]);
      img.setPixelXY(x, height - 1 - i, [...borderColor, 255]);
    }
    for (let y = 0; y < height; y++) {
      img.setPixelXY(i, y, [...borderColor, 255]);
      img.setPixelXY(width - 1 - i, y, [...borderColor, 255]);
    }
  }
  
  const dataUrl = img.toDataURL('image/png');
  console.log('[ImageWorker] Image generated:', {
    seed,
    patternType,
    hue1,
    hue2,
    dataUrlLength: dataUrl.length,
    dimensions: `${width}x${height}`
  });
  
  return {
    dataUrl,
    width,
    height,
  };
}

expose({ generateRandomImage }); 