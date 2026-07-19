import { useEffect, useRef, useState } from "react";
import { t } from "../../../lib/i18n";

interface Props {
  onClose: () => void;
  onAdd: (domain: string) => Promise<void>;
}

export function AddSiteModal({ onClose, onAdd }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onAdd(value.trim());
      onClose();
    } catch {
      setError(t("addSite.invalid"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <h2>Add website</h2>
        <p>{t("addSite.help")}</p>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="example.com/path"
          spellCheck={false}
        />
        {error && (
          <p style={{ color: "var(--danger)", marginTop: 10 }}>{error}</p>
        )}
        <div className="modal__actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={busy || !value}>
            Add & Pin
          </button>
        </div>
      </form>
    </div>
  );
}
