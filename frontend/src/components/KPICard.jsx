export default function KPICard({ title, value, icon: Icon, color = 'violet' }) {
  const colors = {
    violet:  'from-violet-500 to-violet-700',
    emerald: 'from-emerald-500 to-emerald-700',
    red:     'from-red-500 to-red-700',
    amber:   'from-amber-500 to-amber-700',
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-[#1E293B]">
      {/* Gradient accent bar */}
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${colors[color]}`} />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">{value}</p>
        </div>
        <div className={`rounded-xl bg-gradient-to-br ${colors[color]} p-3 text-white shadow-lg`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}