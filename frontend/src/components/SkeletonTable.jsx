export default function SkeletonTable({ rows = 5, cols = 6 }) {
  return (
    <div className="animate-pulse space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-slate-200 dark:bg-slate-700" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-4 rounded bg-slate-100 dark:bg-slate-700/50" />
          ))}
        </div>
      ))}
    </div>
  );
}