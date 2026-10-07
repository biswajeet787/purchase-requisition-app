import { Eye, Pencil } from 'lucide-react';
import { Link } from 'react-router';
import { buttonStyles } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/date';
import type { PurchaseRequisition } from '../types';
import { StatusBadge } from './StatusBadge';

const HEADERS = ['PR Number', 'Date', 'Department', 'Requested By', 'Status', 'Total Items', 'Actions'];

export const TH = ({ children, align }: { children: string; align?: 'right' | 'center' }) => (
  <th scope="col" className={`bg-brand-900 px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap text-white uppercase ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`}>{children}</th>
);

export function PRTable({ rows, dimmed }: { rows: PurchaseRequisition[]; dimmed?: boolean }) {
  return (
    <div className={`overflow-x-auto transition-opacity ${dimmed ? 'opacity-60' : ''}`}>
      <table className="w-full min-w-[820px] text-sm">
        <thead>
          <tr>{HEADERS.map((h) => <TH key={h} align={h === 'Total Items' ? 'center' : h === 'Actions' ? 'right' : undefined}>{h}</TH>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((pr) => {
            const editable = pr.status === 'Draft';
            return (
              <tr key={pr.id} className="transition-colors hover:bg-slate-50/80">
                <td className="px-4 py-3.5 font-semibold text-brand-800">
                  <Link to={`/purchase-requisitions/${pr.id}`} className="hover:underline">{pr.prNumber}</Link>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">{formatDate(pr.requestDate)}</td>
                <td className="px-4 py-3.5 text-slate-700">{pr.department}</td>
                <td className="px-4 py-3.5 text-slate-700">{pr.requestedBy}</td>
                <td className="px-4 py-3.5"><StatusBadge status={pr.status} /></td>
                <td className="px-4 py-3.5 text-center font-medium text-slate-700">{pr.items.length}</td>
                <td className="px-4 py-3.5">
                  <div className="flex justify-end gap-2">
                    <Link to={`/purchase-requisitions/${pr.id}`} className={buttonStyles({ variant: 'outline', size: 'sm' })}>
                      <Eye className="size-3.5" aria-hidden /> View
                    </Link>
                    {editable ? (
                      <Link to={`/purchase-requisitions/${pr.id}/edit`} className={buttonStyles({ size: 'sm' })}>
                        <Pencil className="size-3.5" aria-hidden /> Edit
                      </Link>
                    ) : (
                      <span aria-disabled="true" title="Only draft requisitions can be edited" className={buttonStyles({ size: 'sm', className: 'cursor-not-allowed opacity-40' })}>
                        <Pencil className="size-3.5" aria-hidden /> Edit
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function PRTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Loading requisitions" className="divide-y divide-slate-100">
      <div className="h-11 bg-brand-900" />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-6 px-4 py-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="ml-auto h-8 w-32" />
        </div>
      ))}
    </div>
  );
}
