### **better-grid-playground — complete technical plan (rev 5)**

(_Tailwind + CSS columns masonry, CSS animations, in-browser `image-js` generated images → Base-64 pipeline, and **Tabler Icons** for all glyphs._)

---

## 1 · Project goals

1. Display a responsive masonry grid of **`FrameCard`** items that always respect each card's true aspect ratio.
2. Let users **add**, **delete**, **select** and **refresh (new image)** cards; every layout change animates smoothly via CSS animations.
3. Every card image is generated using **image-js in a Web Worker**, encoded to a PNG **Base-64 data URI**, stored in Zustand, and rendered from memory for instant redraws.
4. Grid automatically reflows when browser window is resized to test layout responsiveness.
5. All UI icons (add, delete, select, refresh, etc.) come from **Tabler Icons** (`@tabler/icons-react`).

---

## 2 · Core stack & tooling

| Concern          | Library / tech                                              | Reason / notes                                                                     |
| ---------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Grid layout      | **CSS columns**                                             | Native CSS masonry layout using column-count, column-width, and break-inside-avoid |
| Layout animation | **CSS animations**                                          | Native CSS transitions and keyframes for smooth animations                         |
| Global state     | **Zustand**                                                 | Selector-based subscriptions; holds Base-64 strings in memory for snappy re-use    |
| Styling          | **Tailwind CSS v3**                                         | Utility classes; dynamic aspect ratio via inline style                             |
| Icons            | **Tabler Icons** (`@tabler/icons-react`)                    | Feather-weight, consistent stroke icons                                            |
| Image generation | **`image-js`**                                              | Generates test images with varied aspect ratios; runs in Web Worker                |
| Build            | Vite + TypeScript + ESLint + Prettier + Vitest + Playwright | Worker bundling via `?worker&inline`                                               |

```bash
npm i zustand @tabler/icons-react image-js comlink tailwindcss @types/uuid
```

---

## 3 · Data model

```ts
export interface FrameData {
  id: string; // uuid v4
  width: number; // generated image width (px)
  height: number; // generated image height (px)
  label: string;
  imageSrcUrl: string; // identifier like "generated:${id}"
  imageDataUrl: string | null; // Base-64 PNG returned by worker
}
```

---

## 4 · High-level component tree

```
<App>
 ├─ <ImageSourceProvider>    // Provides abstracted image generation
 │   ├─ <ControlPanel/>      // Tabler icons inside buttons
 │   └─ <FramesGrid>
 │       ├─ <FrameCard id=.../>
 │       └─ ...
 └─ </ImageSourceProvider>
```

- `<FramesGrid>` uses CSS columns for masonry layout; `<FrameCard>` uses CSS animations for transitions.
- Browser window resize triggers automatic grid reflow for testing.

---

## 5 · Aspect-ratio handling

Dynamic aspect ratios set via inline style:

```tsx
<div
  style={{ aspectRatio: `${data.width} / ${data.height}` }}
  className="overflow-hidden bg-neutral-200 rounded"
>
  …
</div>
```

---

## 6 · Image generation pipeline (abstracted)

### Image Source Interface

```ts
// services/imageSource.ts
export interface ImageSourceResult {
  dataUrl: string;
  width: number;
  height: number;
}

export interface ImageSource {
  generateImage(id: string): Promise<ImageSourceResult>;
}
```

### Worker Implementation

`workers/imageWorker.ts`

```ts
import { Image } from 'image-js';
import { expose } from 'comlink';

async function generateRandomImage(seed: string, maxSize = 1600) {
  // Common aspect ratios for thorough testing
  const aspectRatios = [
    [1, 1],
    [4, 3],
    [16, 9],
    [9, 16],
    [2, 1],
    [1, 2],
    [3, 4],
    [Math.random() * 2 + 0.5, 1],
  ];

  const [w, h] = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
  const scale = maxSize / Math.max(w, h);

  const width = Math.floor(w * scale);
  const height = Math.floor(h * scale);
  const img = new Image(width, height, { kind: 'RGBA' });

  // Generate unique pattern based on seed
  const hue = (seed.charCodeAt(0) * 137) % 360;

  // Create gradient/pattern for visual distinction
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const intensity = (x / width + y / height) / 2;
      img.setPixelXY(x, y, [
        Math.floor(intensity * 255),
        Math.floor((1 - intensity) * 255),
        Math.floor(128 + 127 * Math.sin(x / 50)),
        255,
      ]);
    }
  }

  return {
    dataUrl: img.toDataURL('image/png'),
    w: width,
    h: height,
  };
}

expose({ generateRandomImage });
```

_Main thread keeps a queue of **max 4** concurrent requests to avoid memory spikes._

---

## 7 · Zustand store with dependency injection

```ts
const useGridStore = create<GridState>()((set) => ({
  frames: [],
  selectionMode: false,
  selectedIds: new Set<string>(),

  addFrame: async (imageSource: ImageSource) => {
    const id = uuidv4();
    set((s) => ({
      frames: [
        ...s.frames,
        {
          id,
          width: 1,
          height: 1,
          label: `Frame ${id.slice(0, 4)}`,
          imageSrcUrl: `generated:${id}`,
          imageDataUrl: null,
        },
      ],
    }));

    const { dataUrl, width, height } = await imageSource.generateImage(id);
    set((s) => ({
      frames: s.frames.map((f) =>
        f.id === id ? { ...f, imageDataUrl: dataUrl, width, height } : f
      ),
    }));
  },

  refreshFrameImage: async (id: string, imageSource: ImageSource) => {
    const { dataUrl, width, height } = await imageSource.generateImage(id);
    set((s) => ({
      frames: s.frames.map((f) =>
        f.id === id ? { ...f, imageDataUrl: dataUrl, width, height } : f
      ),
    }));
  },

  toggleSelectionMode: () =>
    set((s) => ({ selectionMode: !s.selectionMode, selectedIds: new Set() })),

  toggleSelect: (id) =>
    set((s) => {
      const setIds = new Set(s.selectedIds);
      setIds.has(id) ? setIds.delete(id) : setIds.add(id);
      return { selectedIds: setIds };
    }),

  deleteSelected: () =>
    set((s) => ({
      frames: s.frames.filter((f) => !s.selectedIds.has(f.id)),
      selectedIds: new Set(),
      selectionMode: false,
    })),
}));
```

---

## 8 · Component sketches

### `FrameCard.tsx`

```tsx
import { IconRefresh } from '@tabler/icons-react';

const FrameCard: React.FC<{ data: FrameData }> = ({ data }) => {
  const { selectionMode, toggleSelect } = useGridStore();
  const { refreshFrameImage } = useGridActions();

  return (
    <div
      onClick={() => selectionMode && toggleSelect(data.id)}
      className={clsx(
        'rounded shadow bg-white',
        selectionMode && 'cursor-pointer ring-2 ring-indigo-500/50'
      )}
    >
      <div
        style={{ aspectRatio: `${data.width} / ${data.height}` }}
        className="overflow-hidden bg-neutral-200"
      >
        {data.imageDataUrl ? (
          <img
            src={data.imageDataUrl}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <Skeleton />
        )}
      </div>

      <footer className="flex items-center justify-between px-2 py-1 text-sm text-gray-600">
        <EditableLabel value={data.label} onChange={(label) => updateFrame(data.id, { label })} />
        <button
          onClick={() => refreshFrameImage(data.id)}
          className="p-1 hover:bg-gray-100 rounded"
          title="Generate new image"
        >
          <IconRefresh size={16} />
        </button>
      </footer>
    </div>
  );
};
```

### `ControlPanel.tsx`

```tsx
import { IconPlus, IconTrash, IconSelect } from '@tabler/icons-react';

const ControlPanel = () => {
  const { selectionMode, toggleSelectionMode } = useGridStore();
  const { addFrame, deleteSelected } = useGridActions();

  return (
    <div className="flex gap-2 p-3 border-b bg-white">
      <button onClick={addFrame} className="btn-primary">
        <IconPlus className="mr-1" size={18} /> Add
      </button>

      <button onClick={toggleSelectionMode} className="btn-secondary">
        <IconSelect className="mr-1" size={18} />
        {selectionMode ? 'Exit Select' : 'Select'}
      </button>

      {selectionMode && (
        <button onClick={deleteSelected} className="btn-danger">
          <IconTrash className="mr-1" size={18} /> Delete
        </button>
      )}
    </div>
  );
};
```

---

## 9 · Performance & memory

- **All PNG Base-64 strings persist in Zustand** → instant repaint when items remount.
- One worker with image-js generates images off main thread; queue length 4 balances speed & RAM.
- CSS columns provides native browser optimization for masonry layout.
- Inline `aspect-ratio` eliminates CLS.
- Generated images allow precise control over dimensions for stress testing.

---

## 10 · Testing matrix

| Layer     | Tool                  | Scenario                                             |
| --------- | --------------------- | ---------------------------------------------------- |
| Unit      | Vitest                | `generateRandomImage` → PNG data URI & dimensions    |
| Component | React Testing Library | `FrameCard` swaps skeleton → `<img>`                 |
| E2E       | Playwright            | Add 100 frames, scroll, bulk-delete: verify ≥ 55 fps |
| Memory    | Chrome DevTools       | Heap ≤ 400 MB after 100 × 1600 px PNGs               |

---

## 11 · Folder outline

```
src/
  components/
    grid/
      FrameCard.tsx
      ControlPanel.tsx
      FramesGrid.tsx
    common/
      Skeleton.tsx
      EditableLabel.tsx
  contexts/
    ImageSourceContext.tsx
  hooks/
    useGridActions.ts
  services/
    imageSource.ts
  store/
    grid.ts
  workers/
    imageWorker.ts
  styles/
    tailwind.css
```

---

### **Summary**

The plan now generates test images directly using **image-js** in a worker, removing external dependencies. The image source is abstracted behind an interface for future portability. Users can refresh individual card images to test different aspect ratios, and the grid reflows automatically on browser resize. All functionality remains focused on testing grid performance with large base64-encoded images stored in memory.

---

## 11 · Additional implementation notes

### Package versions

All packages mentioned are current as of January 2025:

- CSS columns layout - Native browser support
- ~~`framer-motion@11.15.0`~~ - Removed, using CSS animations instead
- `react@19.0.0` & `react-dom@19.0.0` - Latest React 19
- `zustand@5.0.2` - Latest v5
- `@tabler/icons-react@3.26.0` - Latest version
- `tailwindcss@4.1.11` - Latest v4
- `vite@6.0.7` - Latest v6
- `image-js@0.37.0` - Latest stable
- `comlink@4.4.2` - Latest version
- `uuid@11.1.0` - Latest v11 (includes TypeScript types)

### Key implementation details

1. **Web Worker setup**: The `comlink` package simplifies Web Worker communication. The worker file should be placed in `src/workers/` and imported with the `?worker` suffix in Vite.

2. **Image generation**: Use `image-js` methods like:

   ```javascript
   const image = new Image(width, height);
   // Fill with gradient or pattern
   image.fillColor(color);
   // Or create more complex patterns
   ```

3. **CSS columns configuration**: The CSS columns layout requires:
   - Setting `column-count: auto` and `column-width` for responsive columns
   - Using `break-inside-avoid` on items to prevent splitting across columns
   - Dynamic `column-gap` for spacing between columns
4. **Zustand store typing**: Define proper TypeScript interfaces:

   ```typescript
   interface Frame {
     id: string;
     dataUrl: string;
     width: number;
     height: number;
     selected: boolean;
   }
   ```

5. **CSS animations**: Use CSS transitions and keyframes for smooth animations. The animations are defined in `tailwind.css` with custom keyframes for fadeIn, springIn, slideUp, etc.

### Performance considerations

- The Web Worker prevents UI blocking during image generation
- Base64 data URLs are stored in memory - consider implementing a maximum frame limit
- CSS columns layout automatically handles responsive reflow
- Use React.memo() on FrameCard to prevent unnecessary re-renders

This document now contains all necessary details for a fresh implementation.
