import { wrap } from 'comlink';
import type { ImageSource, ImageSourceResult } from '../types';

// Import worker with ?worker suffix for Vite
import ImageWorker from '../workers/imageWorker?worker&inline';

interface WorkerApi {
  generateRandomImage: (seed: string, maxSize?: number) => Promise<ImageSourceResult>;
}

export class WorkerImageSource implements ImageSource {
  private worker: Worker;
  private workerApi: WorkerApi;
  private queue: Set<string> = new Set();
  private readonly MAX_CONCURRENT = 4;

  constructor() {
    this.worker = new ImageWorker();
    this.workerApi = wrap<WorkerApi>(this.worker);
  }

  async generateImage(id: string): Promise<ImageSourceResult> {
    // Wait if queue is full
    while (this.queue.size >= this.MAX_CONCURRENT) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.queue.add(id);

    try {
      const result = await this.workerApi.generateRandomImage(id);
      return result;
    } finally {
      this.queue.delete(id);
    }
  }

  dispose() {
    this.worker.terminate();
  }
}
