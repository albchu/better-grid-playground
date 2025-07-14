import { useState, useEffect } from 'react';
import { ImageSourceProvider } from './contexts/ImageSourceContext';
import { MasonryGrid } from './components/grid/MasonryGrid';
import { ControlPanel } from './components/grid/ControlPanel';
import { PerformanceMonitor } from './components/common/PerformanceMonitor';
import { ImageOverlay } from './components/grid/ImageOverlay';
import { useOverlayStore } from './store/overlay';
import './styles/tailwind.css';

function App() {
  const [showDebug, setShowDebug] = useState(true);
  const overlayState = useOverlayStore();

  // Debug panel toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        setShowDebug(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ImageSourceProvider>
      <div className="min-h-screen bg-neutral-100">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-2">Better Grid Playground</h1>
          
          <ControlPanel />
          
          <MasonryGrid />
        </div>
        
        {showDebug && <PerformanceMonitor />}
        
        {/* Debug overlay state */}
        {showDebug && (
          <div className="fixed top-20 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs font-mono z-40">
            <div>Overlay Visible: {overlayState.isVisible ? 'Yes' : 'No'}</div>
            <div>Current Frame: {overlayState.currentFrameId || 'null'}</div>
            <button 
              onClick={() => overlayState.hideOverlay()}
              className="mt-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
            >
              Hide Overlay
            </button>
          </div>
        )}
        
        {/* Always render overlay - visibility controlled by opacity */}
        <ImageOverlay />
      </div>
    </ImageSourceProvider>
  );
}

export default App; 