import { useEffect, useState } from 'react';
import {
  KeyIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart,
} from 'recharts';
import api from '../hooks/useApi';
import KPICard from '../components/KPICard';
import StatusBadge from '../components/StatusBadge';
import SkeletonTable from '../components/SkeletonTable';
import { useTheme } from '../context/ThemeContext';

const categoryLabels = {
  antivirus: 'Antivirus', office: 'Bureautique', design: 'Design',
  dev: 'Développement', other: 'Autre',
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { dark } = useTheme();

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  const chartColors = {
    grid: dark ? '#1F2937' : '#E2E8F0',
    text: dark ? '#6B7280' : '#94A3B8',
    tooltip: {
      bg: dark ? '#111827' : '#FFFFFF',
      border: dark ? '#1F2937' : '#E2E8F0',
      text: dark ? '#F1F5F9' : '#0F172A',
    },
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[120px] rounded-2xl bg-white dark:bg-surface-dark skeleton" />
          ))}
        </div>
        <SkeletonTable rows={5} cols={4} />
      </div>
    );
  }

  const { kpis, byCategory, monthlyCosts, urgentAlerts } = data;
  const categoryData = byCategory.map((c) => ({ name: categoryLabels[c.category] || c.category, count: c.count }));
  const costData = monthlyCosts.map((m) => ({ name: m.month, coût: m.total }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-gray-500">
          Vue d'ensemble de vos licences logicielles
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total licences"    value={kpis.total}        icon={KeyIcon}                 color="blue" />
        <KPICard title="Actives"           value={kpis.active}       icon={CheckBadgeIcon}          color="emerald"  subtitle="En cours d'utilisation" />
        <KPICard title="Expirées"          value={kpis.expired}      icon={ExclamationTriangleIcon} color="red"      subtitle="À renouveler" />
        <KPICard title="Expirent sous 30j" value={kpis.expiringSoon} icon={ClockIcon}               color="amber"    subtitle="Attention requise" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar chart */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
          <h3 className="mb-1 text-sm font-bold text-slate-700 dark:text-gray-200">
            Répartition par catégorie
          </h3>
          <p className="mb-4 text-[11px] text-slate-400 dark:text-gray-500">Nombre de licences par type de logiciel</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: chartColors.text }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: chartColors.text }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: chartColors.tooltip.bg,
                  border: `1px solid ${chartColors.tooltip.border}`,
                  borderRadius: 12, color: chartColors.tooltip.text,
                  fontSize: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                }}
                cursor={{ fill: dark ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.04)' }}
              />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <Bar dataKey="count" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area chart */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
          <h3 className="mb-1 text-sm font-bold text-slate-700 dark:text-gray-200">
            Évolution des coûts
          </h3>
          <p className="mb-4 text-[11px] text-slate-400 dark:text-gray-500">Dépenses mensuelles sur 6 mois</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: chartColors.text }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: chartColors.text }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v) => [`${Number(v).toLocaleString('fr-FR')} €`, 'Coût']}
                contentStyle={{
                  backgroundColor: chartColors.tooltip.bg,
                  border: `1px solid ${chartColors.tooltip.border}`,
                  borderRadius: 12, color: chartColors.tooltip.text,
                  fontSize: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                }}
              />
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="coût" stroke="#3B82F6" strokeWidth={2.5} fill="url(#areaGrad)" dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: dark ? '#111827' : '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Urgent alerts */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-gray-200">
              Alertes urgentes
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-gray-500">Licences nécessitant une action</p>
          </div>
          {urgentAlerts.length > 0 && (
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600 ring-1 ring-inset ring-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20">
              {urgentAlerts.length} en attente
            </span>
          )}
        </div>

        {urgentAlerts.length === 0 ? (
          <div className="rounded-xl bg-emerald-50 p-4 text-center dark:bg-emerald-500/5">
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              ✅ Aucune alerte — tout est en ordre !
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-border-dark">
                  <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">Logiciel</th>
                  <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">Type</th>
                  <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-border-dark/50">
                {urgentAlerts.map((alert) => (
                  <tr key={alert.id} className="transition hover:bg-slate-50 dark:hover:bg-gray-800/30">
                    <td className="py-3 text-[13px] font-medium text-slate-700 dark:text-gray-200">
                      {alert.license?.software?.name || '—'}
                    </td>
                    <td className="py-3"><StatusBadge value={alert.type} /></td>
                    <td className="py-3 text-[13px] text-slate-400 dark:text-gray-500">
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