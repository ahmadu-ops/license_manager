import {
  SunIcon,
  MoonIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AlertBadge from '../components/AlertBadge';

export default function Header() {
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/70 px-6 backdrop-blur-xl dark:border-border-dark/80 dark:bg-surface-dark/70">
      <div>
        <h2 className="text-sm font-semibold text-slate-800 dark:text-white">
          Gestion des Licences Logicielles
        </h2>
        <p className="text-[11px] text-slate-400 dark:text-gray-500">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Alertes */}
        <AlertBadge />

        {/* Toggle thème */}
        <button
          onClick={toggle}
          className="relative rounded-xl p-2.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
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

        {/* Separator */}
        <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-border-dark" />

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-bold text-white shadow-md shadow-primary-500/20">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-[13px] font-semibold text-slate-700 dark:text-gray-200">
              {user?.name}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-gray-500">
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
    </header>
  );
}