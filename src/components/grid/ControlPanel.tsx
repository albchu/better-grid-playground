import React from 'react';
import { IconPlus, IconTrash, IconSelect } from '@tabler/icons-react';
import { useGridStore, GRID_SIZE_PRESETS } from '../../store/grid';
import { useGridActions } from '../../hooks/useGridActions';
import clsx from 'clsx';

export const ControlPanel: React.FC = () => {
  const selectionMode = useGridStore(s => s.selectionMode);
  const selectedCount = useGridStore(s => s.selectedIds.size);
  const gridColumnWidth = useGridStore(s => s.gridColumnWidth);
  const setGridColumnWidth = useGridStore(s => s.setGridColumnWidth);
  const { addFrame, toggleSelectionMode, deleteSelected } = useGridActions();

  return (
    <div className="flex flex-wrap gap-2 p-3 border-b border-gray-700 bg-gray-800 shadow-lg">
      <div className="flex gap-2">
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
          <span className="ml-2 self-center text-sm text-gray-400">
            {selectedCount} selected
          </span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1">
        <span className="text-sm text-gray-400 mr-2 font-medium">Grid Size:</span>
        <div className="flex gap-1 p-1 bg-gray-700 rounded-md">
          {GRID_SIZE_PRESETS.map(size => (
            <button
              key={size}
              onClick={() => setGridColumnWidth(size)}
              className={clsx(
                'px-2.5 py-1 text-sm font-medium rounded transition-all duration-200',
                gridColumnWidth === size
                  ? 'bg-gray-900 text-indigo-400 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-600'
              )}
              title={`Set grid size to ${size}px`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 