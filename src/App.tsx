import { ImageSourceProvider } from './contexts/ImageSourceContext';
import { MasonryGrid } from './components/grid/MasonryGrid';
import { ControlPanel } from './components/grid/ControlPanel';
import { PerformanceMonitor } from './components/common/PerformanceMonitor';
import { FrameEditor } from './components/grid/FrameEditor';
import { useFrameEditorStore } from './store/frameEditor';
import { useDebugPanel } from './hooks/useDebugPanel';
import './styles/tailwind.css';

function App() {
  const debugPanel = useDebugPanel();
  const frameEditorState = useFrameEditorStore();

  return (
    <ImageSourceProvider>
      <div className="min-h-screen bg-neutral-100">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-2">Better Grid Playground</h1>
          
          <ControlPanel />
          
          <MasonryGrid />
        </div>
        
        {debugPanel.isVisible && <PerformanceMonitor />}
        
        {/* Debug frame editor state */}
        {debugPanel.isVisible && (
          <div className="fixed top-20 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs font-mono z-40">
            <div>Frame Editor Visible: {frameEditorState.isVisible ? 'Yes' : 'No'}</div>
            <div>Current Frame: {frameEditorState.currentFrameId || 'null'}</div>
            <button 
              onClick={() => frameEditorState.hideFrameEditor()}
              className="mt-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
            >
              Hide Frame Editor
            </button>
          </div>
        )}
        
        {/* Always render frame editor - visibility controlled by isVisible check */}
        <FrameEditor />
      </div>
    </ImageSourceProvider>
  );
}

export default App; 