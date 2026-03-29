import { SunIcon, MoonIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
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
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur dark:border-slate-700 dark:bg-[#0F172A]/80">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
        Gestion de Licences
      </h2>

      <div className="flex items-center gap-3">
        {/* Alertes */}
        <AlertBadge />

        {/* Toggle thème */}
        <button
          onClick={toggle}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          title={dark ? 'Mode clair' : 'Mode sombre'}
        >
          {dark ? (
            <SunIcon className="h-5 w-5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <MoonIcon className="h-5 w-5 transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>

        {/* User */}
        <span className="hidden text-sm text-slate-600 dark:text-slate-300 sm:block">
          {user?.name}
        </span>

        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          title="Déconnexion"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}