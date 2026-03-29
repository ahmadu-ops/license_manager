import { useState } from 'react';
import { XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import api from '../hooks/useApi';
import toast from 'react-hot-toast';

export default function AssignmentModal({ licenseId, seats, activeSeats, onClose, onCreated }) {
  const [form, setForm] = useState({ assigned_to: '', device_name: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isOver = activeSeats >= seats;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await api.post(`/licenses/${licenseId}/assignments`, form);
      toast.success('Attribution créée avec succès !');
      onCreated?.();
      onClose();
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors || {});
      else toast.error('Erreur lors de l\'attribution.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 dark:border-border-dark dark:bg-surface-darker dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-400/10';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-border-dark dark:bg-surface-dark"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary-50 p-2.5 dark:bg-primary-500/10">
              <UserPlusIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Nouvelle attribution
            </h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-5 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-border-dark dark:bg-surface-darker">
          <div className="mb-2 flex justify-between text-xs">
            <span className="font-medium text-slate-500 dark:text-gray-400">Sièges utilisés</span>
            <span className={`font-bold ${isOver ? 'text-red-500' : 'text-slate-700 dark:text-gray-200'}`}>
              {activeSeats} / {seats}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-gray-700">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOver ? 'bg-red-500' : activeSeats / seats > 0.8 ? 'bg-amber-500' : 'bg-primary-500'
              }`}
              style={{ width: `${Math.min((activeSeats / seats) * 100, 100)}%` }}
            />
          </div>
          {isOver && (
            <p className="mt-2 text-[11px] font-medium text-red-500">
              ⚠️ Capacité maximale dépassée — une alerte sera générée.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-gray-300">
              Attribué à <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.assigned_to}
              onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
              className={inputCls}
              placeholder="Jean Dupont"
            />
            {errors.assigned_to && <p className="mt-1 text-[11px] text-red-500">{errors.assigned_to[0]}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-gray-300">
              Nom de l'appareil
            </label>
            <input
              type="text"
              value={form.device_name}
              onChange={(e) => setForm({ ...form, device_name: e.target.value })}
              className={inputCls}
              placeholder="PC-COMPTA-01"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-border-dark">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-[13px] font-medium text-slate-500 transition hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-primary-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:bg-primary-700 disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              {loading ? 'Attribution…' : 'Attribuer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}