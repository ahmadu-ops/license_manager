import { NavLink, useNavigate } from 'react-router-dom';
import {
  Squares2X2Icon,
  KeyIcon,
  BellAlertIcon,
  SunIcon,
  MoonIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import AlertBadge from '../components/AlertBadge';

const nav = [
  { to: '/',         label: 'Tableau de bord', icon: Squares2X2Icon },
  { to: '/licenses', label: 'Licences',        icon: KeyIcon },
  { to: '/alerts',   label: 'Alertes',         icon: BellAlertIcon },
];

export default function Header() {
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-border-dark/80 dark:bg-surface-dark/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Left: Brand + Nav ── */}
        <div className="flex items-center gap-8">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/25">
              <KeyIcon className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-white">
                LicenceManager
              </span>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-gray-600">
                Dakar · Sénégal
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 shadow-sm dark:bg-primary-500/15 dark:text-primary-400'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
                  }`
                }
              >
                <Icon className="h-[18px] w-[18px]" />
                <span className="hidden md:inline">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* ── Right: Actions ── */}
        <div className="flex items-center gap-2">
          <AlertBadge />

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="relative rounded-xl p-2.5 text-slate-400 transition-all hover:bg-slate-100 dark:text-gray-500 dark:hover:bg-gray-800"
            title={dark ? 'Mode clair' : 'Mode sombre'}
          >
            <div className="relative h-[18px] w-[18px]">
              <SunIcon
                className={`absolute inset-0 h-[18px] w-[18px] text-amber-500 transition-all duration-500 ${
                  dark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
                }`}
              />
              <MoonIcon
                className={`absolute inset-0 h-[18px] w-[18px] transition-all duration-500 ${
                  dark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                }`}
              />
            </div>
          </button>

          <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-border-dark" />

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-bold text-white shadow-md shadow-primary-500/20">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden lg:block">
              <p className="text-[13px] font-semibold text-slate-700 dark:text-gray-200">
                {user?.name}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-gray-500">
                Administrateur
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl p-2.5 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 dark:text-gray-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            title="Déconnexion"
          >
            <ArrowRightStartOnRectangleIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}