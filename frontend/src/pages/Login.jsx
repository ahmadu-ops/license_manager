import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setErrors({});
    try { await login(form.email, form.password); navigate('/'); }
    catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors || {});
      else if (err.response?.status === 401) toast.error('Identifiants incorrects.');
      else toast.error('Erreur de connexion au serveur.');
    } finally { setLoading(false); }
  };

  const inputCls = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 dark:border-border-dark dark:bg-surface-darker dark:text-white';

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 dark:bg-surface-darker">
      <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-accent-500/10 blur-3xl" />

      <button onClick={toggle} className="absolute right-6 top-6 rounded-xl p-2.5 text-slate-400 transition hover:bg-white dark:hover:bg-gray-800">
        {dark ? <SunIcon className="h-5 w-5 text-amber-400" /> : <MoonIcon className="h-5 w-5" />}
      </button>

      <div className="w-full max-w-[420px] px-4 animate-fade-in">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-border-dark dark:bg-surface-dark dark:shadow-none">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-xl shadow-primary-500/25">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">
              LicenceManager
            </h1>
            <p className="mt-2 text-sm text-slate-400 dark:text-gray-500">
              Connectez-vous
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-gray-300">Adresse e-mail</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="admin@licences.sn" autoFocus />
              {errors.email && <p className="mt-1.5 text-[11px] text-red-500">{errors.email[0]}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-gray-300">Mot de passe</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputCls} placeholder="••••••••" />
              {errors.password && <p className="mt-1.5 text-[11px] text-red-500">{errors.password[0]}</p>}
            </div>
            <button type="submit" disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 py-3 text-sm font-bold text-white shadow-lg shadow-primary-600/25 transition-all hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 dark:from-primary-500 dark:to-primary-600">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Connexion…
                </span>
              ) : 'Se connecter'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}