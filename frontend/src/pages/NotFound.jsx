import { Link } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      {/* Gros 404 */}
      <div className="relative">
        <span className="text-[120px] font-black leading-none text-slate-100 dark:text-gray-800 sm:text-[180px]">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 px-6 py-3 shadow-xl shadow-primary-500/25">
            <span className="text-lg font-bold text-white">Page introuvable</span>
          </div>
        </div>
      </div>

      <p className="mt-6 max-w-md text-sm text-slate-500 dark:text-gray-400">
        Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
        Vérifiez l'URL ou retournez au tableau de bord.
      </p>

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 dark:border-border-dark dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Retour
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-primary-600/20 transition hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600"
        >
          <HomeIcon className="h-4 w-4" />
          Tableau de bord
        </Link>
      </div>
    </div>
  );
}