import { ImageSourceProvider } from './contexts/ImageSourceContext';
import { MasonryGrid } from './components/grid/MasonryGrid';
import { ControlPanel } from './components/grid/ControlPanel';
import { PerformanceMonitor } from './components/common/PerformanceMonitor';
import { FrameEditor } from './components/grid/FrameEditor';
import { useDebugPanel } from './hooks/useDebugPanel';
import './styles/tailwind.css';

function App() {
  const debugPanel = useDebugPanel();

  return (
    <ImageSourceProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-2">Better Grid Playground</h1>
          
          <ControlPanel />
        </div>
        
        {/* Main content area with side-by-side layout */}
        <div className="flex h-[calc(100vh-120px)]">
          {/* Left side: MasonryGrid */}
          <div className="flex-1 overflow-y-auto">
            <MasonryGrid />
          </div>
          
          {/* Right side: FrameEditor */}
          <div className="w-1/2 border-l border-gray-700">
            <FrameEditor />
          </div>
        </div>
        
        {debugPanel.isVisible && <PerformanceMonitor />}
      </div>
    </ImageSourceProvider>
  );
}

export default App; 