
import { IconRefresh } from "@tabler/icons-react";
import clsx from "clsx";
import type { FrameData } from "../../types";
import { useFrameEditorStore } from "../../store/frameEditor";
import { useGridActions } from "../../hooks/useGridActions";
import { Skeleton } from "../common/Skeleton";
import { EditableLabel } from "../common/EditableLabel";

interface FrameCardProps {
  data: FrameData;
  isCurrent?: boolean;
}

export const FrameCard = ({
  data,
  isCurrent = false,
}: FrameCardProps) => {
  const selectionMode = useFrameEditorStore((s) => s.selectionMode);
  const isSelected = useFrameEditorStore((s) => s.selectedIds.has(data.id));
  const setCurrentFrameId = useFrameEditorStore((s) => s.setCurrentFrameId);
  const { refreshFrameImage, toggleSelect, updateFrame } = useGridActions();



  const handleClick = (e: React.MouseEvent) => {
    if (selectionMode && !e.defaultPrevented) {
      toggleSelect(data.id);
    } else if (!selectionMode && data.imageDataUrl) {
      // Select frame in editor
      setCurrentFrameId(data.id);
    }
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    refreshFrameImage(data.id);
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "frame-card-animated rounded shadow-lg bg-gray-800 overflow-hidden",
        !isCurrent && "hover:shadow-xl hover:cursor-pointer",
        selectionMode && "cursor-pointer",
        isSelected && "ring-4 ring-indigo-500",
        isCurrent && "ring-4 ring-blue-500 shadow-2xl shadow-blue-500/20 current"
      )}
    >
      <div
        style={{ aspectRatio: `${data.width} / ${data.height}` }}
        className="overflow-hidden bg-gray-700"
      >
        {data.imageDataUrl ? (
          <img
            src={data.imageDataUrl}
            alt={data.label}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <Skeleton />
        )}
      </div>

      <footer className="flex items-center justify-between px-2 py-1 text-sm text-gray-300">
        <EditableLabel
          value={data.label}
          onChange={(label) => {
            updateFrame(data.id, { label });
          }}
        />
        <button
          onClick={handleRefresh}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
          title="Generate new image"
        >
          <IconRefresh size={16} />
        </button>
      </footer>
    </div>
  );
};
