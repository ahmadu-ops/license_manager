import { useEffect, useState } from 'react';
import {
  KeyIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  BanknotesIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
} from 'recharts';
import api from '../hooks/useApi';
import KPICard from '../components/KPICard';
import StatusBadge from '../components/StatusBadge';
import SkeletonTable from '../components/SkeletonTable';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const categoryLabels = {
  antivirus: 'Antivirus', office: 'Bureautique', design: 'Design',
  dev: 'Développement', other: 'Autre',
};

const formatFCFA = (v) => Number(v).toLocaleString('fr-SN') + ' F';
const formatFCFAShort = (v) => {
  const n = Number(v);
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return Math.round(n / 1_000) + 'k';
  return String(n);
};

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { dark } = useTheme();

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(({ data }) => {
        setData(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Dashboard load error:', err);
        setError(err.response?.data?.message || err.message || 'Erreur de chargement');
        toast.error('Impossible de charger le tableau de bord.');
      })
      .finally(() => setLoading(false));
  }, []);

  const c = {
    grid: dark ? '#1F2937' : '#E2E8F0',
    text: dark ? '#6B7280' : '#94A3B8',
    tt: {
      bg: dark ? '#111827' : '#FFF',
      border: dark ? '#1F2937' : '#E2E8F0',
      text: dark ? '#F1F5F9' : '#0F172A',
    },
  };

  const tooltipStyle = {
    backgroundColor: c.tt.bg,
    border: `1px solid ${c.tt.border}`,
    borderRadius: 12,
    color: c.tt.text,
    fontSize: 12,
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[100px] rounded-2xl bg-white dark:bg-surface-dark skeleton" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-[340px] rounded-2xl bg-white dark:bg-surface-dark skeleton" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data || !data.kpis) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-500/20 dark:bg-red-500/5">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h2 className="mt-4 text-lg font-bold text-red-600 dark:text-red-400">
            Erreur de chargement
          </h2>
          <p className="mt-2 text-sm text-red-500 dark:text-red-400/80">
            {error || 'Impossible de charger les données du tableau de bord.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Success — destructure safely
  const { kpis, byCategory = [], byStatus = [], byType = [], topSoftwares = [], monthlyCosts = [], urgentAlerts = [] } = data;

  const categoryData = byCategory.map((c) => ({
    name: categoryLabels[c.category] || c.category,
    count: c.count,
  }));

  const costData = monthlyCosts.map((m) => ({ name: m.month, coût: m.total }));

  const topSoftData = topSoftwares.map((s) => ({
    name: s.name && s.name.length > 16 ? s.name.substring(0, 16) + '…' : (s.name || '—'),
    coût: s.total_cost || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-gray-500">
          Vue d'ensemble — Dakar, Sénégal 🇸🇳
        </p>
      </div>

      {/* 6 KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <KPICard
          title="Total licences"
          value={kpis.total}
          icon={KeyIcon}
          color="blue"
          subtitle="Ensemble du parc"
        />
        <KPICard
          title="Actives"
          value={kpis.active}
          icon={CheckBadgeIcon}
          color="emerald"
          subtitle="En cours d'utilisation"
        />
        <KPICard
          title="Expirées"
          value={kpis.expired}
          icon={ExclamationTriangleIcon}
          color="red"
          subtitle="À renouveler"
        />
        <KPICard
          title="Expirent sous 30j"
          value={kpis.expiringSoon}
          icon={ClockIcon}
          color="amber"
          subtitle="Surveillance requise"
        />
        <KPICard
          title="Investissement actif"
          value={formatFCFAShort(kpis.totalCost) + ' F'}
          icon={BanknotesIcon}
          color="cyan"
          subtitle={formatFCFA(kpis.totalCost)}
        />
        <KPICard
          title="Sièges utilisés"
          value={`${kpis.usedSeats} / ${kpis.totalSeats}`}
          icon={UsersIcon}
          color="purple"
          subtitle={`${kpis.totalSeats - kpis.usedSeats} disponible(s)`}
        />
      </div>

      {/* Row 1 : Bar catégorie + Donut statut */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
          <h3 className="mb-1 text-sm font-bold text-slate-700 dark:text-gray-200">
            Licences par catégorie
          </h3>
          <p className="mb-5 text-[11px] text-slate-400 dark:text-gray-500">
            Répartition du parc logiciel
          </p>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: c.text }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: c.text }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: dark ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.04)' }} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
                <Bar dataKey="count" fill="url(#barGrad)" radius={[8, 8, 0, 0]} name="Licences" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-10 text-center text-sm text-slate-400">Aucune donnée</p>
          )}
        </div>

        {/* Donut statut */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
          <h3 className="mb-1 text-sm font-bold text-slate-700 dark:text-gray-200">Par statut</h3>
          <p className="mb-3 text-[11px] text-slate-400 dark:text-gray-500">Actives vs expirées vs révoquées</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={byStatus.filter((s) => s.value > 0)}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={80}
                paddingAngle={3} dataKey="value"
                labelLine={false} label={renderCustomLabel}
              >
                {byStatus.filter((s) => s.value > 0).map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend verticalAlign="bottom" iconType="circle" iconSize={8}
                formatter={(value) => <span className="text-[11px] text-slate-600 dark:text-gray-400">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2 : Top logiciels + Donut types */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
          <h3 className="mb-1 text-sm font-bold text-slate-700 dark:text-gray-200">
            Top 5 logiciels par investissement
          </h3>
          <p className="mb-5 text-[11px] text-slate-400 dark:text-gray-500">
            Licences actives — coût total en FCFA
          </p>
          {topSoftData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topSoftData} layout="vertical" barSize={20} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={c.grid} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: c.text }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => formatFCFAShort(v)} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: c.text }}
                  axisLine={false} tickLine={false} width={120} />
                <Tooltip formatter={(v) => [formatFCFA(v), 'Coût']} contentStyle={tooltipStyle}
                  cursor={{ fill: dark ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.04)' }} />
                <defs>
                  <linearGradient id="hBarGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
                <Bar dataKey="coût" fill="url(#hBarGrad)" radius={[0, 8, 8, 0]} name="Coût" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-10 text-center text-sm text-slate-400">Aucune donnée</p>
          )}
        </div>

        {/* Donut type */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
          <h3 className="mb-1 text-sm font-bold text-slate-700 dark:text-gray-200">Par type</h3>
          <p className="mb-3 text-[11px] text-slate-400 dark:text-gray-500">Abonnement, perpétuelle, essai</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={byType.filter((t) => t.value > 0)}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={80}
                paddingAngle={3} dataKey="value"
                labelLine={false} label={renderCustomLabel}
              >
                {byType.filter((t) => t.value > 0).map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend verticalAlign="bottom" iconType="circle" iconSize={8}
                formatter={(value) => <span className="text-[11px] text-slate-600 dark:text-gray-400">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3 : Évolution coûts (pleine largeur) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
        <h3 className="mb-1 text-sm font-bold text-slate-700 dark:text-gray-200">
          Évolution des dépenses
        </h3>
        <p className="mb-5 text-[11px] text-slate-400 dark:text-gray-500">
          Investissements mensuels en FCFA — 6 derniers mois
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={costData}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: c.text }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: c.text }} axisLine={false} tickLine={false}
              tickFormatter={(v) => formatFCFAShort(v)} />
            <Tooltip formatter={(v) => [formatFCFA(v), 'Investissement']} contentStyle={tooltipStyle} />
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="coût" stroke="#3B82F6" strokeWidth={2.5} fill="url(#areaGrad)"
              dot={{ r: 5, fill: '#3B82F6', strokeWidth: 2, stroke: dark ? '#111827' : '#fff' }}
              activeDot={{ r: 7, fill: '#3B82F6', strokeWidth: 3, stroke: dark ? '#111827' : '#fff' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Alertes */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-gray-200">Alertes urgentes</h3>
            <p className="text-[11px] text-slate-400 dark:text-gray-500">Licences nécessitant une action</p>
          </div>
          {urgentAlerts.length > 0 && (
            <span className="rounded-full bg-red-50 px-3 py-1.5 text-[11px] font-bold text-red-600 ring-1 ring-inset ring-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {urgentAlerts.length} en attente
            </span>
          )}
        </div>
        {urgentAlerts.length === 0 ? (
          <div className="rounded-xl bg-emerald-50 p-5 text-center dark:bg-emerald-500/5">
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              ✅ Tout est en ordre — aucune alerte
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-border-dark">
                  {['Logiciel', 'Type', 'Date'].map((h) => (
                    <th key={h} className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-border-dark/50">
                {urgentAlerts.map((alert) => (
                  <tr key={alert.id} className="transition hover:bg-slate-50 dark:hover:bg-gray-800/30">
                    <td className="py-3 text-[13px] font-semibold text-slate-700 dark:text-gray-200">
                      {alert.license?.software?.name || '—'}
                    </td>
                    <td className="py-3"><StatusBadge value={alert.type} /></td>
                    <td className="py-3 text-[13px] text-slate-400 dark:text-gray-500">
                      {new Date(alert.triggered_at).toLocaleDateString('fr-SN')}
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