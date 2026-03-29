import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import api from '../hooks/useApi';
import StatusBadge from '../components/StatusBadge';
import SkeletonTable from '../components/SkeletonTable';
import toast from 'react-hot-toast';

const categories = [
  { value: '', label: 'Toutes catégories' },
  { value: 'antivirus', label: 'Antivirus' },
  { value: 'office', label: 'Bureautique' },
  { value: 'design', label: 'Design' },
  { value: 'dev', label: 'Développement' },
  { value: 'other', label: 'Autre' },
];

const statuses = [
  { value: '', label: 'Tous statuts' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expirée' },
  { value: 'revoked', label: 'Révoquée' },
];

export default function LicenseIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [licenses, setLicenses] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const fetchLicenses = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search) params.search = search;
      if (status) params.status = status;
      if (category) params.category = category;

      const { data } = await api.get('/licenses', { params });
      setLicenses(data.data);
      setPagination({
        current: data.current_page,
        last: data.last_page,
        total: data.total,
      });

      setSearchParams(params);
    } catch {
      toast.error('Erreur de chargement.');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, category]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchLicenses();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchLicenses();
  }, [page, status, category]);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette licence ?')) return;
    try {
      await api.delete(`/licenses/${id}`);
      toast.success('Licence supprimée.');
      fetchLicenses();
    } catch {
      toast.error('Erreur de suppression.');
    }
  };

  const handleExport = () => {
    window.open('http://localhost:8000/api/licenses/export?token=' + localStorage.getItem('token'), '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Licences</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Export CSV
          </button>
          <Link
            to="/licenses/new"
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-700"
          >
            <PlusIcon className="h-4 w-4" />
            Nouvelle licence
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un logiciel, éditeur…"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:border-slate-600 dark:bg-[#1E293B] dark:text-white"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-[#1E293B] dark:text-white"
        >
          {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-[#1E293B] dark:text-white"
        >
          {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#1E293B]">
        {loading ? (
          <div className="p-6"><SkeletonTable rows={8} cols={7} /></div>
        ) : licenses.length === 0 ? (
          <div className="p-12 text-center text-slate-400">Aucune licence trouvée.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-[#0F172A]/50">
                  <th className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Logiciel</th>
                  <th className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Type</th>
                  <th className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Statut</th>
                  <th className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Sièges</th>
                  <th className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Expiration</th>
                  <th className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Coût</th>
                  <th className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {licenses.map((lic) => (
                  <tr key={lic.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {lic.software?.logo_url && (
                          <img src={lic.software.logo_url} alt="" className="h-8 w-8 rounded" />
                        )}
                        <div>
                          <p className="font-medium text-slate-700 dark:text-white">{lic.software?.name}</p>
                          <p className="text-xs text-slate-400">{lic.software?.vendor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge value={lic.type} type="type" /></td>
                    <td className="px-4 py-3"><StatusBadge value={lic.status} /></td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {lic.active_seats ?? 0}/{lic.seats}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {lic.expires_at ? new Date(lic.expires_at).toLocaleDateString('fr-FR') : '∞'}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-white">
                      {Number(lic.cost).toLocaleString('fr-FR')} €
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Link
                          to={`/licenses/${lic.id}`}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-500/10"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/licenses/${lic.id}/edit`}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(lic.id)}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.last > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {pagination.total} résultat(s) — Page {pagination.current}/{pagination.last}
            </p>
            <div className="flex gap-1">
              <button
                disabled={pagination.current <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Précédent
              </button>
              <button
                disabled={pagination.current >= pagination.last}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}