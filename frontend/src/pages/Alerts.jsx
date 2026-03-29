import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import api from '../hooks/useApi';
import StatusBadge from '../components/StatusBadge';
import SkeletonTable from '../components/SkeletonTable';
import toast from 'react-hot-toast';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    setLoading(true);
    api.get('/alerts')
      .then(({ data }) => setAlerts(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAlerts(); }, []);

  const markRead = async (id) => {
    await api.patch(`/alerts/${id}/read`);
    toast.success('Alerte marquée comme lue.');
    fetchAlerts();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
        Alertes non lues ({alerts.length})
      </h1>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#1E293B]">
        {loading ? (
          <div className="p-6"><SkeletonTable rows={5} cols={4} /></div>
        ) : alerts.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            Aucune alerte en attente ✅
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-[#0F172A]/50">
                <th className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Logiciel</th>
                <th className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Type d'alerte</th>
                <th className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {alerts.map((alert) => (
                <tr key={alert.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-4 py-3">
                    <Link
                      to={`/licenses/${alert.license_id}`}
                      className="font-medium text-violet-600 hover:underline dark:text-violet-400"
                    >
                      {alert.license?.software?.name || `Licence #${alert.license_id}`}
                    </Link>
                  </td>
                  <td className="px-4 py-3"><StatusBadge value={alert.type} /></td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {new Date(alert.triggered_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => markRead(alert.id)}
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-600 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                    >
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