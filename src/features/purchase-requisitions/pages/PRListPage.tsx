import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { buttonStyles, Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState, ErrorState } from '@/components/ui/StateMessage';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PRFilters } from '../components/PRFilters';
import { PRTable, PRTableSkeleton } from '../components/PRTable';
import { PAGE_SIZE } from '../constants';
import { usePRList } from '../hooks/usePurchaseRequisitions';
import { resetFilters, setPage } from '../store/filtersSlice';

export default function PRListPage() {
  useDocumentTitle('Purchase Requisitions');
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.filters);
  const { data, isLoading, isError, error, refetch, isFetching, isPlaceholderData } = usePRList({ ...filters, pageSize: PAGE_SIZE });

  const hasFilters = Boolean(filters.search || filters.status !== 'All' || filters.dateFrom || filters.dateTo);

  let body;
  if (isLoading) {
    body = <PRTableSkeleton />;
  } else if (isError) {
    body = (
      <ErrorState
        title="Couldn't load requisitions"
        description={error instanceof Error ? error.message : 'Something went wrong.'}
        action={<Button onClick={() => void refetch()} loading={isFetching}>Try again</Button>}
      />
    );
  } else if (!data || data.total === 0) {
    body = hasFilters ? (
      <EmptyState
        title="No matching requisitions"
        description="Try adjusting your search or filters."
        action={<Button variant="outline" onClick={() => dispatch(resetFilters())}>Clear filters</Button>}
      />
    ) : (
      <EmptyState
        title="No purchase requisitions yet"
        description="Create your first requisition to start the procurement workflow."
        action={<Link to="/purchase-requisitions/new" className={buttonStyles()}><Plus className="size-4" /> New requisition</Link>}
      />
    );
  } else {
    body = (
      <>
        <PRTable rows={data.data} dimmed={isPlaceholderData} />
        <Pagination page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} onChange={(p) => dispatch(setPage(p))} />
      </>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Purchase Requisitions"
        description="Track, create and approve material requests across departments."
        actions={<Link to="/purchase-requisitions/new" className={buttonStyles()}><Plus className="size-4" aria-hidden /> New Requisition</Link>}
      />
      <PRFilters />
      <Card className="overflow-hidden">{body}</Card>
    </div>
  );
}
