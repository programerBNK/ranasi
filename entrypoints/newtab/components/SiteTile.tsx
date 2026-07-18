import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SiteEntry } from "../../../lib/types";

interface Props {
  site: SiteEntry;
  onOpen: (site: SiteEntry) => void;
  onContextMenu: (e: React.MouseEvent, site: SiteEntry) => void;
}

export function SiteTile({ site, onOpen, onContextMenu }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: site.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      className={`site-tile${isDragging ? " is-dragging" : ""}`}
      onClick={() => {
        if (!isDragging) onOpen(site);
      }}
      onContextMenu={(e) => onContextMenu(e, site)}
      {...attributes}
      {...listeners}
    >
      <span className="site-tile__face">
        <img
          src={site.favicon}
          alt=""
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              `https://www.google.com/s2/favicons?domain=${site.domain}&sz=64`;
          }}
        />
        {site.pinned && (
          <span className="site-tile__pin" title="Pinned" aria-label="Pinned">
            ●
          </span>
        )}
      </span>
      <span className="site-tile__label">{site.title}</span>
    </button>
  );
}

export function AddTile({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="site-tile site-tile--add" onClick={onClick}>
      <span className="site-tile__face">+</span>
      <span className="site-tile__label">Add</span>
    </button>
  );
}
