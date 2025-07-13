import React from 'react';
import { IconPlus, IconTrash, IconSelect } from '@tabler/icons-react';
import { useGridStore } from '../../store/grid';
import { useGridActions } from '../../hooks/useGridActions';

export const ControlPanel: React.FC = () => {
  const selectionMode = useGridStore(s => s.selectionMode);
  const selectedCount = useGridStore(s => s.selectedIds.size);
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

      {selectionMode && (
        <span className="ml-auto self-center text-sm text-gray-600">
          {selectedCount} selected
        </span>
      )}
    </div>
  );
}; 