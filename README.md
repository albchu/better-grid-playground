# Better Grid Playground

A high-performance, responsive masonry grid application built with React 19, TypeScript, and modern web technologies. This playground demonstrates efficient image generation, state management, and smooth animations in a grid layout.

![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-teal)

## Features

- 🎨 **Dynamic Image Generation** - In-browser image generation using `image-js` in Web Workers
- 🧱 **Responsive Masonry Layout** - CSS columns-based layout that adapts to any screen size
- ✨ **Smooth Animations** - CSS transitions for all interactions
- 💾 **Efficient State Management** - Zustand store with Base64 image caching
- 🎯 **CRUD Operations** - Add, select, delete, and refresh frames
- 📊 **Performance Monitoring** - Real-time FPS and memory usage tracking
- 🐛 **Debug Utilities** - Comprehensive logging system with category filtering

## Tech Stack

- **React 19** with TypeScript
- **Vite** for lightning-fast builds
- **Tailwind CSS v3** for styling
- **Zustand** for state management
- **image-js** for image generation
- **Comlink** for Web Worker communication

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/better-grid-playground.git
cd better-grid-playground

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. **Add Frames** - Click "Add Frame" to generate new images
2. **Select Mode** - Click "Select" to enter selection mode
3. **Delete Frames** - Select frames and click "Delete" to remove them
4. **Refresh Images** - Click the refresh icon on any frame to generate a new image
5. **Edit Labels** - Click on frame labels to edit them inline
6. **Toggle Debug** - Use the "Debug: ON/OFF" button to show/hide performance metrics

### Debug Console Commands

Open the browser console and use these commands:

```javascript
bgDebug.help(); // Show all commands
bgDebug.disable(); // Disable all logging
bgDebug.enable(); // Enable all logging
bgDebug.disableCategory('grid'); // Disable specific category
bgDebug.enableCategory('store'); // Enable specific category
bgDebug.showCategories(); // Show all categories status
```

## Project Structure

```
src/
├── components/
│   ├── grid/
│   │   ├── FrameCard.tsx       # Individual frame component
│   │   ├── ControlPanel.tsx    # Action buttons
│   │   └── FramesGrid.tsx      # Grid layout container
│   └── common/
│       ├── Skeleton.tsx        # Loading placeholder
│       ├── EditableLabel.tsx   # Inline editable text
│       └── PerformanceMonitor.tsx # FPS/Memory display
├── contexts/
│   └── ImageSourceContext.tsx  # Image generation provider
├── hooks/
│   └── useGridActions.ts       # Custom hooks for actions
├── services/
│   └── imageSource.ts          # Worker communication
├── store/
│   └── grid.ts                 # Zustand store
├── workers/
│   └── imageWorker.ts          # Image generation worker
├── types/
│   └── index.ts                # TypeScript definitions
└── utils/
    └── debug.ts                # Debug utilities
```

## Performance

- Images are generated off the main thread using Web Workers
- Base64 encoded images are cached in memory for instant redraws
- CSS columns layout provides native browser optimization
- Concurrent image generation limited to 4 to balance speed and memory

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run test     # Run tests
npm run lint     # Run ESLint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built following the comprehensive technical plan in `tech_plan.md`
- Inspired by modern masonry layout requirements
- Designed for testing grid performance with large datasets
