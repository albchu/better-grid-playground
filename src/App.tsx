import React, { useState, useEffect } from 'react';
import { ImageSourceProvider } from './contexts/ImageSourceContext';
import { ControlPanel } from './components/grid/ControlPanel';
import { MasonryGrid } from './components/grid/MasonryGrid';
import { PerformanceMonitor } from './components/common/PerformanceMonitor';
import { useGridStore, GRID_SIZE_PRESETS } from './store/grid';

function App() {
  const [showDebug, setShowDebug] = useState(true);
  const gridColumnWidth = useGridStore(s => s.gridColumnWidth);
  const setGridColumnWidth = useGridStore(s => s.setGridColumnWidth);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      const currentIndex = GRID_SIZE_PRESETS.indexOf(gridColumnWidth);
      
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        if (currentIndex < GRID_SIZE_PRESETS.length - 1) {
          setGridColumnWidth(GRID_SIZE_PRESETS[currentIndex + 1]);
        }
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        if (currentIndex > 0) {
          setGridColumnWidth(GRID_SIZE_PRESETS[currentIndex - 1]);
        }
      } else if (e.key >= '1' && e.key <= '7') {
        // Number keys 1-7 for direct size selection
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        if (index < GRID_SIZE_PRESETS.length) {
          setGridColumnWidth(GRID_SIZE_PRESETS[index]);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gridColumnWidth, setGridColumnWidth]);
  
  return (
    <ImageSourceProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-full px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              Better Grid Playground
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">
                Press +/- to resize • 1-7 for sizes
              </span>
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Debug: {showDebug ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </header>
        
        <ControlPanel />
        
        <main className="w-full">
          <MasonryGrid />
        </main>
        
        {showDebug && <PerformanceMonitor />}
      </div>
    </ImageSourceProvider>
  );
}

export default App; 