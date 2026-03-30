import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  PlusIcon, MagnifyingGlassIcon, ArrowDownTrayIcon,
  EyeIcon, PencilSquareIcon, TrashIcon, KeyIcon,
} from '@heroicons/react/24/outline';
import api from '../hooks/useApi';
import StatusBadge from '../components/StatusBadge';
import SoftwareAvatar from '../components/SoftwareAvatar';
import SkeletonTable from '../components/SkeletonTable';
import ConfirmModal from '../components/ConfirmModal';
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

const formatFCFA = (v) => Number(v).toLocaleString('fr-SN') + ' F CFA';

export default function LicenseIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [licenses, setLicenses] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
      setPagination({ current: data.current_page, last: data.last_page, total: data.total });
      setSearchParams(params);
    } catch {
      toast.error('Erreur de chargement.');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, category]);

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchLicenses(); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { fetchLicenses(); }, [page, status, category]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/licenses/${deleteTarget.id}`);
      toast.success('Licence supprimée.');
      setDeleteTarget(null);
      fetchLicenses();
    } catch {
      toast.error('Erreur de suppression.');
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    window.open(
      `http://localhost:8000/api/licenses/export-pdf-download?token=${localStorage.getItem('token')}`,
      '_blank'
    );
  };

  const selectCls = 'rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[13px] font-medium text-slate-600 transition focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 dark:border-border-dark dark:bg-surface-dark dark:text-gray-300';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">Licences</h1>
          <p className="mt-1 text-sm text-slate-400 dark:text-gray-500">Gérez toutes vos licences logicielles</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 dark:border-border-dark dark:text-gray-300 dark:hover:bg-gray-800">
            <ArrowDownTrayIcon className="h-4 w-4" /> Export PDF
          </button>
          <Link to="/licenses/new"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-primary-600/20 transition hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600">
            <PlusIcon className="h-4 w-4" /> Nouvelle licence
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un logiciel, éditeur…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-[13px] transition focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 dark:border-border-dark dark:bg-surface-dark dark:text-white" />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={selectCls}>
          {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className={selectCls}>
          {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-border-dark dark:bg-surface-dark">
        {loading ? (
          <div className="p-6"><SkeletonTable rows={8} cols={7} /></div>
        ) : licenses.length === 0 ? (
          <div className="p-16 text-center">
            <KeyIcon className="mx-auto h-12 w-12 text-slate-200 dark:text-gray-700" />
            <p className="mt-3 text-sm font-medium text-slate-400 dark:text-gray-500">Aucune licence trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-border-dark dark:bg-surface-darker/50">
                  {['Logiciel', 'Type', 'Statut', 'Sièges', 'Expiration', 'Coût (FCFA)', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-border-dark/50">
                {licenses.map((lic) => (
                  <tr key={lic.id} className="group transition-colors hover:bg-primary-50/30 dark:hover:bg-primary-500/5">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <SoftwareAvatar name={lic.software?.name} category={lic.software?.category} size="sm" />
                        <div>
                          <p className="text-[13px] font-semibold text-slate-700 dark:text-white">{lic.software?.name}</p>
                          <p className="text-[11px] text-slate-400 dark:text-gray-500">{lic.software?.vendor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge value={lic.type} /></td>
                    <td className="px-4 py-3.5"><StatusBadge value={lic.status} /></td>
                    <td className="px-4 py-3.5 text-[13px] font-medium text-slate-600 dark:text-gray-300">
                      {lic.active_seats ?? 0}<span className="text-slate-300 dark:text-gray-600">/{lic.seats}</span>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-slate-500 dark:text-gray-400">
                      {lic.expires_at ? new Date(lic.expires_at).toLocaleDateString('fr-SN') : '∞'}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] font-semibold text-slate-700 dark:text-white">
                      {formatFCFA(lic.cost)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                        <Link to={`/licenses/${lic.id}`} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-500/10 dark:hover:text-primary-400">
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <Link to={`/licenses/${lic.id}/edit`} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400">
                          <PencilSquareIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(lic)}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
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

        {pagination.last > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 dark:border-border-dark">
            <p className="text-[12px] text-slate-400 dark:text-gray-500">
              {pagination.total} résultat(s) — Page {pagination.current}/{pagination.last}
            </p>
            <div className="flex gap-1">
              <button disabled={pagination.current <= 1} onClick={() => setPage((p) => p - 1)}
                className="rounded-lg px-3 py-1.5 text-[12px] font-medium text-slate-500 transition hover:bg-slate-100 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-gray-800">
                ← Précédent
              </button>
              <button disabled={pagination.current >= pagination.last} onClick={() => setPage((p) => p + 1)}
                className="rounded-lg px-3 py-1.5 text-[12px] font-medium text-slate-500 transition hover:bg-slate-100 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-gray-800">
                Suivant →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer cette licence ?"
        message={`La licence "${deleteTarget?.software?.name}" et toutes ses attributions seront définitivement supprimées.`}
        confirmLabel="Supprimer"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}