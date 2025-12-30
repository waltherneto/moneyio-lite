// [MONEYIO-MODAL-001]
import { useEffect } from "react";

type ModalProps = {
  title?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ title, open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    // lock scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Modal"}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Fechar"
        className="absolute inset-0 cursor-default bg-black/50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative mx-auto mt-16 w-[92%] max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h3 className="text-base font-semibold">{title ?? "Modal"}</h3>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
            onClick={onClose}
          >
            Esc
          </button>
        </div>

        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
