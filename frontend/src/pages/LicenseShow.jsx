import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  EyeIcon, EyeSlashIcon, ClipboardDocumentIcon,
  UserPlusIcon, ArrowUturnLeftIcon, ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import api from '../hooks/useApi';
import StatusBadge from '../components/StatusBadge';
import SoftwareAvatar from '../components/SoftwareAvatar';
import AssignmentModal from '../components/AssignmentModal';
import SkeletonTable from '../components/SkeletonTable';
import toast from 'react-hot-toast';

const formatFCFA = (v) => Number(v).toLocaleString('fr-SN') + ' F CFA';

export default function LicenseShow() {
  const { id } = useParams();
  const [license, setLicense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchLicense = () => {
    setLoading(true);
    api.get(`/licenses/${id}`).then(({ data }) => setLicense(data)).finally(() => setLoading(false));
  };
  useEffect(() => { fetchLicense(); }, [id]);

  const copyKey = () => {
    navigator.clipboard.writeText(license.license_key);
    toast.success('Clé copiée !');
  };

  const handleReturn = async (aId) => {
    if (!confirm('Confirmer le retour ?')) return;
    await api.patch(`/assignments/${aId}/return`);
    toast.success('Attribution retournée.');
    fetchLicense();
  };

  if (loading) return <div className="p-6"><SkeletonTable /></div>;
  if (!license) return <div className="p-6 text-slate-400">Licence introuvable.</div>;

  const activeSeats = license.assignments?.filter((a) => !a.returned_at).length ?? 0;
  const pct = Math.min((activeSeats / license.seats) * 100, 100);
  const isOver = activeSeats > license.seats;

  return (
    <div className="space-y-6">
      <Link to="/licenses" className="flex items-center gap-2 text-[13px] font-medium text-slate-400 transition hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300">
        <ArrowLeftIcon className="h-4 w-4" /> Retour aux licences
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <SoftwareAvatar
            name={license.software?.name}
            category={license.software?.category}
            size="lg"
          />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">
              {license.software?.name}
            </h1>
            <p className="text-sm text-slate-400 dark:text-gray-500">{license.software?.vendor}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <StatusBadge value={license.type} />
          <StatusBadge value={license.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Clé + Détails */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-gray-500">
              Clé de licence
            </h3>
            <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-border-dark dark:bg-surface-darker">
              <code className="flex-1 font-mono text-sm tracking-wider text-slate-700 dark:text-gray-200">
                {showKey ? license.license_key : '••••-••••-••••-••••'}
              </code>
              <button onClick={() => setShowKey(!showKey)} className="rounded-lg p-1.5 text-slate-400 transition hover:text-primary-600 dark:hover:text-primary-400">
                {showKey ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
              <button onClick={copyKey} className="rounded-lg p-1.5 text-slate-400 transition hover:text-primary-600 dark:hover:text-primary-400">
                <ClipboardDocumentIcon className="h-4 w-4" />
              </button>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-4">
              {[
                ['Date d\'achat', new Date(license.purchased_at).toLocaleDateString('fr-SN')],
                ['Expiration', license.expires_at ? new Date(license.expires_at).toLocaleDateString('fr-SN') : '∞ Perpétuelle'],
                ['Coût total', formatFCFA(license.cost)],
                ['Coût / siège', license.seats > 0 ? formatFCFA(Math.round(license.cost / license.seats)) : '—'],
              ].map(([label, val]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-3 dark:bg-surface-darker">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">{label}</dt>
                  <dd className="mt-1 text-sm font-bold text-slate-700 dark:text-white">{val}</dd>
                </div>
              ))}
            </dl>

            {license.notes && (
              <div className="mt-4 rounded-xl border-l-4 border-primary-500 bg-primary-50 p-3 text-sm text-slate-600 dark:border-primary-400 dark:bg-primary-500/5 dark:text-gray-300">
                {license.notes}
              </div>
            )}
          </div>

          {/* Assignments */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-gray-500">Attributions</h3>
                <p className="text-sm font-semibold text-slate-700 dark:text-gray-200">{activeSeats}/{license.seats} sièges utilisés</p>
              </div>
              <button onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-primary-600/20 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600">
                <UserPlusIcon className="h-4 w-4" /> Attribuer
              </button>
            </div>

            <div className="mb-5 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-gray-700">
              <div className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : pct > 80 ? 'bg-amber-500' : 'bg-primary-500'}`} style={{ width: `${pct}%` }} />
            </div>

            {license.assignments?.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-gray-500">Aucune attribution pour le moment.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-border-dark">
                    {['Utilisateur', 'Appareil', 'Date', 'Statut', ''].map((h) => (
                      <th key={h} className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-border-dark/50">
                  {license.assignments.map((a) => (
                    <tr key={a.id}>
                      <td className="py-2.5 text-[13px] font-medium text-slate-700 dark:text-white">{a.assigned_to}</td>
                      <td className="py-2.5 text-[13px] text-slate-400 dark:text-gray-500">{a.device_name || '—'}</td>
                      <td className="py-2.5 text-[13px] text-slate-400 dark:text-gray-500">{new Date(a.assigned_at).toLocaleDateString('fr-SN')}</td>
                      <td className="py-2.5">
                        {a.returned_at
                          ? <span className="text-[11px] text-slate-400">Retourné {new Date(a.returned_at).toLocaleDateString('fr-SN')}</span>
                          : <StatusBadge value="active" />}
                      </td>
                      <td className="py-2.5">
                        {!a.returned_at && (
                          <button onClick={() => handleReturn(a.id)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400">
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

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-gray-500">Alertes</h3>
            {license.alerts?.length === 0 ? (
              <div className="rounded-xl bg-emerald-50 p-3 text-center dark:bg-emerald-500/5">
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">✅ Aucune alerte</p>
              </div>
            ) : (
              <div className="space-y-2">
                {license.alerts.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 dark:bg-surface-darker">
                    <StatusBadge value={a.type} />
                    <span className="text-[11px] text-slate-400 dark:text-gray-500">{new Date(a.triggered_at).toLocaleDateString('fr-SN')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link to={`/licenses/${id}/edit`}
            className="block w-full rounded-xl border border-primary-200 py-2.5 text-center text-[13px] font-semibold text-primary-600 transition hover:bg-primary-50 dark:border-primary-500/30 dark:text-primary-400 dark:hover:bg-primary-500/10">
            ✏️ Modifier cette licence
          </Link>
        </div>
      </div>

      {showModal && (
        <AssignmentModal licenseId={license.id} seats={license.seats} activeSeats={activeSeats}
          onClose={() => setShowModal(false)} onCreated={fetchLicense} />
      )}
    </div>
  );
}