const themes = {
  blue: {
    icon: 'from-primary-500 to-primary-700',
    bg:   'bg-primary-50 dark:bg-primary-500/10',
    text: 'text-primary-600 dark:text-primary-400',
    glow: 'shadow-primary-500/15',
  },
  emerald: {
    icon: 'from-emerald-500 to-emerald-700',
    bg:   'bg-emerald-50 dark:bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    glow: 'shadow-emerald-500/15',
  },
  red: {
    icon: 'from-red-500 to-red-600',
    bg:   'bg-red-50 dark:bg-red-500/10',
    text: 'text-red-600 dark:text-red-400',
    glow: 'shadow-red-500/15',
  },
  amber: {
    icon: 'from-amber-500 to-orange-600',
    bg:   'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'shadow-amber-500/15',
  },
};

export default function KPICard({ title, value, subtitle, icon: Icon, color = 'blue' }) {
  const t = themes[color];

  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${t.glow} dark:border-border-dark dark:bg-surface-dark`}>
      {/* Top gradient line */}
      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${t.icon} opacity-60`} />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[12px] font-medium uppercase tracking-wider text-slate-400 dark:text-gray-500">
            {title}
          </p>
          <p className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <p className={`text-[12px] font-medium ${t.text}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`rounded-xl bg-gradient-to-br ${t.icon} p-2.5 shadow-lg ${t.glow} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}