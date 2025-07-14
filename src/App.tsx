import { useState, useCallback, useRef, useEffect } from 'react';
import { ImageSourceProvider } from './contexts/ImageSourceContext';
import { MasonryGrid } from './components/grid/MasonryGrid';
import { ControlPanel } from './components/grid/ControlPanel';
import { PerformanceMonitor } from './components/common/PerformanceMonitor';
import { FrameEditor } from './components/grid/FrameEditor';
import { useDebugPanel } from './hooks/useDebugPanel';
import './styles/tailwind.css';

function App() {
  const debugPanel = useDebugPanel();
  const [splitPosition, setSplitPosition] = useState(50); // percentage
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Limit between 20% and 80%
    setSplitPosition(Math.min(80, Math.max(20, newPosition)));
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Add global mouse event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <ImageSourceProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-2">Better Grid Playground</h1>
          
          <ControlPanel />
        </div>
        
        {/* Main content area with side-by-side layout */}
        <div ref={containerRef} className="flex h-[calc(100vh-120px)] relative">
          {/* Left side: MasonryGrid */}
          <div 
            className="overflow-y-auto"
            style={{ width: `${splitPosition}%` }}
          >
            <MasonryGrid />
          </div>
          
          {/* Resizable divider */}
          <div
            className="w-1 bg-gray-700 hover:bg-gray-600 cursor-col-resize relative group"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-blue-500/20" />
          </div>
          
          {/* Right side: FrameEditor */}
          <div 
            className="overflow-hidden"
            style={{ width: `${100 - splitPosition}%` }}
          >
            <FrameEditor />
          </div>
        </div>
        
        {debugPanel.isVisible && <PerformanceMonitor />}
      </div>
    </ImageSourceProvider>
  );
}

export default App; 