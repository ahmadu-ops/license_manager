import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LicenseIndex from './pages/LicenseIndex';
import LicenseForm from './pages/LicenseForm';
import LicenseShow from './pages/LicenseShow';
import Alerts from './pages/Alerts';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/licenses" element={<LicenseIndex />} />
              <Route path="/licenses/new" element={<LicenseForm />} />
              <Route path="/licenses/:id" element={<LicenseShow />} />
              <Route path="/licenses/:id/edit" element={<LicenseForm />} />
              <Route path="/alerts" element={<Alerts />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            className: '!rounded-xl !bg-white !text-slate-800 !shadow-xl !border !border-slate-100 dark:!bg-surface-dark dark:!text-gray-100 dark:!border-border-dark',
            duration: 3000,
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}