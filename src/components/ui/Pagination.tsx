import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

/** 1 … 4 5 6 … 12 style page list. */
const pageList = (page: number, total: number): (number | '…')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? (['…', p] as const) : [p]));
};

export function Pagination({ page, totalPages, total, pageSize, onChange }: PaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const nav = 'grid size-8 place-items-center rounded-lg text-sm transition-colors disabled:pointer-events-none disabled:opacity-40';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3">
      <p className="text-sm text-slate-500">
        Showing <span className="font-medium text-slate-700">{from}–{to}</span> of{' '}
        <span className="font-medium text-slate-700">{total}</span>
      </p>
      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button type="button" aria-label="Previous page" className={cn(nav, 'hover:bg-slate-100')} disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft className="size-4" />
        </button>
        {pageList(page, totalPages).map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className="px-1 text-slate-400" aria-hidden>…</span>
          ) : (
            <button
              key={p}
              type="button"
              aria-current={p === page ? 'page' : undefined}
              className={cn(nav, 'min-w-8 font-medium', p === page ? 'bg-brand-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100')}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          ),
        )}
        <button type="button" aria-label="Next page" className={cn(nav, 'hover:bg-slate-100')} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          <ChevronRight className="size-4" />
        </button>
      </nav>
    </div>
  );
}
