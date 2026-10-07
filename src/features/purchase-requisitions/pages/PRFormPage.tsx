import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Send } from 'lucide-react';
import { FormProvider, useForm, type Resolver } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { Button, buttonStyles } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PageHeader } from '@/components/ui/PageHeader';
import { ErrorState } from '@/components/ui/StateMessage';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAppSelector } from '@/hooks/useAppStore';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { MaterialItemsTable } from '../components/MaterialItemsTable';
import { PRHeaderForm } from '../components/PRHeaderForm';
import { createDefaults, toFormValues } from '../formDefaults';
import { useNextPRNumber, usePR, useSavePR } from '../hooks/usePurchaseRequisitions';
import { draftSchema, submitSchema, type PRFormValues } from '../schemas';
import type { PurchaseRequisition, SaveAction } from '../types';

function PRForm({ existing, prNumber }: { existing?: PurchaseRequisition; prNumber: string }) {
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.session.user);
  const save = useSavePR();
  const modeRef = useRef<SaveAction>('draft');
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Draft and Submit validate against different schemas.
  const resolver: Resolver<PRFormValues> = (values, context, options) =>
    zodResolver(modeRef.current === 'submit' ? submitSchema : draftSchema)(values, context, options) as ReturnType<Resolver<PRFormValues>>;

  const methods = useForm<PRFormValues>({
    resolver,
    mode: 'onTouched',
    defaultValues: existing ? toFormValues(existing) : createDefaults(user.name),
  });
  const { handleSubmit, trigger, formState: { isDirty } } = methods;

  const saved = save.isSuccess;
  useEffect(() => {
    if (!isDirty || saved) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isDirty, saved]);

  const onValid = (values: PRFormValues) => {
    const action = modeRef.current;
    save.mutate(
      { id: existing?.id, values, action, by: user.name },
      {
        onSuccess: (pr) => {
          toast.success(action === 'submit' ? `${pr.prNumber} submitted for approval` : `${pr.prNumber} saved as draft`);
          navigate(`/purchase-requisitions/${pr.id}`);
        },
        onError: (e) => toast.error(e.message),
      },
    );
  };

  const saveDraft = () => {
    modeRef.current = 'draft';
    void handleSubmit(onValid, () => toast.error('Please fix the highlighted fields'))();
  };

  const askSubmit = async () => {
    modeRef.current = 'submit';
    const ok = await trigger(undefined, { shouldFocus: true });
    if (ok) setConfirmOpen(true);
    else toast.error('Please fix the highlighted fields before submitting');
  };

  const confirmSubmit = () => {
    setConfirmOpen(false);
    void handleSubmit(onValid)();
  };

  const cancel = () => {
    if (isDirty && !window.confirm('Discard your unsaved changes?')) return;
    navigate(existing ? `/purchase-requisitions/${existing.id}` : '/purchase-requisitions');
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()} noValidate className="space-y-6 pb-24">
        <PRHeaderForm prNumber={prNumber} />
        <MaterialItemsTable />

        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white/90 backdrop-blur lg:left-64">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-end gap-2 px-4 py-3 sm:px-8">
            <Button variant="ghost" onClick={cancel} disabled={save.isPending}>Cancel</Button>
            <Button variant="outline" icon={<Save className="size-4" />} onClick={saveDraft} loading={save.isPending && modeRef.current === 'draft'} disabled={save.isPending}>
              Save as Draft
            </Button>
            <Button icon={<Send className="size-4" />} onClick={() => void askSubmit()} loading={save.isPending && modeRef.current === 'submit'} disabled={save.isPending}>
              Submit for Approval
            </Button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        title="Submit for approval?"
        description="Once submitted, this requisition is sent to the approver and can no longer be edited."
        confirmLabel="Submit"
        onConfirm={confirmSubmit}
        onCancel={() => setConfirmOpen(false)}
      />
    </FormProvider>
  );
}

export default function PRFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  useDocumentTitle(isEdit ? 'Edit Requisition' : 'New Requisition');

  const pr = usePR(id);
  const next = useNextPRNumber(!isEdit);

  const crumbs = [{ label: 'Purchase Requisitions', to: '/purchase-requisitions' }, { label: isEdit ? 'Edit' : 'New' }];
  const header = (
    <PageHeader
      title={isEdit ? `Edit ${pr.data?.prNumber ?? 'requisition'}` : 'Create Purchase Requisition'}
      description="Fill in the header, add the materials you need, then save a draft or submit for approval."
      crumbs={crumbs}
    />
  );

  let content;
  if (isEdit && pr.isLoading) {
    content = <div className="space-y-6"><Skeleton className="h-64" /><Skeleton className="h-72" /></div>;
  } else if (isEdit && pr.isError) {
    content = (
      <Card>
        <ErrorState
          title="Couldn't load this requisition"
          description={pr.error.message}
          action={<Link to="/purchase-requisitions" className={buttonStyles({ variant: 'outline' })}>Back to list</Link>}
        />
      </Card>
    );
  } else if (isEdit && pr.data && pr.data.status !== 'Draft') {
    content = (
      <Card>
        <ErrorState
          title="This requisition can't be edited"
          description={`It is already "${pr.data.status}". Only drafts are editable.`}
          action={<Link to={`/purchase-requisitions/${pr.data.id}`} className={buttonStyles()}>View requisition</Link>}
        />
      </Card>
    );
  } else if (isEdit && pr.data) {
    content = <PRForm key={pr.data.id} existing={pr.data} prNumber={pr.data.prNumber} />;
  } else {
    content = <PRForm key="new" prNumber={next.data ?? 'Generating…'} />;
  }

  return <div className="animate-fade-in">{header}{content}</div>;
}
