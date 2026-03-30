import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, BellAlertIcon } from '@heroicons/react/24/outline';
import api from '../hooks/useApi';
import StatusBadge from '../components/StatusBadge';
import SkeletonTable from '../components/SkeletonTable';
import toast from 'react-hot-toast';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    setLoading(true);
    api.get('/alerts').then(({ data }) => setAlerts(data)).finally(() => setLoading(false));
  };
  useEffect(() => { fetchAlerts(); }, []);

  const markRead = async (id) => {
    await api.patch(`/alerts/${id}/read`);
    toast.success('Alerte marquée comme lue.');
    fetchAlerts();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">Alertes</h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-gray-500">{alerts.length} alerte(s) non lue(s)</p>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-border-dark dark:bg-surface-dark">
        {loading ? (
          <div className="p-6"><SkeletonTable rows={5} cols={4} /></div>
        ) : alerts.length === 0 ? (
          <div className="p-16 text-center">
            <BellAlertIcon className="mx-auto h-12 w-12 text-slate-200 dark:text-gray-700" />
            <p className="mt-3 text-sm font-semibold text-emerald-500">Aucune alerte en attente ✅</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-border-dark dark:bg-surface-darker/50">
                {['Logiciel', 'Type', 'Date', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-border-dark/50">
              {alerts.map((a) => (
                <tr key={a.id} className="transition hover:bg-primary-50/30 dark:hover:bg-primary-500/5">
                  <td className="px-4 py-3.5">
                    <Link to={`/licenses/${a.license_id}`} className="text-[13px] font-semibold text-primary-600 hover:underline dark:text-primary-400">
                      {a.license?.software?.name || `Licence #${a.license_id}`}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge value={a.type} /></td>
                  <td className="px-4 py-3.5 text-[13px] text-slate-400 dark:text-gray-500">{new Date(a.triggered_at).toLocaleDateString('fr-SN')}</td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => markRead(a.id)}
                      className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10">
                      <CheckCircleIcon className="h-4 w-4" /> Marquer lue
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}