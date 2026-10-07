import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone = 'slate' | 'blue' | 'amber' | 'green' | 'red';

const tones: Record<BadgeTone, { wrap: string; dot: string }> = {
  slate: { wrap: 'bg-slate-100 text-slate-700 ring-slate-200', dot: 'bg-slate-400' },
  blue: { wrap: 'bg-blue-50 text-blue-700 ring-blue-200', dot: 'bg-blue-500' },
  amber: { wrap: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-500' },
  green: { wrap: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500' },
  red: { wrap: 'bg-red-50 text-red-700 ring-red-200', dot: 'bg-red-500' },
};

export function Badge({ tone = 'slate', dot = true, children }: { tone?: BadgeTone; dot?: boolean; children: ReactNode }) {
  const t = tones[tone];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset', t.wrap)}>
      {dot && <span className={cn('size-1.5 rounded-full', t.dot)} aria-hidden />}
      {children}
    </span>
  );
}
