import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilSquareIcon, TrashIcon, CubeIcon } from '@heroicons/react/24/outline';
import api from '../hooks/useApi';
import SoftwareAvatar from '../components/SoftwareAvatar';
import SkeletonTable from '../components/SkeletonTable';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';

const categoryLabels = {
  antivirus: 'Antivirus', office: 'Bureautique', design: 'Design',
  dev: 'Développement', other: 'Autre',
};

export default function SoftwareIndex() {
  const [softwares, setSoftwares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSoftwares = () => {
    setLoading(true);
    api.get('/softwares')
      .then(({ data }) => setSoftwares(data))
      .catch(() => toast.error('Erreur de chargement.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSoftwares(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/softwares/${deleteTarget.id}`);
      toast.success('Logiciel supprimé.');
      setDeleteTarget(null);
      fetchSoftwares();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de suppression.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">Logiciels</h1>
          <p className="mt-1 text-sm text-slate-400 dark:text-gray-500">Catalogue des logiciels référencés</p>
        </div>
        <Link
          to="/softwares/new"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-primary-600/20 transition hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600"
        >
          <PlusIcon className="h-4 w-4" /> Nouveau logiciel
        </Link>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-border-dark dark:bg-surface-dark">
          <SkeletonTable rows={6} cols={4} />
        </div>
      ) : softwares.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-16 text-center dark:border-border-dark dark:bg-surface-dark">
          <CubeIcon className="mx-auto h-12 w-12 text-slate-200 dark:text-gray-700" />
          <p className="mt-3 text-sm font-medium text-slate-400">Aucun logiciel référencé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {softwares.map((sw) => (
            <div
              key={sw.id}
              className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-border-dark dark:bg-surface-dark"
            >
              <div className="flex items-start gap-4">
                <SoftwareAvatar name={sw.name} category={sw.category} size="md" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[15px] font-bold text-slate-800 dark:text-white">
                    {sw.name}
                  </h3>
                  <p className="text-[12px] text-slate-400 dark:text-gray-500">{sw.vendor}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-gray-800 dark:text-gray-400">
                      {categoryLabels[sw.category] || sw.category}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-gray-500">
                      {sw.licenses_count} licence(s)
                    </span>
                  </div>
                  {sw.website && (
                    <a
                      href={sw.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block truncate text-[11px] text-primary-500 hover:underline"
                    >
                      {sw.website}
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Link
                  to={`/softwares/${sw.id}/edit`}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setDeleteTarget(sw)}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer ce logiciel ?"
        message={
          deleteTarget?.licenses_count > 0
            ? `"${deleteTarget?.name}" a ${deleteTarget?.licenses_count} licence(s) associée(s). Supprimez-les d'abord.`
            : `Le logiciel "${deleteTarget?.name}" sera définitivement supprimé.`
        }
        confirmLabel="Supprimer"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}