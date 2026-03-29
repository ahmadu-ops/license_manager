import { useEffect, useState } from 'react';
import {
  KeyIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../hooks/useApi';
import KPICard from '../components/KPICard';
import StatusBadge from '../components/StatusBadge';
import SkeletonTable from '../components/SkeletonTable';

const categoryLabels = {
  antivirus: 'Antivirus',
  office: 'Bureautique',
  design: 'Design',
  dev: 'Développement',
  other: 'Autre',
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
        <SkeletonTable rows={5} cols={4} />
      </div>
    );
  }

  const { kpis, byCategory, monthlyCosts, urgentAlerts } = data;

  const categoryData = byCategory.map((c) => ({
    name: categoryLabels[c.category] || c.category,
    count: c.count,
  }));

  const costData = monthlyCosts.map((m) => ({
    name: m.month,
    coût: m.total,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Tableau de bord</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total licences"      value={kpis.total}        icon={KeyIcon}                   color="violet" />
        <KPICard title="Actives"             value={kpis.active}       icon={CheckBadgeIcon}            color="emerald" />
        <KPICard title="Expirées"            value={kpis.expired}      icon={ExclamationTriangleIcon}   color="red" />
        <KPICard title="Expirent dans 30j"   value={kpis.expiringSoon} icon={ClockIcon}                 color="amber" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar chart — par catégorie */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1E293B]">
          <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Licences par catégorie
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#f1f5f9',
                }}
              />
              <Bar dataKey="count" fill="#7C3AED" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line chart — coût mensuel */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1E293B]">
          <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Coût mensuel (6 mois)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                formatter={(v) => [`${Number(v).toLocaleString('fr-FR')} €`, 'Coût']}
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#f1f5f9',
                }}
              />
              <Line type="monotone" dataKey="coût" stroke="#7C3AED" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alertes urgentes */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1E293B]">
        <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Alertes urgentes
        </h3>
        {urgentAlerts.length === 0 ? (
          <p className="text-sm text-slate-400">Aucune alerte en cours ✅</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Logiciel</th>
                  <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Type</th>
                  <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {urgentAlerts.map((alert) => (
                  <tr key={alert.id}>
                    <td className="py-3 font-medium text-slate-700 dark:text-slate-200">
                      {alert.license?.software?.name || '—'}
                    </td>
                    <td className="py-3">
                      <StatusBadge value={alert.type} />
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">
                      {new Date(alert.triggered_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}