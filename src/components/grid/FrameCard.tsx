import React, { useEffect } from "react";
import { IconRefresh } from "@tabler/icons-react";
import clsx from "clsx";
import type { FrameData } from "../../types";
import { useGridStore } from "../../store/grid";
import { useFrameEditorStore } from "../../store/frameEditor";
import { useGridActions } from "../../hooks/useGridActions";
import { Skeleton } from "../common/Skeleton";
import { EditableLabel } from "../common/EditableLabel";

interface FrameCardProps {
  data: FrameData;
  isCurrent?: boolean;
}

export const FrameCard: React.FC<FrameCardProps> = ({
  data,
  isCurrent = false,
}) => {
  const selectionMode = useGridStore((s) => s.selectionMode);
  const isSelected = useGridStore((s) => s.selectedIds.has(data.id));
  const setCurrentFrameId = useFrameEditorStore((s) => s.setCurrentFrameId);
  const { refreshFrameImage, toggleSelect, updateFrame } = useGridActions();

  useEffect(() => {
    console.log("[FrameCard] Mounted:", {
      id: data.id,
      hasImage: !!data.imageDataUrl,
    });

    return () => {
      console.log("[FrameCard] Unmounted:", { id: data.id });
    };
  }, [data.id]);

  const handleClick = (e: React.MouseEvent) => {
    if (selectionMode && !e.defaultPrevented) {
      console.log("[FrameCard] Clicked in selection mode:", { id: data.id });
      toggleSelect(data.id);
    } else if (!selectionMode && data.imageDataUrl) {
      // Select frame in editor
      console.log("[FrameCard] Selecting frame in editor:", { id: data.id });
      setCurrentFrameId(data.id);
    }
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("[FrameCard] Refresh requested:", { id: data.id });
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
            onLoad={() =>
              console.log("[FrameCard] Image loaded:", { id: data.id })
            }
            onError={() =>
              console.error("[FrameCard] Image failed to load:", {
                id: data.id,
              })
            }
          />
        ) : (
          <Skeleton />
        )}
      </div>

      <footer className="flex items-center justify-between px-2 py-1 text-sm text-gray-300">
        <EditableLabel
          value={data.label}
          onChange={(label) => {
            console.log("[FrameCard] Label changed:", {
              id: data.id,
              newLabel: label,
            });
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
