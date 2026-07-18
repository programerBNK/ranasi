import { useEffect, useRef } from "react";
import type { SiteEntry } from "../../../lib/types";

interface Props {
  x: number;
  y: number;
  site: SiteEntry;
  onClose: () => void;
  onPin: () => void;
  onRemove: () => void;
  onOpen: () => void;
}

export function ContextMenu({
  x,
  y,
  site,
  onClose,
  onPin,
  onRemove,
  onOpen,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [onClose]);

  const maxX = typeof window !== "undefined" ? window.innerWidth - 200 : x;
  const maxY = typeof window !== "undefined" ? window.innerHeight - 160 : y;

  return (
    <div
      ref={ref}
      className="context-menu"
      style={{ left: Math.min(x, maxX), top: Math.min(y, maxY) }}
      role="menu"
    >
      <button type="button" onClick={onOpen}>
        Open
      </button>
      <button type="button" onClick={onPin}>
        {site.pinned ? "Unpin" : "Pin to Desktop"}
      </button>
      <button type="button" className="danger" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}
