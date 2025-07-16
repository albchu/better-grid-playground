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
  
  const img = new Image(width, height);
  
  // Generate deterministic values from seed
  const hash = hashCode(seed);
  const patternType = hash % 8; // 8 different pattern types
  const hue1 = (hash * 137) % 360;
  const hue2 = (hue1 + 120 + (hash % 120)) % 360; // Complementary/triadic color
  const hue3 = (hash * 73) % 360; // Third color for gradients
  const saturation = 60 + (hash % 40); // 60-100% saturation
  
  // Pattern-specific parameters
  const frequency = 10 + (hash % 20); // Reduced frequency for cleaner patterns
  const phase = (hash % 100) / 100;
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let r = 0, g = 0, b = 0, a = 255;
      
      // Normalized coordinates
      const nx = x / width;
      const ny = y / height;
      
      switch (patternType) {
        case 0: { // Smooth gradient waves
          const wave1 = Math.sin(nx * frequency + phase * Math.PI * 2) * 0.5 + 0.5;
          const wave2 = Math.sin(ny * frequency * 0.7 + phase * Math.PI) * 0.3 + 0.5;
          const combined = (wave1 + wave2) / 2;
          const lightness = 30 + combined * 50;
          const hueShift = combined * 30;
          [r, g, b] = hslToRgb(hue1 + hueShift, saturation, lightness);
          break;
        }
        
        case 1: { // Diagonal stripes with gradient
          const diagonal = (x + y) / (width + height);
          const stripe = Math.sin(diagonal * frequency * Math.PI) * 0.5 + 0.5;
          const lightness = 40 + stripe * 40;
          const hue = hue1 + (1 - stripe) * (hue2 - hue1);
          [r, g, b] = hslToRgb(hue, saturation, lightness);
          break;
        }
        
        case 2: { // Circular gradient with rings
          const cx = 0.5, cy = 0.5;
          const dist = Math.sqrt(Math.pow(nx - cx, 2) + Math.pow(ny - cy, 2));
          const ring = Math.sin(dist * frequency * 2) * 0.5 + 0.5;
          const lightness = 30 + (1 - Math.min(dist * 1.5, 1)) * 40 + ring * 10;
          [r, g, b] = hslToRgb(hue1 + dist * 60, saturation, lightness);
          break;
        }
        
        case 3: { // Geometric diamonds pattern
          const dx = Math.abs(nx - 0.5) * 2;
          const dy = Math.abs(ny - 0.5) * 2;
          const diamond = 1 - Math.max(dx, dy);
          const scaled = (diamond * frequency) % 1;
          const bands = Math.floor(scaled * 4) / 4;
          const lightness = 35 + bands * 40;
          const hue = hue1 + (1 - bands) * 60;
          [r, g, b] = hslToRgb(hue, saturation, lightness);
          break;
        }
        
        case 4: { // Improved grid with gradients
          const gridX = nx * frequency;
          const gridY = ny * frequency;
          const cellX = gridX % 1;
          const cellY = gridY % 1;
          const gridIndex = Math.floor(gridX) + Math.floor(gridY);
          const isEven = gridIndex % 2 === 0;
          
          // Create gradient within each cell
          const gradient = (cellX + cellY) / 2;
          const borderProximity = Math.min(cellX, 1 - cellX, cellY, 1 - cellY);
          
          if (borderProximity < 0.1) {
            [r, g, b] = hslToRgb(hue2, saturation, 30);
          } else {
            const baseLightness = isEven ? 60 : 45;
            const lightness = baseLightness + gradient * 15;
            [r, g, b] = hslToRgb(hue1, saturation - gradient * 20, lightness);
          }
          break;
        }
        
        case 5: { // Smooth radial gradient
          const cx = 0.5 + Math.sin(phase * Math.PI * 2) * 0.2;
          const cy = 0.5 + Math.cos(phase * Math.PI * 2) * 0.2;
          const angle = Math.atan2(ny - cy, nx - cx);
          const normalizedAngle = (angle + Math.PI) / (2 * Math.PI);
          const dist = Math.sqrt(Math.pow(nx - cx, 2) + Math.pow(ny - cy, 2));
          
          const spiral = (normalizedAngle * frequency + dist * 3) % 1;
          const lightness = 35 + spiral * 40 - dist * 15;
          const hue = hue1 + normalizedAngle * 90 + dist * 30;
          [r, g, b] = hslToRgb(hue % 360, saturation, Math.max(lightness, 20));
          break;
        }
        
        case 6: { // Sharp diagonal lines (classic stripes)
          const diagonal = (x + y) / (width + height);
          const stripe = Math.floor(diagonal * frequency * 2) % 2;
          const color = stripe ? hslToRgb(hue1, saturation, 70) : hslToRgb(hue2, saturation, 45);
          [r, g, b] = color;
          break;
        }
        
        case 7: { // Multi-color gradient
          // Create smooth transitions between multiple colors
          const gradientPos = nx * ny + (1 - nx) * (1 - ny);
          const wave = Math.sin(gradientPos * Math.PI * 2 + phase * Math.PI) * 0.5 + 0.5;
          
          let hue;
          if (gradientPos < 0.33) {
            hue = hue1 + (hue2 - hue1) * (gradientPos * 3);
          } else if (gradientPos < 0.66) {
            hue = hue2 + (hue3 - hue2) * ((gradientPos - 0.33) * 3);
          } else {
            hue = hue3 + (hue1 - hue3) * ((gradientPos - 0.66) * 3);
          }
          
          const lightness = 35 + wave * 30 + gradientPos * 20;
          const sat = saturation - wave * 20;
          [r, g, b] = hslToRgb(hue % 360, sat, lightness);
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
  
  return {
    dataUrl,
    width,
    height,
  };
}

expose({ generateRandomImage }); 