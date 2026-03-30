import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ConfirmModal({
  open,
  title = 'Confirmer la suppression',
  message = 'Cette action est irréversible. Voulez-vous continuer ?',
  confirmLabel = 'Supprimer',
  cancelLabel = 'Annuler',
  variant = 'danger', // 'danger' | 'warning' | 'info'
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  const variants = {
    danger: {
      icon: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
      btn: 'bg-red-600 hover:bg-red-700 shadow-red-600/20 dark:bg-red-500 dark:hover:bg-red-600',
    },
    warning: {
      icon: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
      btn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20 dark:bg-amber-500 dark:hover:bg-amber-600',
    },
    info: {
      icon: 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400',
      btn: 'bg-primary-600 hover:bg-primary-700 shadow-primary-600/20 dark:bg-primary-500 dark:hover:bg-primary-600',
    },
  };

  const v = variants[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-border-dark dark:bg-surface-dark"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className={`rounded-xl p-2.5 ${v.icon}`}>
            <ExclamationTriangleIcon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-bold text-slate-800 dark:text-white">
              {title}
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500 dark:text-gray-400">
              {message}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-gray-800"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl px-4 py-2.5 text-[13px] font-medium text-slate-500 transition hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-5 py-2.5 text-[13px] font-bold text-white shadow-lg transition disabled:opacity-50 ${v.btn}`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Suppression…
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}