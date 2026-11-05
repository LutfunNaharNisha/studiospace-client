'use client';
import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function Modal({ open, onClose, title, children, actions, wide = false }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative max-h-[92vh] w-full overflow-y-auto rounded-2xl border border-base-300 bg-base-100 p-6 shadow-2xl ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
        <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm absolute right-3 top-3" aria-label="Close dialog"><FiX /></button>
        <h3 className="pr-8 text-xl font-bold">{title}</h3>
        <div className="mt-4">{children}</div>
        {actions && <div className="mt-6 flex flex-wrap justify-end gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function ConfirmModal({ open, title, message, confirmText = 'Confirm', danger = false, busy = false, onConfirm, onCancel }) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      actions={
        <>
          <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>Keep it</button>
          <button className={`btn ${danger ? 'btn-error' : 'btn-primary'}`} onClick={onConfirm} disabled={busy}>
            {busy && <span className="loading loading-spinner loading-xs" />} {confirmText}
          </button>
        </>
      }
    >
      <p className="text-base-content/75">{message}</p>
    </Modal>
  );
}
