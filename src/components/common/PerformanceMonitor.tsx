import React, { useState, useEffect } from 'react';
import { useGridStore } from '../../store/grid';

export const PerformanceMonitor: React.FC = () => {
  const [fps, setFps] = useState(0);
  const [renderTime, setRenderTime] = useState(0);
  const frames = useGridStore(s => s.frames);
  const gridColumnWidth = useGridStore(s => s.gridColumnWidth);
  
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;
    
    const measureFPS = () => {
      const currentTime = performance.now();
      frameCount++;
      
      // Update FPS every second
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };
    
    animationId = requestAnimationFrame(measureFPS);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  useEffect(() => {
    const startTime = performance.now();
    // This will trigger after render
    requestAnimationFrame(() => {
      setRenderTime(Math.round(performance.now() - startTime));
    });
  }, [frames]);
  
  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono">
      <div>FPS: {fps}</div>
      <div>Frames: {frames.length}</div>
      <div>Grid: {gridColumnWidth}px</div>
      <div>Last render: {renderTime}ms</div>
      <div>Memory: {
        performance.memory
          ? `${Math.round(performance.memory.usedJSHeapSize / 1048576)}MB`
          : 'N/A'
      }</div>
    </div>
  );
}; 