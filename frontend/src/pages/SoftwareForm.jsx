import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../hooks/useApi';
import toast from 'react-hot-toast';

const categories = [
  { value: 'antivirus', label: 'Antivirus' },
  { value: 'office',    label: 'Bureautique' },
  { value: 'design',    label: 'Design' },
  { value: 'dev',       label: 'Développement' },
  { value: 'other',     label: 'Autre' },
];

export default function SoftwareForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', vendor: '', category: 'other', website: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/softwares/${id}`).then(({ data }) => {
        setForm({
          name: data.name,
          vendor: data.vendor,
          category: data.category,
          website: data.website || '',
        });
      });
    }
  }, [id]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      if (isEdit) {
        await api.put(`/softwares/${id}`, form);
        toast.success('Logiciel mis à jour !');
      } else {
        await api.post('/softwares', form);
        toast.success('Logiciel créé !');
      }
      navigate('/softwares');
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

  const inputCls = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 dark:border-border-dark dark:bg-surface-darker dark:text-white';
  const labelCls = 'mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-gray-300';

  return (
    <div className="mx-auto max-w-lg">
      <button
        onClick={() => navigate('/softwares')}
        className="mb-4 flex items-center gap-2 text-[13px] font-medium text-slate-400 transition hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300"
      >
        <ArrowLeftIcon className="h-4 w-4" /> Retour aux logiciels
      </button>

      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">
        {isEdit ? 'Modifier le logiciel' : 'Nouveau logiciel'}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark"
      >
        <div>
          <label className={labelCls}>Nom <span className="text-red-400">*</span></label>
          <input type="text" value={form.name} onChange={set('name')} className={inputCls} placeholder="Microsoft 365" />
          {errors.name && <p className="mt-1 text-[11px] text-red-500">{errors.name[0]}</p>}
        </div>

        <div>
          <label className={labelCls}>Éditeur <span className="text-red-400">*</span></label>
          <input type="text" value={form.vendor} onChange={set('vendor')} className={inputCls} placeholder="Microsoft" />
          {errors.vendor && <p className="mt-1 text-[11px] text-red-500">{errors.vendor[0]}</p>}
        </div>

        <div>
          <label className={labelCls}>Catégorie <span className="text-red-400">*</span></label>
          <select value={form.category} onChange={set('category')} className={inputCls}>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-[11px] text-red-500">{errors.category[0]}</p>}
        </div>

        <div>
          <label className={labelCls}>Site web</label>
          <input type="url" value={form.website} onChange={set('website')} className={inputCls} placeholder="https://example.com" />
          {errors.website && <p className="mt-1 text-[11px] text-red-500">{errors.website[0]}</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-5 dark:border-border-dark">
          <button
            type="button"
            onClick={() => navigate('/softwares')}
            className="rounded-xl px-5 py-2.5 text-[13px] font-medium text-slate-500 transition hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-primary-600/20 transition hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 dark:from-primary-500 dark:to-primary-600"
          >
            {loading ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}