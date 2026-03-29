const config = {
  active:      { classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20', dot: 'bg-emerald-500', label: 'Active' },
  expired:     { classes: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20', dot: 'bg-red-500', label: 'Expirée' },
  revoked:     { classes: 'bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-600/20', dot: 'bg-slate-400', label: 'Révoquée' },
  expiry_soon: { classes: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20', dot: 'bg-amber-500 animate-pulse', label: 'Expire bientôt' },
  overused:    { classes: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20', dot: 'bg-red-500 animate-pulse', label: 'Surutilisée' },
  perpetual:   { classes: 'bg-primary-50 text-primary-700 ring-primary-600/20 dark:bg-primary-500/10 dark:text-primary-400 dark:ring-primary-500/20', dot: 'bg-primary-500', label: 'Perpétuelle' },
  subscription:{ classes: 'bg-cyan-50 text-cyan-700 ring-cyan-600/20 dark:bg-cyan-500/10 dark:text-cyan-400 dark:ring-cyan-500/20', dot: 'bg-cyan-500', label: 'Abonnement' },
  trial:       { classes: 'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/20', dot: 'bg-purple-500', label: 'Essai' },
};

export default function StatusBadge({ value }) {
  const c = config[value] || config.active;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${c.classes}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}