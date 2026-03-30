const categoryColors = {
  antivirus: 'from-red-500 to-orange-500',
  office:    'from-blue-500 to-indigo-500',
  design:    'from-pink-500 to-purple-500',
  dev:       'from-emerald-500 to-cyan-500',
  other:     'from-slate-500 to-gray-600',
};

const categoryColorsLight = {
  antivirus: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  office:    'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  design:    'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400',
  dev:       'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  other:     'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400',
};

export default function SoftwareAvatar({ name, category, size = 'md' }) {
  const initial = name?.charAt(0)?.toUpperCase() || '?';
  const gradient = categoryColors[category] || categoryColors.other;
  const flat = categoryColorsLight[category] || categoryColorsLight.other;

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-xl',
  };

  // Variante gradient pour les grandes tailles, flat pour les petites
  if (size === 'lg') {
    return (
      <div className={`flex ${sizes[size]} items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} font-bold text-white shadow-lg`}>
        {initial}
      </div>
    );
  }

  return (
    <div className={`flex ${sizes[size]} items-center justify-center rounded-xl ${flat} font-bold`}>
      {initial}
    </div>
  );
}