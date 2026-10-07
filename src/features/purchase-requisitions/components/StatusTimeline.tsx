import { Card, CardHeader } from '@/components/ui/Card';
import { formatDateTime } from '@/lib/date';
import type { PRHistoryEntry } from '../types';
import { StatusBadge } from './StatusBadge';

export function StatusTimeline({ history }: { history: PRHistoryEntry[] }) {
  const entries = [...history].reverse();
  return (
    <Card>
      <CardHeader title="Approval history" />
      <ol className="space-y-5 p-5">
        {entries.map((h, i) => (
          <li key={`${h.at}-${i}`} className="relative pl-6">
            {i < entries.length - 1 && <span className="absolute top-3 bottom-[-1.25rem] left-[5px] w-px bg-slate-200" aria-hidden />}
            <span className="absolute top-1 left-0 size-3 rounded-full bg-brand-600 ring-4 ring-brand-100" aria-hidden />
            <StatusBadge status={h.status} />
            <p className="mt-1.5 text-sm text-slate-700">{h.note ?? '—'}</p>
            <p className="text-xs text-slate-500">{h.by} · {formatDateTime(h.at)}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}
