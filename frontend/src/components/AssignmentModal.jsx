import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '../hooks/useApi';
import toast from 'react-hot-toast';

export default function AssignmentModal({ licenseId, seats, activeSeats, onClose, onCreated }) {
  const [form, setForm] = useState({ assigned_to: '', device_name: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isOverCapacity = activeSeats >= seats;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await api.post(`/licenses/${licenseId}/assignments`, form);
      toast.success('Attribution créée !');
      onCreated?.();
      onClose();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        toast.error('Erreur lors de l\'attribution.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#1E293B]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Nouvelle attribution
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-700">
            <XMarkIcon className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Barre sièges */}
        <div className="mb-4">
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Sièges utilisés</span>
            <span className={`font-semibold ${isOverCapacity ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
              {activeSeats}/{seats}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className={`h-2.5 rounded-full transition-all ${
                isOverCapacity ? 'bg-red-500' : activeSeats / seats > 0.8 ? 'bg-amber-500' : 'bg-violet-600'
              }`}
              style={{ width: `${Math.min((activeSeats / seats) * 100, 100)}%` }}
            />
          </div>
          {isOverCapacity && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              ⚠️ Capacité dépassée ! L'attribution générera une alerte.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Attribué à *
            </label>
            <input
              type="text"
              value={form.assigned_to}
              onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:border-slate-600 dark:bg-[#0F172A] dark:text-white"
              placeholder="Jean Dupont"
            />
            {errors.assigned_to && <p className="mt-1 text-xs text-red-500">{errors.assigned_to[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Nom de l'appareil
            </label>
            <input
              type="text"
              value={form.device_name}
              onChange={(e) => setForm({ ...form, device_name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:border-slate-600 dark:bg-[#0F172A] dark:text-white"
              placeholder="PC-COMPTA-01"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-violet-700 disabled:opacity-50"
            >
              {loading ? 'Attribution…' : 'Attribuer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}