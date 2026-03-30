const themes = {
  blue: {
    icon: 'from-primary-500 to-primary-700',
    bg:   'bg-primary-50 dark:bg-primary-500/10',
    text: 'text-primary-600 dark:text-primary-400',
    glow: 'shadow-primary-500/10',
  },
  emerald: {
    icon: 'from-emerald-500 to-emerald-700',
    bg:   'bg-emerald-50 dark:bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    glow: 'shadow-emerald-500/10',
  },
  red: {
    icon: 'from-red-500 to-red-600',
    bg:   'bg-red-50 dark:bg-red-500/10',
    text: 'text-red-600 dark:text-red-400',
    glow: 'shadow-red-500/10',
  },
  amber: {
    icon: 'from-amber-500 to-orange-600',
    bg:   'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'shadow-amber-500/10',
  },
  cyan: {
    icon: 'from-cyan-500 to-cyan-700',
    bg:   'bg-cyan-50 dark:bg-cyan-500/10',
    text: 'text-cyan-600 dark:text-cyan-400',
    glow: 'shadow-cyan-500/10',
  },
  purple: {
    icon: 'from-purple-500 to-purple-700',
    bg:   'bg-purple-50 dark:bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-400',
    glow: 'shadow-purple-500/10',
  },
  slate: {
    icon: 'from-slate-500 to-slate-700',
    bg:   'bg-slate-100 dark:bg-slate-500/10',
    text: 'text-slate-600 dark:text-slate-400',
    glow: 'shadow-slate-500/10',
  },
  rose: {
    icon: 'from-rose-500 to-rose-700',
    bg:   'bg-rose-50 dark:bg-rose-500/10',
    text: 'text-rose-600 dark:text-rose-400',
    glow: 'shadow-rose-500/10',
  },
};

export default function KPICard({ title, value, subtitle, icon: Icon, color = 'blue' }) {
  const t = themes[color];

  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${t.glow} dark:border-border-dark dark:bg-surface-dark`}>
      {/* Top gradient line */}
      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${t.icon} opacity-70`} />

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">
            {title}
          </p>
          <p className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <p className={`mt-1 truncate text-[11px] font-medium ${t.text}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`shrink-0 rounded-xl bg-gradient-to-br ${t.icon} p-2.5 shadow-lg ${t.glow} transition-transform duration-200 group-hover:scale-105`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}