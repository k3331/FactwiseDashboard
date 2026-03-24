import { useEffect, useRef } from "react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-overlay-in items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md animate-slide-in-up rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <svg width="20" height="20" fill="none" stroke="#dc2626" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
