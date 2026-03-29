import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentIcon,
  UserPlusIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import api from '../hooks/useApi';
import StatusBadge from '../components/StatusBadge';
import AssignmentModal from '../components/AssignmentModal';
import SkeletonTable from '../components/SkeletonTable';
import toast from 'react-hot-toast';

export default function LicenseShow() {
  const { id } = useParams();
  const [license, setLicense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchLicense = () => {
    setLoading(true);
    api.get(`/licenses/${id}`)
      .then(({ data }) => setLicense(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLicense(); }, [id]);

  const copyKey = () => {
    navigator.clipboard.writeText(license.license_key);
    toast.success('Clé copiée !');
  };

  const handleReturn = async (assignmentId) => {
    if (!confirm('Confirmer le retour ?')) return;
    await api.patch(`/assignments/${assignmentId}/return`);
    toast.success('Attribution retournée.');
    fetchLicense();
  };

  if (loading) return <div className="p-6"><SkeletonTable /></div>;
  if (!license) return <div className="p-6 text-slate-400">Licence introuvable.</div>;

  const activeSeats = license.assignments?.filter((a) => !a.returned_at).length ?? 0;
  const seatPercent = Math.min((activeSeats / license.seats) * 100, 100);
  const isOver = activeSeats > license.seats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {license.software?.logo_url && (
            <img src={license.software.logo_url} alt="" className="h-12 w-12 rounded-xl" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              {license.software?.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {license.software?.vendor} · {license.software?.category}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <StatusBadge value={license.type} type="type" />
          <StatusBadge value={license.status} />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Détails */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1E293B]">
            <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Clé de licence
            </h3>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-[#0F172A]">
              <code className="flex-1 font-mono text-sm text-slate-700 dark:text-slate-200">
                {showKey ? license.license_key : '••••-••••-••••-••••-••••'}
              </code>
              <button onClick={() => setShowKey(!showKey)} className="p-1 text-slate-400 hover:text-violet-600">
                {showKey ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
              <button onClick={copyKey} className="p-1 text-slate-400 hover:text-violet-600">
                <ClipboardDocumentIcon className="h-5 w-5" />
              </button>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Date d'achat</dt>
                <dd className="font-medium text-slate-700 dark:text-white">
                  {new Date(license.purchased_at).toLocaleDateString('fr-FR')}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Expiration</dt>
                <dd className="font-medium text-slate-700 dark:text-white">
                  {license.expires_at ? new Date(license.expires_at).toLocaleDateString('fr-FR') : '∞ Perpétuelle'}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Coût total</dt>
                <dd className="font-medium text-slate-700 dark:text-white">
                  {Number(license.cost).toLocaleString('fr-FR')} €
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Coût / siège</dt>
                <dd className="font-medium text-violet-600 dark:text-violet-400">
                  {license.seats > 0 ? (license.cost / license.seats).toFixed(2) : '—'} €
                </dd>
              </div>
            </dl>

            {license.notes && (
              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-[#0F172A] dark:text-slate-400">
                📝 {license.notes}
              </div>
            )}
          </div>

          {/* Assignments */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1E293B]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Attributions ({activeSeats}/{license.seats} sièges)
              </h3>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-violet-700"
              >
                <UserPlusIcon className="h-4 w-4" /> Attribuer
              </button>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className={`h-2.5 rounded-full transition-all ${isOver ? 'bg-red-500' : seatPercent > 80 ? 'bg-amber-500' : 'bg-violet-600'}`}
                  style={{ width: `${seatPercent}%` }}
                />
              </div>
            </div>

            {license.assignments?.length === 0 ? (
              <p className="text-sm text-slate-400">Aucune attribution.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 font-medium text-slate-500 dark:text-slate-400">Utilisateur</th>
                    <th className="pb-2 font-medium text-slate-500 dark:text-slate-400">Appareil</th>
                    <th className="pb-2 font-medium text-slate-500 dark:text-slate-400">Depuis</th>
                    <th className="pb-2 font-medium text-slate-500 dark:text-slate-400">Statut</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {license.assignments.map((a) => (
                    <tr key={a.id}>
                      <td className="py-2.5 font-medium text-slate-700 dark:text-white">{a.assigned_to}</td>
                      <td className="py-2.5 text-slate-500 dark:text-slate-400">{a.device_name || '—'}</td>
                      <td className="py-2.5 text-slate-500 dark:text-slate-400">
                        {new Date(a.assigned_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-2.5">
                        {a.returned_at ? (
                          <span className="text-xs text-slate-400">
                            Retourné le {new Date(a.returned_at).toLocaleDateString('fr-FR')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                            En cours
                          </span>
                        )}
                      </td>
                      <td className="py-2.5">
                        {!a.returned_at && (
                          <button
                            onClick={() => handleReturn(a.id)}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10"
                            title="Retourner"
                          >
                            <ArrowUturnLeftIcon className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Sidebar — Alertes */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1E293B]">
            <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Alertes récentes
            </h3>
            {license.alerts?.length === 0 ? (
              <p className="text-sm text-slate-400">Aucune alerte ✅</p>
            ) : (
              <div className="space-y-2">
                {license.alerts.map((a) => (
                  <div key={a.id} className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 dark:bg-[#0F172A]">
                    <StatusBadge value={a.type} />
                    <span className="text-xs text-slate-400">
                      {new Date(a.triggered_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            to={`/licenses/${id}/edit`}
            className="block w-full rounded-lg border border-violet-300 py-2 text-center text-sm font-medium text-violet-600 transition hover:bg-violet-50 dark:border-violet-500/30 dark:text-violet-400 dark:hover:bg-violet-500/10"
          >
            ✏️ Modifier cette licence
          </Link>
        </div>
      </div>

      {/* Assignment Modal */}
      {showModal && (
        <AssignmentModal
          licenseId={license.id}
          seats={license.seats}
          activeSeats={activeSeats}
          onClose={() => setShowModal(false)}
          onCreated={fetchLicense}
        />
      )}
    </div>
  );
}