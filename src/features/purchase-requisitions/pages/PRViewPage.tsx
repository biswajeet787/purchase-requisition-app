import { useState } from 'react';
import { Check, Pencil, Send, X } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { toast } from 'sonner';
import { Button, buttonStyles } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { FormField } from '@/components/ui/FormField';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/StateMessage';
import { Textarea } from '@/components/ui/Input';
import { useAppSelector } from '@/hooks/useAppStore';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatDate } from '@/lib/date';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge';
import { StatusTimeline } from '../components/StatusTimeline';
import { TH } from '../components/PRTable';
import { usePR, useTransitionPR } from '../hooks/usePurchaseRequisitions';

type Decision = 'submit' | 'approve' | 'reject' | null;

const Detail = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
    <dd className="mt-1 text-sm font-medium text-slate-900">{children}</dd>
  </div>
);

export default function PRViewPage() {
  const { id } = useParams();
  const user = useAppSelector((s) => s.session.user);
  const { data: pr, isLoading, isError, error } = usePR(id);
  const transition = useTransitionPR();
  const [decision, setDecision] = useState<Decision>(null);
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState('');
  useDocumentTitle(pr ? pr.prNumber : 'Requisition');

  const close = () => {
    setDecision(null);
    setNote('');
    setNoteError('');
  };

  const confirm = () => {
    if (!pr || !decision) return;
    if (decision === 'reject' && !note.trim()) {
      setNoteError('Please give a reason for rejecting');
      return;
    }
    const to = decision === 'submit' ? 'Pending Approval' : decision === 'approve' ? 'Approved' : 'Rejected';
    transition.mutate(
      { id: pr.id, to, by: user.name, note: note.trim() || (decision === 'submit' ? 'Submitted for approval' : undefined) },
      {
        onSuccess: () => {
          toast.success(`${pr.prNumber} ${to === 'Pending Approval' ? 'submitted for approval' : to.toLowerCase()}`);
          close();
        },
        onError: (e) => {
          toast.error(e.message);
          close();
        },
      },
    );
  };

  if (isLoading) {
    return <div className="space-y-6"><Skeleton className="h-10 w-72" /><Skeleton className="h-40" /><Skeleton className="h-64" /></div>;
  }
  if (isError || !pr) {
    return (
      <Card>
        <ErrorState
          title="Couldn't load this requisition"
          description={error?.message}
          action={<Link to="/purchase-requisitions" className={buttonStyles({ variant: 'outline' })}>Back to list</Link>}
        />
      </Card>
    );
  }

  const dialog = {
    submit: { title: 'Submit for approval?', description: 'It will be sent to the approver and can no longer be edited.', label: 'Submit', variant: 'primary' as const },
    approve: { title: 'Approve this requisition?', description: `${pr.prNumber} will be marked as approved.`, label: 'Approve', variant: 'primary' as const },
    reject: { title: 'Reject this requisition?', description: 'The requester will see your reason.', label: 'Reject', variant: 'danger' as const },
  };
  const d = decision ? dialog[decision] : null;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={pr.prNumber}
        badge={<StatusBadge status={pr.status} />}
        crumbs={[{ label: 'Purchase Requisitions', to: '/purchase-requisitions' }, { label: pr.prNumber }]}
        actions={
          <>
            {pr.status === 'Draft' && (
              <>
                <Link to={`/purchase-requisitions/${pr.id}/edit`} className={buttonStyles({ variant: 'outline' })}><Pencil className="size-4" /> Edit</Link>
                <Button icon={<Send className="size-4" />} onClick={() => setDecision('submit')}>Submit for Approval</Button>
              </>
            )}
            {pr.status === 'Pending Approval' && (
              <>
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" icon={<X className="size-4" />} onClick={() => setDecision('reject')}>Reject</Button>
                <Button icon={<Check className="size-4" />} onClick={() => setDecision('approve')}>Approve</Button>
              </>
            )}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Header information" />
            <dl className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
              <Detail label="PR Number">{pr.prNumber}</Detail>
              <Detail label="Request Date">{formatDate(pr.requestDate)}</Detail>
              <Detail label="Department">{pr.department}</Detail>
              <Detail label="Requested By">{pr.requestedBy}</Detail>
              <Detail label="Priority"><PriorityBadge priority={pr.priority} /></Detail>
              <Detail label="Total Items">{pr.items.length}</Detail>
            </dl>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader title="Material items" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr>{['Material Code', 'Material Name', 'Quantity', 'Unit', 'Required Date', 'Remarks'].map((h) => <TH key={h}>{h}</TH>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pr.items.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No items added.</td></tr>
                  )}
                  {pr.items.map((it) => (
                    <tr key={it.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">{it.materialCode}</td>
                      <td className="px-4 py-3 text-slate-700">{it.materialName}</td>
                      <td className="px-4 py-3 text-slate-700">{it.quantity}</td>
                      <td className="px-4 py-3 text-slate-700">{it.unit}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700">{formatDate(it.requiredDate)}</td>
                      <td className="px-4 py-3 text-slate-500">{it.remarks || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <StatusTimeline history={pr.history} />
      </div>

      <ConfirmDialog
        open={Boolean(d)}
        title={d?.title ?? ''}
        description={d?.description}
        confirmLabel={d?.label ?? 'Confirm'}
        variant={d?.variant}
        loading={transition.isPending}
        onConfirm={confirm}
        onCancel={close}
      >
        {decision === 'reject' && (
          <FormField label="Reason" htmlFor="reject-note" required error={noteError}>
            <Textarea id="reject-note" value={note} invalid={!!noteError} onChange={(e) => { setNote(e.target.value); setNoteError(''); }} placeholder="Why is this being rejected?" />
          </FormField>
        )}
      </ConfirmDialog>
    </div>
  );
}
