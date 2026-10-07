import { Link } from 'react-router';
import { SearchX } from 'lucide-react';
import { buttonStyles } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/StateMessage';
import { Card } from '@/components/ui/Card';

export function NotFoundPage() {
  return (
    <Card>
      <EmptyState
        title="Page not found"
        description="The page you are looking for doesn't exist or has been moved."
        action={<Link to="/purchase-requisitions" className={buttonStyles()}><SearchX className="size-4" /> Back to requisitions</Link>}
      />
    </Card>
  );
}
