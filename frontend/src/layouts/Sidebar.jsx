import { NavLink } from 'react-router-dom';
import {
  Squares2X2Icon,
  KeyIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';

const links = [
  { to: '/',         label: 'Tableau de bord', icon: Squares2X2Icon },
  { to: '/licenses', label: 'Licences',        icon: KeyIcon },
  { to: '/alerts',   label: 'Alertes',         icon: BellAlertIcon },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col border-r border-slate-200 bg-white dark:border-border-dark dark:bg-surface-dark">
      {/* ── Brand ── */}
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/25">
          <KeyIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
            LicenceManager
          </span>
          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 dark:text-gray-500">
            Gestion
          </p>
        </div>
      </div>

      {/* ── Separator ── */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-border-dark" />

      {/* ── Nav ── */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-gray-600">
          Menu principal
        </p>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500/10 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400 animate-glow'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
              }`
            }
          >
            <Icon className="h-[18px] w-[18px] transition-transform group-hover:scale-110" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer card ── */}
      <div className="m-3 rounded-xl border border-slate-100 bg-gradient-to-br from-primary-50 to-accent-400/5 p-4 dark:border-border-dark dark:from-primary-900/20 dark:to-accent-500/5">
        <p className="text-xs font-semibold text-slate-700 dark:text-gray-300">
          Besoin d'aide ?
        </p>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-gray-500">
          Consultez la documentation ou contactez le support.
        </p>
        <button className="mt-3 w-full rounded-lg bg-primary-600 py-1.5 text-[11px] font-semibold text-white shadow-md shadow-primary-600/20 transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600">
          Documentation
        </button>
      </div>
    </aside>
  );
}