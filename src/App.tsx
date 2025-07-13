import React, { useState } from 'react';
import { ImageSourceProvider } from './contexts/ImageSourceContext';
import { ControlPanel } from './components/grid/ControlPanel';
import { MasonryGrid } from './components/grid/MasonryGrid';
import { PerformanceMonitor } from './components/common/PerformanceMonitor';

function App() {
  const [showDebug, setShowDebug] = useState(true);
  
  return (
    <ImageSourceProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-full px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              Better Grid Playground
            </h1>
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Debug: {showDebug ? 'ON' : 'OFF'}
            </button>
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