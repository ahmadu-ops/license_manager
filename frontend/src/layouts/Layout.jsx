import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from './Header';

export default function Layout() {
  const { isAuth } = useAuth();

  if (!isAuth) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-surface-darker">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}