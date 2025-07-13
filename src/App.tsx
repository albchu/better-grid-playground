import React, { useState, useEffect } from 'react';
import { ImageSourceProvider } from './contexts/ImageSourceContext';
import { ControlPanel } from './components/grid/ControlPanel';
import { MasonryGrid } from './components/grid/MasonryGrid';
import { PerformanceMonitor } from './components/common/PerformanceMonitor';
import { useGridStore } from './store/grid';

function App() {
  const [showDebug, setShowDebug] = useState(true);
  const increaseGridSize = useGridStore(s => s.increaseGridSize);
  const decreaseGridSize = useGridStore(s => s.decreaseGridSize);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        increaseGridSize();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        decreaseGridSize();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [increaseGridSize, decreaseGridSize]);
  
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
                Press +/- to resize grid
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