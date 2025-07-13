import { wrap } from 'comlink';
import type { ImageSource, ImageSourceResult } from '../types';

// Import worker with ?worker suffix for Vite
import ImageWorker from '../workers/imageWorker?worker&inline';

interface WorkerApi {
  generateRandomImage: (seed: string, maxSize?: number) => Promise<{
    dataUrl: string;
    w: number;
    h: number;
  }>;
}

export class WorkerImageSource implements ImageSource {
  private worker: Worker;
  private workerApi: WorkerApi;
  private queue: Set<string> = new Set();
  private readonly MAX_CONCURRENT = 4;

  constructor() {
    console.log('[ImageSource] Creating worker instance');
    this.worker = new ImageWorker();
    this.workerApi = wrap<WorkerApi>(this.worker);
  }

  async generateImage(id: string): Promise<ImageSourceResult> {
    console.log('[ImageSource] Generate image requested:', { 
      id, 
      queueSize: this.queue.size 
    });
    
    // Wait if queue is full
    while (this.queue.size >= this.MAX_CONCURRENT) {
      console.log('[ImageSource] Queue full, waiting...', { 
        queueSize: this.queue.size,
        maxConcurrent: this.MAX_CONCURRENT 
      });
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.queue.add(id);
    console.log('[ImageSource] Added to queue:', { 
      id, 
      queueSize: this.queue.size 
    });
    
    try {
      const result = await this.workerApi.generateRandomImage(id);
      console.log('[ImageSource] Image generated successfully:', {
        id,
        dimensions: `${result.w}x${result.h}`,
        dataUrlLength: result.dataUrl.length
      });
      
      return {
        dataUrl: result.dataUrl,
        width: result.w,
        height: result.h,
      };
    } catch (error) {
      console.error('[ImageSource] Error generating image:', { id, error });
      throw error;
    } finally {
      this.queue.delete(id);
      console.log('[ImageSource] Removed from queue:', { 
        id, 
        queueSize: this.queue.size 
      });
    }
  }

  dispose() {
    console.log('[ImageSource] Disposing worker');
    this.worker.terminate();
  }
} 