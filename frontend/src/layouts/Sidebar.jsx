import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  KeyIcon,
  BellAlertIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const links = [
  { to: '/',          label: 'Tableau de bord', icon: HomeIcon },
  { to: '/licenses',  label: 'Licences',        icon: KeyIcon },
  { to: '/alerts',    label: 'Alertes',         icon: BellAlertIcon },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-[#1E293B]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white font-bold text-sm">
          LM
        </div>
        <span className="text-lg font-bold text-slate-800 dark:text-white">
          LicenceManager
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-violet-600/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400 shadow-[0_0_12px_rgba(124,58,237,0.15)]'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-700">
        <p className="text-xs text-slate-400">© 2025 LicenceManager</p>
      </div>
    </aside>
  );
}