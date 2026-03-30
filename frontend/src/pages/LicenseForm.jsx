import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../hooks/useApi';
import toast from 'react-hot-toast';

const formatFCFA = (v) => Number(v).toLocaleString('fr-SN') + ' F';

export default function LicenseForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [softwares, setSoftwares] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    software_id: '', license_key: '', type: 'subscription', seats: 1,
    status: 'active', purchased_at: new Date().toISOString().split('T')[0],
    expires_at: '', cost: '', notes: '',
  });

  useEffect(() => {
    api.get('/softwares').then(({ data }) => setSoftwares(data));
    if (isEdit) {
      api.get(`/licenses/${id}`).then(({ data }) => {
        setForm({
          software_id: data.software_id, license_key: data.license_key, type: data.type,
          seats: data.seats, status: data.status,
          purchased_at: data.purchased_at?.split('T')[0] || '',
          expires_at: data.expires_at?.split('T')[0] || '',
          cost: data.cost, notes: data.notes || '',
        });
      });
    }
  }, [id]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setErrors({});
    try {
      if (isEdit) { await api.put(`/licenses/${id}`, form); toast.success('Licence mise à jour !'); }
      else { await api.post('/licenses', form); toast.success('Licence créée !'); }
      navigate('/licenses');
    } catch (err) {
      if (err.response?.status === 422) { setErrors(err.response.data.errors || {}); toast.error('Erreurs de validation.'); }
      else toast.error('Erreur serveur.');
    } finally { setLoading(false); }
  };

  const costPerSeat = form.seats > 0 && form.cost ? formatFCFA((parseFloat(form.cost) / parseInt(form.seats)).toFixed(0)) : '—';

  const inputCls = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 dark:border-border-dark dark:bg-surface-darker dark:text-white';
  const labelCls = 'mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-gray-300';

  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={() => navigate('/licenses')} className="mb-4 flex items-center gap-2 text-[13px] font-medium text-slate-400 transition hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300">
        <ArrowLeftIcon className="h-4 w-4" /> Retour aux licences
      </button>

      <h1 className="mb-6 text-3xl font-black tracking-tight text-slate-800 dark:text-white">
        {isEdit ? 'Modifier la licence' : 'Nouvelle licence'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm dark:border-border-dark dark:bg-surface-dark">
        <div>
          <label className={labelCls}>Logiciel <span className="text-red-400">*</span></label>
          <select value={form.software_id} onChange={set('software_id')} className={inputCls}>
            <option value="">— Choisir un logiciel —</option>
            {softwares.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.vendor})</option>)}
          </select>
          {errors.software_id && <p className="mt-1 text-[11px] text-red-500">{errors.software_id[0]}</p>}
        </div>

        <div>
          <label className={labelCls}>Clé de licence <span className="text-red-400">*</span></label>
          <input type="text" value={form.license_key} onChange={set('license_key')} className={`${inputCls} font-mono tracking-wider`} placeholder="XXXX-XXXX-XXXX-XXXX" />
          {errors.license_key && <p className="mt-1 text-[11px] text-red-500">{errors.license_key[0]}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Type <span className="text-red-400">*</span></label>
            <select value={form.type} onChange={set('type')} className={inputCls}>
              <option value="subscription">Abonnement</option>
              <option value="perpetual">Perpétuelle</option>
              <option value="trial">Essai</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Statut</label>
            <select value={form.status} onChange={set('status')} className={inputCls}>
              <option value="active">Active</option>
              <option value="expired">Expirée</option>
              <option value="revoked">Révoquée</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Sièges <span className="text-red-400">*</span></label>
            <input type="number" min="1" value={form.seats} onChange={set('seats')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Coût total (FCFA) <span className="text-red-400">*</span></label>
            <input type="number" step="1" min="0" value={form.cost} onChange={set('cost')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Coût / siège</label>
            <div className="flex h-[42px] items-center rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold text-primary-600 dark:border-border-dark dark:bg-surface-darker dark:text-primary-400">
              {costPerSeat}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Date d'achat <span className="text-red-400">*</span></label>
            <input type="date" value={form.purchased_at} onChange={set('purchased_at')} className={inputCls} />
            {errors.purchased_at && <p className="mt-1 text-[11px] text-red-500">{errors.purchased_at[0]}</p>}
          </div>
          <div>
            <label className={labelCls}>Date d'expiration</label>
            <input type="date" value={form.expires_at} onChange={set('expires_at')} className={inputCls} />
            {errors.expires_at && <p className="mt-1 text-[11px] text-red-500">{errors.expires_at[0]}</p>}
          </div>
        </div>

        <div>
          <label className={labelCls}>Notes</label>
          <textarea value={form.notes} onChange={set('notes')} rows={3} className={inputCls} placeholder="Informations complémentaires…" />
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-5 dark:border-border-dark">
          <button type="button" onClick={() => navigate('/licenses')}
            className="rounded-xl px-5 py-2.5 text-[13px] font-medium text-slate-500 transition hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-gray-800">
            Annuler
          </button>
          <button type="submit" disabled={loading}
            className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-primary-600/20 transition hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 dark:from-primary-500 dark:to-primary-600">
            {loading ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Créer la licence'}
          </button>
        </div>
      </form>
    </div>
  );
}