import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../hooks/useApi';
import toast from 'react-hot-toast';

export default function LicenseForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [softwares, setSoftwares] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    software_id: '',
    license_key: '',
    type: 'subscription',
    seats: 1,
    status: 'active',
    purchased_at: new Date().toISOString().split('T')[0],
    expires_at: '',
    cost: '',
    notes: '',
  });

  useEffect(() => {
    api.get('/softwares').then(({ data }) => setSoftwares(data));
    if (isEdit) {
      api.get(`/licenses/${id}`).then(({ data }) => {
        setForm({
          software_id: data.software_id,
          license_key: data.license_key,
          type: data.type,
          seats: data.seats,
          status: data.status,
          purchased_at: data.purchased_at?.split('T')[0] || '',
          expires_at: data.expires_at?.split('T')[0] || '',
          cost: data.cost,
          notes: data.notes || '',
        });
      });
    }
  }, [id]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      if (isEdit) {
        await api.put(`/licenses/${id}`, form);
        toast.success('Licence mise à jour !');
      } else {
        await api.post('/licenses', form);
        toast.success('Licence créée !');
      }
      navigate('/licenses');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        toast.error('Erreurs de validation.');
      } else {
        toast.error('Erreur serveur.');
      }
    } finally {
      setLoading(false);
    }
  };

  const costPerSeat = form.seats > 0 && form.cost
    ? (parseFloat(form.cost) / parseInt(form.seats)).toFixed(2)
    : '—';

  const inputClass = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-slate-600 dark:bg-[#0F172A] dark:text-white";
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-800 dark:text-white">
        {isEdit ? 'Modifier la licence' : 'Nouvelle licence'}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1E293B]"
      >
        {/* Logiciel */}
        <div>
          <label className={labelClass}>Logiciel *</label>
          <select value={form.software_id} onChange={set('software_id')} className={inputClass}>
            <option value="">— Choisir —</option>
            {softwares.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.vendor})</option>
            ))}
          </select>
          {errors.software_id && <p className="mt-1 text-xs text-red-500">{errors.software_id[0]}</p>}
        </div>

        {/* Clé de licence */}
        <div>
          <label className={labelClass}>Clé de licence *</label>
          <input type="text" value={form.license_key} onChange={set('license_key')} className={`${inputClass} font-mono`} placeholder="XXXX-XXXX-XXXX-XXXX" />
          {errors.license_key && <p className="mt-1 text-xs text-red-500">{errors.license_key[0]}</p>}
        </div>

        {/* Type + Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Type *</label>
            <select value={form.type} onChange={set('type')} className={inputClass}>
              <option value="subscription">Abonnement</option>
              <option value="perpetual">Perpétuelle</option>
              <option value="trial">Essai</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Statut</label>
            <select value={form.status} onChange={set('status')} className={inputClass}>
              <option value="active">Active</option>
              <option value="expired">Expirée</option>
              <option value="revoked">Révoquée</option>
            </select>
          </div>
        </div>

        {/* Sièges + Coût */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Sièges *</label>
            <input type="number" min="1" value={form.seats} onChange={set('seats')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Coût total (€) *</label>
            <input type="number" step="0.01" min="0" value={form.cost} onChange={set('cost')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Coût / siège</label>
            <div className="mt-1 flex h-[38px] items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-violet-600 dark:border-slate-700 dark:bg-[#0F172A] dark:text-violet-400">
              {costPerSeat} €
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date d'achat *</label>
            <input type="date" value={form.purchased_at} onChange={set('purchased_at')} className={inputClass} />
            {errors.purchased_at && <p className="mt-1 text-xs text-red-500">{errors.purchased_at[0]}</p>}
          </div>
          <div>
            <label className={labelClass}>Date d'expiration</label>
            <input type="date" value={form.expires_at} onChange={set('expires_at')} className={inputClass} />
            {errors.expires_at && <p className="mt-1 text-xs text-red-500">{errors.expires_at[0]}</p>}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass}>Notes</label>
          <textarea value={form.notes} onChange={set('notes')} rows={3} className={inputClass} placeholder="Informations complémentaires…" />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/licenses')}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-700 disabled:opacity-50"
          >
            {loading ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}