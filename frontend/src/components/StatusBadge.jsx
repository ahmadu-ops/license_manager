const variants = {
  active:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  expired: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  revoked: 'bg-slate-200 text-slate-600 dark:bg-slate-600/30 dark:text-slate-400',
  expiry_soon: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 animate-pulse',
  overused: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

const labels = {
  active: 'Active',
  expired: 'Expirée',
  revoked: 'Révoquée',
  expiry_soon: 'Expire bientôt',
  overused: 'Surutilisée',
  perpetual: 'Perpétuelle',
  subscription: 'Abonnement',
  trial: 'Essai',
};

export default function StatusBadge({ value, type = 'status' }) {
  const classes = variants[value] || variants.active;
  const label = labels[value] || value;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${classes}`}>
      {label}
    </span>
  );
}