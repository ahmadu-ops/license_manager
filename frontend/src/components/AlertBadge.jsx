import { useEffect, useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import api from '../hooks/useApi';

export default function AlertBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = () => {
      api.get('/alerts')
        .then(({ data }) => setCount(data.length))
        .catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, 60_000); // refresh chaque minute
    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      to="/alerts"
      className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
    >
      <BellIcon className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white animate-pulse">
          {count}
        </span>
      )}
    </Link>
  );
}