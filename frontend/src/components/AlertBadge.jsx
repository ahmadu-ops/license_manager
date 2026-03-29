import { useEffect, useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import api from '../hooks/useApi';

export default function AlertBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetch = () => {
      api.get('/alerts').then(({ data }) => setCount(data.length)).catch(() => {});
    };
    fetch();
    const id = setInterval(fetch, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <Link
      to="/alerts"
      className="relative rounded-xl p-2.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
    >
      <BellIcon className="h-[18px] w-[18px]" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-lg shadow-red-500/30 animate-pulse">
          {count}
        </span>
      )}
    </Link>
  );
}