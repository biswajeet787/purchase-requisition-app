import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel: string;
  variant?: 'primary' | 'danger';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

/** Accessible modal built on the native <dialog> (focus trap + Esc for free). */
export function ConfirmDialog({ open, title, description, confirmLabel, variant = 'primary', loading, onConfirm, onCancel, children }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      onCancel={(e) => {
        e.preventDefault();
        if (!loading) onCancel();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-white p-0 shadow-2xl open:animate-fade-in"
    >
      <div className="p-6">
        <h2 id="confirm-title" className="text-lg font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
        {children && <div className="mt-4">{children}</div>}
      </div>
      <div className="flex justify-end gap-2 rounded-b-2xl border-t border-slate-100 bg-slate-50 px-6 py-3">
        <Button variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button variant={variant} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </div>
    </dialog>
  );
}
