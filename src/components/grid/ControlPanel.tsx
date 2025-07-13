import React from 'react';
import { IconPlus, IconTrash, IconSelect, IconZoomIn, IconZoomOut } from '@tabler/icons-react';
import { useGridStore } from '../../store/grid';
import { useGridActions } from '../../hooks/useGridActions';

export const ControlPanel: React.FC = () => {
  const selectionMode = useGridStore(s => s.selectionMode);
  const selectedCount = useGridStore(s => s.selectedIds.size);
  const gridColumnWidth = useGridStore(s => s.gridColumnWidth);
  const increaseGridSize = useGridStore(s => s.increaseGridSize);
  const decreaseGridSize = useGridStore(s => s.decreaseGridSize);
  const { addFrame, toggleSelectionMode, deleteSelected } = useGridActions();

  return (
    <div className="flex gap-2 p-3 border-b bg-white shadow-sm">
      <button onClick={addFrame} className="btn-primary">
        <IconPlus className="mr-1" size={18} stroke={2}/> Add Frame
      </button>

      <button onClick={toggleSelectionMode} className="btn-secondary">
        <IconSelect className="mr-1" size={18} stroke={2}/> 
        {selectionMode ? "Exit Select" : "Select"}
      </button>

      {selectionMode && selectedCount > 0 && (
        <button onClick={deleteSelected} className="btn-danger">
          <IconTrash className="mr-1" size={18} stroke={2}/> 
          Delete ({selectedCount})
        </button>
      )}

      <div className="ml-auto flex items-center gap-2">
        <button 
          onClick={decreaseGridSize} 
          className="btn-icon"
          title="Decrease grid size"
          disabled={gridColumnWidth <= 160}
        >
          <IconZoomOut size={18} stroke={2}/>
        </button>
        
        <span className="text-sm text-gray-600 min-w-[60px] text-center font-medium">
          {gridColumnWidth}px
        </span>
        
        <button 
          onClick={increaseGridSize} 
          className="btn-icon"
          title="Increase grid size"
          disabled={gridColumnWidth >= 420}
        >
          <IconZoomIn size={18} stroke={2}/>
        </button>
      </div>

      {selectionMode && (
        <span className="ml-4 self-center text-sm text-gray-600">
          {selectedCount} selected
        </span>
      )}
    </div>
  );
}; 